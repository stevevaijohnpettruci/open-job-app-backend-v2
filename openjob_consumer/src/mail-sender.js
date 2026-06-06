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

  // Parameter diubah untuk menerima ownerEmail
  async sendApplicationNotification({ ownerEmail, applicantEmail, applicantName, jobTitle, companyName, status }) {
    const subject = `New Job Application - ${jobTitle} at ${companyName}`;
    const html = `
      <h2>New Job Application Received</h2>
      <p>Hello,</p>
      <p>A new candidate has applied for your job posting <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
      <h3>Applicant Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${applicantName}</li>
        <li><strong>Email:</strong> ${applicantEmail}</li>
      </ul>
      <p>Current application status: <strong>${status}</strong></p>
      <br/>
      <p>Please log in to OpenJob to review this application.</p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: ownerEmail, // Mengirim ke email pemilik lowongan
        subject,
        html,
      });
      console.log(`[MailSender] Email sent to Job Owner (${ownerEmail}) for job: ${jobTitle}`);
    } catch (err) {
      console.error('[MailSender] Failed to send email:', err.message);
    }
  }
}

export default new MailSender();