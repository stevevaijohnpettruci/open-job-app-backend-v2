import 'dotenv/config';
import amqplib from 'amqplib';
import { Pool } from 'pg';
import MailSender from './mail-sender.js';

const pool = new Pool();

const QUEUE_NAME = 'job_applications';
const AMQP_URL =
  process.env.AMQP_URL ||
  `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;

async function startConsumer() {
  let connection;
  let channel;

  try {
    connection = await amqplib.connect(AMQP_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Process one message at a time
    channel.prefetch(1);

    console.log(`[Consumer] Waiting for messages in queue: "${QUEUE_NAME}"`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (!msg) return;

      try {
        const { application_id } = JSON.parse(msg.content.toString());
        console.log(`[Consumer] Received application_id: ${application_id}`);

        const query = {
          text: `
            SELECT 
              u_applicant.email AS applicant_email,
              u_applicant.name AS applicant_name,
              j.title AS job_title,
              c.name AS company_name,
              u_owner.email AS owner_email,
              a.status
            FROM applications a
            JOIN users u_applicant ON a.user_id = u_applicant.id
            JOIN jobs j ON a.job_id = j.id
            JOIN companies c ON j.company_id = c.id
            JOIN users u_owner ON j.user_id = u_owner.id
            WHERE a.id = $1
          `,
          values: [application_id],
        };

        const result = await pool.query(query);

        if (!result.rows.length) {
          throw new Error(
            `Data lamaran dengan ID ${application_id} tidak ditemukan.`,
          );
        }

        const applicationData = result.rows[0];

        await MailSender.sendApplicationNotification({
          ownerEmail: applicationData.owner_email,
          applicantEmail: applicationData.applicant_email,
          applicantName: applicationData.applicant_name,
          jobTitle: applicationData.job_title,
          companyName: applicationData.company_name,
          status: applicationData.status,
        });

        channel.ack(msg);
        console.log(
          '[Consumer] Message processed and notification sent successfully',
        );
      } catch (err) {
        console.error('[Consumer] Error processing message:', err.message);
        // Reject and requeue the message
        channel.nack(msg, false, true);
      }
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('[Consumer] Shutting down...');
      await channel.close();
      await connection.close();
      await pool.end(); // Tutup koneksi pool
      process.exit(0);
    });
  } catch (err) {
    console.error('[Consumer] Connection error:', err.message);
    console.log('[Consumer] Retrying in 5 seconds...');
    setTimeout(startConsumer, 5000);
  }
}

startConsumer();
