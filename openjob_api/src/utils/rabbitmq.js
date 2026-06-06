import amqplib from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let connection;
let channel;

const AMQP_URL =
  process.env.AMQP_URL ||
  `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
const QUEUE_NAME = 'job_applications';

async function connectRabbitMQ() {
  try {
    connection = await amqplib.connect(AMQP_URL);
    channel = await connection.createChannel();

    // Declare queue
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log('Connected to RabbitMQ');
    return channel;
  } catch (err) {
    console.error('RabbitMQ connection error:', err);
    setTimeout(connectRabbitMQ, 5000); // Retry connection
  }
}

async function publishMessage(message) {
  if (!channel) {
    await connectRabbitMQ();
  }

  try {
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log('Message published:', message);
  } catch (err) {
    console.error('Error publishing message:', err);
  }
}

async function consumeMessages(callback) {
  if (!channel) {
    await connectRabbitMQ();
  }

  try {
    await channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        console.log('Message consumed:', content);
        await callback(content);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error('Error consuming messages:', err);
  }
}

export { connectRabbitMQ, publishMessage, consumeMessages, QUEUE_NAME };
