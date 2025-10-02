## 🔐 Authentication Module (`auth.js`)

### Core Authentication

| Method | Endpoint         | Description                            |
| ------ | ---------------- | -------------------------------------- |
| POST   | `/auth/login`    | Login dengan email dan password        |
| POST   | `/auth/register` | Registrasi user baru                   |
| POST   | `/auth/refresh`  | Refresh token (jika backend mendukung) |
| GET    | `/auth/google`   | Redirect ke Google OAuth login         |

### Email Verification

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| POST   | `/auth/send-verification` | Kirim email verifikasi        |
| POST   | `/auth/verify-email`      | Verifikasi email dengan token |

### User Profile

| Method | Endpoint    | Description              |
| ------ | ----------- | ------------------------ |
| GET    | `/users/me` | Get current user profile |
| PATCH  | `/users/me` | Update user profile      |

---

## 🏫 Classes Module (`classes.js`)

### Basic CRUD

| Method | Endpoint             | Description                         |
| ------ | -------------------- | ----------------------------------- |
| GET    | `/classes`           | Get semua kelas untuk user saat ini |
| GET    | `/classes/{id}`      | Get detail kelas berdasarkan ID     |
| POST   | `/classes`           | Buat kelas baru (instructor only)   |
| PATCH  | `/classes/{classId}` | Update kelas (instructor only)      |
| DELETE | `/classes/{classId}` | Hapus kelas (instructor only)       |

### Class Management

| Method | Endpoint                              | Description                                      |
| ------ | ------------------------------------- | ------------------------------------------------ |
| POST   | `/classes/join`                       | Gabung ke kelas menggunakan token (student only) |
| GET    | `/classes/preview/{classToken}`       | Preview kelas sebelum join                       |
| POST   | `/classes/{classId}/regenerate-token` | Generate ulang token kelas (instructor only)     |

### Class Content

| Method | Endpoint                         | Description                         |
| ------ | -------------------------------- | ----------------------------------- |
| GET    | `/classes/{classId}/assignments` | Get assignments dalam kelas         |
| GET    | `/classes/{classId}/history`     | Get riwayat kelas (instructor only) |

---

## 📝 Assignments Module (`assignments.js`)

### Assignment CRUD

| Method | Endpoint                         | Description                            |
| ------ | -------------------------------- | -------------------------------------- |
| POST   | `/classes/{classId}/assignments` | Buat assignment baru (instructor only) |
| GET    | `/classes/{classId}/assignments` | Get assignments dalam kelas            |
| GET    | `/assignments/{assignmentId}`    | Get detail assignment                  |
| PATCH  | `/assignments/{assignmentId}`    | Update assignment (instructor only)    |
| DELETE | `/assignments/{assignmentId}`    | Hapus assignment (instructor only)     |

### Assignment Monitoring

| Method | Endpoint                                                    | Description                                        |
| ------ | ----------------------------------------------------------- | -------------------------------------------------- |
| GET    | `/classes/{classId}/assignments/{assignmentId}/submissions` | Get submissions untuk assignment (instructor only) |

---

## 📤 Submissions Module (`submissions.js`)

### Submission CRUD

| Method | Endpoint                                  | Description                             |
| ------ | ----------------------------------------- | --------------------------------------- |
| POST   | `/assignments/{assignmentId}/submissions` | Buat submission baru (student only)     |
| GET    | `/submissions/{submissionId}`             | Get detail submission                   |
| PATCH  | `/submissions/{submissionId}/content`     | Update konten submission (auto-save)    |
| POST   | `/submissions/{submissionId}/submit`      | Submit final submission (student only)  |
| PATCH  | `/submissions/{submissionId}/grade`       | Beri nilai submission (instructor only) |

### Submission History & Export

| Method | Endpoint                                      | Description                    |
| ------ | --------------------------------------------- | ------------------------------ |
| GET    | `/submissions/history`                        | Get riwayat submission student |
| GET    | `/submissions/{submissionId}/download`        | Download submission (PDF/DOCX) |
| POST   | `/submissions/{submissionId}/download-custom` | Download dengan opsi custom    |
| POST   | `/submissions/download-bulk`                  | Download multiple submissions  |

---

## 🔍 Plagiarism Module (`plagiarism.js`)

### Plagiarism Checking

| Method | Endpoint                                        | Description                         |
| ------ | ----------------------------------------------- | ----------------------------------- |
| POST   | `/submissions/{submissionId}/check-plagiarism`  | Check plagiarisme (instructor only) |
| GET    | `/submissions/{submissionId}/plagiarism-report` | Get laporan plagiarisme             |
| GET    | `/submissions/{submissionId}/plagiarism-status` | Get status pengecekan plagiarisme   |

### Queue Management

| Method | Endpoint                   | Description                       |
| ------ | -------------------------- | --------------------------------- |
| GET    | `/plagiarism/queue-stats`  | Get statistik antrian plagiarisme |
| DELETE | `/plagiarism/jobs/{jobId}` | Cancel pengecekan plagiarisme     |

---

## 💳 Payments Module (`payments.js`)

### Transaction Management

| Method | Endpoint                                        | Description                         |
| ------ | ----------------------------------------------- | ----------------------------------- |
| POST   | `/payments/create-transaction`                  | Buat transaksi pembayaran           |
| GET    | `/payments/transactions`                        | Get riwayat transaksi dengan filter |
| GET    | `/payments/transactions/{transactionId}`        | Get detail transaksi                |
| PATCH  | `/payments/transactions/{transactionId}/cancel` | Cancel pembayaran                   |

### Payment Status & Methods

| Method | Endpoint                                              | Description                    |
| ------ | ----------------------------------------------------- | ------------------------------ |
| GET    | `/payments/status/{orderId}`                          | Get status pembayaran          |
| GET    | `/payments/methods`                                   | Get metode pembayaran tersedia |
| GET    | `/payments/stats`                                     | Get statistik pembayaran       |
| POST   | `/payments/transactions/{transactionId}/generate-url` | Generate URL pembayaran        |

---

## 📁 Storage/Upload Module (`upload.js`)

### File Upload

| Method | Endpoint                     | Description               |
| ------ | ---------------------------- | ------------------------- |
| POST   | `/storage/upload/submission` | Upload file submission    |
| POST   | `/storage/upload/profile`    | Upload foto profil        |
| POST   | `/storage/upload/assignment` | Upload dokumen assignment |
| POST   | `/storage/upload`            | Upload file umum          |

### Chunked Upload (untuk file besar)

| Method | Endpoint                             | Description                        |
| ------ | ------------------------------------ | ---------------------------------- |
| POST   | `/storage/upload/init`               | Inisialisasi chunked upload        |
| POST   | `/storage/upload/chunk`              | Upload chunk file                  |
| POST   | `/storage/upload/complete`           | Selesaikan chunked upload          |
| DELETE | `/storage/upload/cleanup/{uploadId}` | Cleanup upload yang gagal          |
| DELETE | `/storage/upload/cancel/{uploadId}`  | Cancel upload yang sedang berjalan |

### File Management

| Method | Endpoint                              | Description            |
| ------ | ------------------------------------- | ---------------------- |
| GET    | `/storage/files/{fileId}`             | Get info file          |
| GET    | `/storage/files/{fileId}/metadata`    | Get metadata file      |
| GET    | `/storage/refresh-url/{cloudKey}`     | Refresh pre-signed URL |
| GET    | `/storage/download/{fileId}`          | Download file          |
| DELETE | `/storage/files/{fileId}`             | Hapus file             |
| GET    | `/storage/upload/progress/{uploadId}` | Get progress upload    |

---

## 📡 WebSocket Events (`websocket.js`)

### Connection Events

- `connect` — Event koneksi berhasil
- `disconnect` — Event koneksi terputus
- `reconnect` — Event reconnect berhasil
- `ping/pong` — Heartbeat mechanism

### Application Events

- `updateContent` — Auto-save konten editor
- `updateContentResponse` — Respons update konten
- `notification` — Notifikasi real-time
- `submissionUpdated` — Update submission
- `submissionListUpdated` — Update daftar submission

### Room Management

- `joinMonitoring` — Join monitoring room
- `leaveMonitoring` — Leave monitoring room
- `joinSubmission` — Join submission room
- `leaveSubmission` — Leave submission room
- `joinClass` — Join class room
- `leaveClass` — Leave class room
- `leaveAllRooms` — Leave semua room

### Plagiarism Events

- `plagiarismProgress` — Progress pengecekan plagiarisme
- `plagiarismComplete` — Plagiarisme selesai dicek
- `plagiarismFailed` — Plagiarisme gagal dicek

---

## 📊 Summary

**Total Endpoint HTTP:** 47 endpoint  
**Total WebSocket Events:** 15+ events

### Breakdown per Module

| Module         | Endpoint Count |
| -------------- | -------------- |
| Authentication | 6              |
| Classes        | 8              |
| Assignments    | 5              |
| Submissions    | 9              |
| Plagiarism     | 5              |
| Payments       | 8              |
| Storage/Upload | 16             |

### Method Distribution

| Method | Count | Percentage |
| ------ | ----- | ---------- |
| GET    | 20    | 42.6%      |
| POST   | 18    | 38.3%      |
| PATCH  | 5     | 10.6%      |
| DELETE | 4     | 8.5%       |

---

**Catatan:**  
Daftar ini dibuat berdasarkan implementasi aktual di frontend services, bukan dari dokumentasi backend. Beberapa endpoint mungkin belum diimplementasi di backend atau memiliki path yang berbeda.
