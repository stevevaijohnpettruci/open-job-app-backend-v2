# OpenJob Consumer

Consumer service untuk OpenJob API yang memproses notifikasi lamaran kerja melalui RabbitMQ.

## Cara Kerja

1. Consumer mendengarkan pesan di RabbitMQ queue `job_applications`
2. Saat ada lamaran baru yang dikirim via API, pesan diterima oleh consumer
3. Consumer mengirimkan email notifikasi ke pelamar menggunakan Nodemailer

## Setup

```bash
npm install
```

Buat file `.env`:
```
AMQP_URL=amqp://guest:guest@localhost:5672
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## Menjalankan

```bash
# Production
npm start

# Development
npm run start:dev
```

## Prasyarat

- RabbitMQ berjalan di localhost:5672
- SMTP server yang valid untuk pengiriman email
