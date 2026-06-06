import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: to,
      subject: subject,
      html: html,
    });
    console.log('Email sent:', info.response);
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
}

export default sendEmail;
