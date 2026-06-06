import nodemailer from 'nodemailer';

class MailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_PORT == 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  // Kirim notifikasi ke pemilik lowongan
  async sendApplicationNotification({ ownerEmail, applicantEmail, applicantName, jobTitle, companyName, status }) {
    const subject = `📋 New Job Application - ${jobTitle} at ${companyName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: white; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-top: 0;">🎉 New Job Application Received</h2>
          <p style="color: #666;">Hello,</p>
          <p style="color: #666;">A new candidate has applied for your job posting <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📌 Applicant Details:</h3>
            <ul style="list-style: none; padding: 0; color: #666;">
              <li style="padding: 5px 0;"><strong>Name:</strong> ${applicantName}</li>
              <li style="padding: 5px 0;"><strong>Email:</strong> <a href="mailto:${applicantEmail}">${applicantEmail}</a></li>
            </ul>
          </div>

          <p style="color: #666;"><strong>Status:</strong> <span style="background-color: #e7f3ff; padding: 3px 8px; border-radius: 3px; color: #0066cc;">${status}</span></p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">Please log in to OpenJob dashboard to review and manage this application.</p>
            <a href="${process.env.APP_URL || 'https://openjob.app'}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Dashboard</a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
            <p>OpenJob - Job Application Platform</p>
          </div>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: ownerEmail,
        subject,
        html,
      });
      console.log(`[MailSender] ✅ Notification email sent to Job Owner (${ownerEmail}) for job: ${jobTitle}`);
    } catch (err) {
      console.error('[MailSender] ❌ Failed to send email:', err.message);
      throw err;
    }
  }

  // Kirim notifikasi ke pelamar (opsional)
  async sendApplicationConfirmation({ applicantEmail, applicantName, jobTitle, companyName }) {
    const subject = `📝 Application Received - ${jobTitle} at ${companyName}`;
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: white; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333; margin-top: 0;">✅ Application Received</h2>
          <p style="color: #666;">Hi ${applicantName},</p>
          <p style="color: #666;">Thank you for applying to the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
          
          <p style="color: #666;">We have received your application and will review it carefully. You will be notified about the next steps soon.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999; font-size: 12px;">
            <p>OpenJob - Job Application Platform</p>
          </div>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: applicantEmail,
        subject,
        html,
      });
      console.log(`[MailSender] ✅ Confirmation email sent to applicant (${applicantEmail})`);
    } catch (err) {
      console.error('[MailSender] ❌ Failed to send confirmation email:', err.message);
      throw err;
    }
  }
}

export default new MailSender();
