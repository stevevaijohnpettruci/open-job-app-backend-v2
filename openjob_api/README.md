# OpenJob Application - Submission

Submission ini terdiri dari **2 project independen** yang saling berkomunikasi melalui RabbitMQ:

```
submission/
├── openjob_api/          ← API Server (Express.js)
│   ├── package.json
│   └── src/
└── openjob_consumer/     ← Consumer RabbitMQ (Nodemailer)
    ├── package.json
    └── src/
```

> **Catatan:** Folder `openjob_api` adalah folder root project ini (semua file di luar `openjob_consumer/`).

---

## openjob_api

RESTful API untuk platform job marketplace OpenJob.

### Teknologi
- Express.js, PostgreSQL, Redis, RabbitMQ, JWT, Multer

### Setup

```bash
npm install
```

Buat file `.env`:
```
HOST=0.0.0.0
PORT=3000
PGUSER=...
PGHOST=localhost
PGPASSWORD=...
PGDATABASE=open-job-db
PGPORT=5432
REDIS_HOST=localhost
REDIS_PORT=6379
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest
AMQP_URL=amqp://guest:guest@localhost:5672
ACCESS_TOKEN_KEY=...
REFRESH_TOKEN_KEY=...
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Migrasi Database

```bash
npm run migrate up
```

### Menjalankan

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

### Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | /users | Daftar user baru |
| GET | /users/:id | Get user by id |
| POST | /authentications | Login |
| PUT | /authentications | Refresh token |
| DELETE | /authentications | Logout |
| GET | /profile | Get profil user login |
| GET | /profile/applications | Get lamaran user login |
| GET | /profile/bookmarks | Get bookmark user login |
| POST | /companies | Tambah perusahaan |
| GET | /companies | Get semua perusahaan |
| GET | /companies/:id | Get perusahaan by id |
| PUT | /companies/:id | Update perusahaan |
| DELETE | /companies/:id | Hapus perusahaan |
| POST | /categories | Tambah kategori |
| GET | /categories | Get semua kategori |
| GET | /categories/:id | Get kategori by id |
| PUT | /categories/:id | Update kategori |
| DELETE | /categories/:id | Hapus kategori |
| POST | /jobs | Tambah lowongan |
| GET | /jobs | Get semua lowongan |
| GET | /jobs/:id | Get lowongan by id |
| GET | /jobs/company/:id | Get lowongan by company |
| GET | /jobs/category/:id | Get lowongan by category |
| PUT | /jobs/:id | Update lowongan |
| DELETE | /jobs/:id | Hapus lowongan |
| POST | /applications | Apply lowongan (publish ke RabbitMQ) |
| GET | /applications | Get semua lamaran |
| GET | /applications/:id | Get lamaran by id |
| GET | /applications/user/:id | Get lamaran by user |
| GET | /applications/job/:id | Get lamaran by job |
| PUT | /applications/:id | Update status lamaran |
| DELETE | /applications/:id | Hapus lamaran |
| POST | /jobs/:id/bookmark | Tambah bookmark |
| GET | /bookmarks | Get semua bookmark user |
| GET | /jobs/:id/bookmark/:bookmarkId | Get bookmark by id |
| DELETE | /jobs/:id/bookmark | Hapus bookmark |
| POST | /documents | Upload dokumen PDF |
| GET | /documents | Get semua dokumen |
| GET | /documents/:id | Download/view dokumen |
| DELETE | /documents/:id | Hapus dokumen |

---

## openjob_consumer

Consumer service yang mendengarkan RabbitMQ queue `job_applications` dan mengirim email notifikasi ke pelamar.

### Setup & Menjalankan

```bash
cd openjob_consumer
npm install
npm start
```

### Alur Kerja RabbitMQ

```
openjob_api                     openjob_consumer
    │                                  │
    │  POST /applications               │
    │  → createApplication()           │
    │  → publishMessage(queue)  ──────►│
    │                                  │  consume message
    │                                  │  → sendEmail(applicant)
```

---

## Prasyarat

- Node.js >= 18
- PostgreSQL
- Redis
- RabbitMQ
- SMTP server (Gmail, dll)
