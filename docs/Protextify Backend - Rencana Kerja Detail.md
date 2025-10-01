# Protextify Backend — Rencana Kerja Detail

Dokumen ini adalah checklist komprehensif untuk membangun backend Protextify. Setiap tugas diperkaya dengan konteks arsitektur, alur bisnis, dan praktik terbaik.

---

## 🚀 **Milestone 1: Inisiasi & Setup Proyek (Pondasi)**

**Tujuan:** Menyiapkan lingkungan development yang bersih, terstruktur, dan siap dikembangkan.

### 1.1 **Setup Project & Version Control** ✅

- **Tugas:** Inisialisasi Git repository (GitHub/GitLab). Buat branch `main` dan `develop`.
- **Catatan:**
  - `main`: kode produksi stabil.
  - `develop`: integrasi fitur.
  - Konfigurasikan `.gitignore` untuk `node_modules`, `.env`, dan `dist`.

### 1.2 **Inisialisasi Project NestJS** ✅

- **Tugas:** Install NestJS CLI dan buat project baru.
- **Catatan:** Struktur proyek awal, jalankan lokal dengan `npm run start:dev`.

### 1.3 **Setup Database & ORM** ✅

- **Tugas:** Install Prisma, inisialisasi, dan hubungkan ke PostgreSQL.
- **Catatan:** Gunakan `npx prisma init --datasource-provider postgresql`, atur `DATABASE_URL` di `.env`.

### 1.4 **Containerization (Docker)** ✅

- **Tugas:** Buat `Dockerfile` dan `docker-compose.yml`.
- **Catatan:** Definisikan service: `postgres`, `redis`, dan `app`. Jalankan dengan satu perintah: `docker-compose up`.

### 1.5 **Konfigurasi Linting & Formatting** ✅

- **Tugas:** Setup ESLint & Prettier.
- **Catatan:** Tambahkan script lint dan format di `package.json`.

### 1.6 **Setup Konfigurasi & Environment** ✅

- **Tugas:** Install `@nestjs/config` dan validasi environment variables.
- **Catatan:** Validasi variabel krusial dengan Joi/class-validator.

### 1.7 **Setup Security Middleware** ✅

- **Tugas:** Implementasi middleware keamanan.
- **Catatan:**
  - Tambahkan `helmet` untuk proteksi HTTP headers.
  - Integrasi `nestjs-throttler` untuk rate limiting (misal: endpoint login).
  - Tambahkan logger terstruktur (`Winston`/`Pino`) untuk audit dan monitoring.

---

## 🏗️ **Milestone 2: Desain Sistem & Database (Blueprint)**

**Tujuan:** Memfinalkan arsitektur data dan API.

### 2.1 **Desain Skema Database** ✅

- Definisikan model utama di `schema.prisma`:
  - **User** (role: INSTRUCTOR | STUDENT)
  - **Class**
  - **Assignment**
  - **Submission**
  - **PaymentTransaction**
  - **PlagiarismCheckResult**
- Relasi many-to-many untuk enrollment.
- Jalankan migrasi: `npx prisma migrate dev --name init`.

### 2.2 **Desain API Contract (OpenAPI/Swagger)** ✅

- Definisikan endpoint & DTO menggunakan `@nestjs/swagger`.
- Contoh endpoint:
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/google`, `GET /auth/google/callback`
  - `GET /users/me`, `PATCH /users/me`
  - `POST /classes`, `POST /classes/join`
  - `POST /payments/create-transaction`, `POST /payments/webhook`

---

## 🔑 **Milestone 3: Implementasi Core — Autentikasi & User**

**Tujuan:** Fitur dasar otentikasi dan manajemen profil pengguna.

### 3.1 & 3.2 **Registrasi, Login & JWT** ✅

- Buat `AuthModule` untuk registrasi/login lokal dan JWT.
- Validasi input dengan DTO (`login.dto.ts`, `register.dto.ts`) dan class-validator.
- Hash password dengan bcrypt, generate JWT.
- Implementasi email verifikasi:
  - Endpoint: `POST /auth/send-verification` untuk mengirim email verifikasi.
  - Endpoint: `POST /auth/verify-email` untuk verifikasi token email.
  - Buat modul/folder `email/` untuk service pengiriman email dan template.
- Implementasi `JwtAuthGuard` untuk proteksi endpoint.
- Implementasi `jwt.strategy.ts` untuk validasi token JWT.

### 3.3 **Google OAuth 2.0** ✅

- Integrasi login Google dengan `passport-google-oauth20`.
- Implementasi `google.strategy.ts` untuk autentikasi Google.
- Endpoint: `GET /auth/google`, `GET /auth/google/callback`.

### 3.4 **Role-Based Access Control (RBAC)** ✅

- Buat `RolesGuard` (`roles.guard.ts`) dan decorator `@Roles('INSTRUCTOR')`.
- Batasi akses endpoint sesuai role.

### 3.5 **API Manajemen Profil User** ✅

- Endpoint: `GET /users/me`, `PATCH /users/me`.
- Validasi input dengan DTO (`update-user.dto.ts`), update data user, role tidak bisa diubah sendiri.

---

## 📚 **Milestone 4: Fitur Utama — Kelas & Tugas**

**Tujuan:** Membangun alur kerja inti platform Protextify untuk manajemen kelas, tugas, submission, dan integrasi realtime.

---

### **4.1 API Manajemen Kelas** ✅

- **Modul:** `ClassesModule`
- **Endpoint:**
  - `POST /classes` — Instructor membuat kelas baru (tanpa pembayaran).
  - `POST /classes/join` — Student bergabung ke kelas menggunakan token.
  - `GET /classes` — Mendapat daftar kelas (student & instructor).
  - `GET /classes/:id` — Mendapat detail sebuah kelas.
- **Fitur:**
  - Validasi input dengan DTO.
  - Proteksi endpoint dengan guard sesuai role (`INSTRUCTOR` untuk create, `STUDENT` untuk join).
  - Relasi many-to-many antara User dan Class (enrollment).
  - Generate token kelas unik saat pembuatan kelas.

---

### **4.2 API Manajemen Tugas (Assignment)** ✅

- **Modul:** `AssignmentsModule`
- **Endpoint:**
  - `POST /classes/:classId/assignments` — Instructor membuat tugas baru di kelas (wajib pembayaran).
  - `GET /classes/:classId/assignments` — Mendapat daftar semua tugas di kelas.
- **Fitur:**
  - Validasi input dengan DTO.
  - Proteksi endpoint dengan guard sesuai role (`INSTRUCTOR` untuk create).
  - Relasi Assignment dengan Class.
  - **Pembayaran dilakukan saat pembuatan assignment, backend menghitung harga berdasarkan input jumlah siswa (expectedStudentCount) dari instruktur dan meminta pembayaran sebelum assignment aktif.**

---

### **4.3 API Submission Tugas** ✅

- **Modul:** `SubmissionsModule`
- **Endpoint:**
  - `POST /assignments/:assignmentId/submissions` — Student membuat draf submission untuk tugas.
  - `GET /submissions/:id` — Mendapat detail submission (termasuk plagiarisme).
  - `PATCH /submissions/:id/content` — Auto-save konten tulisan student.
  - `POST /submissions/:id/submit` — Student menyelesaikan dan mengirimkan tugas.
  - `PATCH /submissions/:id/grade` — Instructor memberikan nilai pada submission.
  - `GET /classes/:classId/assignments/:assignmentId/submissions` — Monitoring submission oleh instructor.
  - `GET /submissions/history` — Mendapat riwayat penulisan student.
  - `GET /classes/:classId/history` — Mendapat riwayat penulisan di kelas (instructor).
  - `GET /submissions/:id/download` — Download tugas (PDF/DOCX).
- **Fitur:**
  - Validasi input dengan DTO.
  - Proteksi endpoint dengan guard sesuai role.
  - Integrasi dengan plagiarisme dan file storage.

---

### **4.4 Auto-Save via WebSocket** ✅

- **Modul:** `RealtimeGateway` (Socket.IO)
- **Event utama:**
  - `updateContent`: Frontend mengirim konten terbaru, backend auto-save ke database.
    - **Payload:** `{ submissionId, content, updatedAt }`
    - **Response:** `{ status: 'success', updatedAt }`
  - `submissionUpdated`: Backend broadcast ke client jika submission diupdate (misal: dinilai, dicek plagiarisme).
    - **Payload:** `{ submissionId, status, grade?, plagiarismScore?, updatedAt }`
  - `notification`: Backend kirim notifikasi real-time ke user (misal: hasil plagiarisme, status pembayaran).
    - **Payload:** `{ type, message, data?, createdAt }`
- **Fitur:**
  - Implementasi throttling/debouncing pada event `updateContent` agar tidak overload.
  - Pastikan autentikasi WebSocket dengan JWT.
  - Event monitoring submission dan notifikasi berjalan real-time.

---

### **4.5 Monitoring Submission via WebSocket** ✅

- **Deskripsi:** Saat instructor membuka monitoring submission (`GET /classes/:classId/assignments/:assignmentId/submissions`), backend broadcast event:
  - `submissionListUpdated`: Update daftar submission secara real-time.
    - **Payload:** `{ assignmentId, submissions: [ { submissionId, studentId, status, plagiarismScore, lastUpdated } ] }`
    - **Response event:** Update otomatis pada tampilan monitoring instructor.
- **Fitur:**
  - Integrasi dengan WebSocket untuk live monitoring.
  - Proteksi endpoint dengan guard sesuai role (`INSTRUCTOR`).

---

## 🌐 **Milestone 5: Integrasi Layanan Eksternal**

**Tujuan:** Integrasi dengan layanan pihak ketiga untuk pembayaran, plagiarisme, file storage, dan background jobs.

---

### 5.1 **Pembayaran (Midtrans)** ✅

- **Modul:** `PaymentsModule`
- **Endpoint:**
  - `POST /payments/create-transaction` — Instructor membuat transaksi Midtrans untuk pembayaran assignment.
    - Payload: `{ amount, assignmentId?, credits? }`
    - Response: `{ transactionId, snapToken, paymentUrl, status }`
  - `POST /payments/webhook` — Menerima notifikasi status pembayaran dari Midtrans.
    - Payload: `{ order_id, transaction_status, signature_key, ... }`
    - Validasi signature, update status transaksi di database.
    - Jika pembayaran assignment sukses, update assignment menjadi aktif (`active: true`).
    - Kirim event WebSocket `notification` ke instructor.
- **Fitur:**
  - Integrasi Midtrans Snap API untuk pembayaran.
  - Simpan transaksi di tabel `Transaction`.
  - Proteksi endpoint dengan guard sesuai role.
  - Webhook endpoint harus aman dari spoofing (signature verification).

---

### 5.2 **Setup Antrian (Queue) & Worker** ✅

- **Modul:** `PlagiarismModule` + BullMQ/Redis
- **Fitur:**
  - Konfigurasi BullMQ untuk background jobs.
  - Worker: `plagiarism.processor.ts` untuk cek plagiarisme.
  - Job queue: setiap permintaan cek plagiarisme masuk ke Redis queue.
  - Worker mengambil job, memanggil Winston AI API, simpan hasil ke database.
  - Kirim event WebSocket `notification` ke user terkait setelah job selesai.
  - Monitoring job queue (dashboard BullMQ).

---

### 5.3 **Integrasi Cek Plagiarisme** ✅

- **Modul:** `PlagiarismModule`
- **Endpoint:**
  - `POST /submissions/:id/check-plagiarism` — Instructor memicu pengecekan plagiarisme.
    - Payload: `{ submissionId }`
    - Response: `{ jobId, status }`
  - `GET /submissions/:id/plagiarism-report` — Download laporan hasil plagiarisme (PDF).
    - Response: `{ url }`
- **Fitur:**
  - Integrasi Winston AI API untuk pengecekan plagiarisme.
  - Simpan hasil ke tabel `PlagiarismCheck`.
  - Kirim event WebSocket `notification` ke student/instructor.
  - Proteksi endpoint dengan guard sesuai role.

---

### 5.4 **Download Tugas & File Storage** ✅

- **Modul:** `StorageModule`
- **Endpoint:**
  - `GET /submissions/:id/download` — Download tugas (PDF/DOCX).
    - Response: `{ url }`
- **Fitur:**
  - Konversi konten submission ke PDF/DOCX (gunakan library seperti `pdfkit`/`docx`).
  - Simpan file ke cloud storage (AWS S3, GCS, Cloudinary).
  - Generate pre-signed URL untuk download aman.
  - Jangan simpan file di server lokal.
  - Proteksi endpoint dengan guard sesuai role.
  - Kirim event WebSocket `notification` ke user jika file siap diunduh.

---

### 5.5 **Integrasi Event WebSocket** ✅

- **Fitur:**
  - Kirim event `notification` ke user saat status pembayaran berubah (assignment aktif, kredit bertambah).
  - Kirim event `notification` ke user saat hasil plagiarisme tersedia.
  - Kirim event `submissionUpdated` ke client jika submission dinilai atau dicek plagiarisme.
  - Kirim event `submissionListUpdated` ke instructor saat ada perubahan submission.

---

> **Catatan:**  
> Semua endpoint, event, dan payload harus konsisten dengan [doc/Daftar Lengkap Endpoint API Protextify.md](doc/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md) dan [doc/Best Practices Implementasi Backend.md](doc/Best%20Practices%20Implementasi%20Backend.md).  
> Referensi struktur payload event WebSocket dapat dilihat di file [`src/realtime/events.ts`](src/realtime/events.ts).

---

## 🧪 **Milestone 6: Kualitas & Pengujian (Quality Assurance)**

**Tujuan:** Memastikan seluruh fitur backend Protextify berjalan sesuai ekspektasi, aman, dan siap digunakan di lingkungan produksi.

### 6.1 **Unit Test (Jest)** ✅

- **Scope:** Pengujian fungsi-fungsi utama di setiap service dan utilitas.
- **Tools:** Jest (default NestJS).
- **Contoh:**
  - Service: Validasi logika pembayaran, auto-save submission, pengecekan plagiarisme.
  - Util: Helper untuk format tanggal, validasi signature webhook.
- **Lokasi:** test dan file `*.spec.ts` di masing-masing modul.
- **Best Practice:**
  - Mock dependency (misal: PrismaService, external API).
  - Pastikan coverage minimal 80% untuk service logic.

### 6.2 **Integration Test** ✅

- **Scope:** Pengujian alur kerja antar modul (controller-service-database).
- **Tools:** Jest + Supertest.
- **Contoh:**
  - Endpoint: `POST /payments/create-transaction`, `POST /submissions/:id/check-plagiarism`, `GET /submissions/:id/download`.
  - Validasi: Data tersimpan di database, event WebSocket terkirim.
- **Best Practice:**
  - Gunakan database test (isolasi dari data produksi).
  - Setup dan teardown data sebelum/selesai test.

### 6.3 **End-to-End (E2E) Test** ✅

- **Scope:** Simulasi skenario nyata dari sisi pengguna (student/instructor).
- **Tools:** Supertest, manual scenario, atau Cypress (untuk frontend).
- **Contoh:**
  - Registrasi → Login → Buat kelas → Buat assignment → Pembayaran → Submission → Cek plagiarisme → Download file.
  - Validasi: Semua endpoint dan event berjalan sesuai flow bisnis.
- **Best Practice:**
  - Test seluruh flow utama (happy path dan error path).
  - Pastikan proteksi endpoint (JWT, RBAC) berjalan.

### 6.4 **Testing Keamanan** ✅

- **Scope:** Audit keamanan aplikasi dan validasi input.
- **Tools:** Manual review, automated security scanner (misal: npm audit, Snyk).
- **Checklist:**
  - Validasi DTO di semua endpoint (whitelist, transform, forbidNonWhitelisted).
  - Rate limiting pada endpoint sensitif (login, webhook).
  - Signature verification pada webhook (`/payments/webhook`).
  - Proteksi JWT dan role guard (`@Roles`, `JwtAuthGuard`).
  - Cek potensi SQL Injection, XSS, CSRF (gunakan helmet, Prisma).
- **Referensi:** Best Practices Implementasi Backend.md

### 6.5 **Pengujian Manual Skenario Kunci** ✅

- **Scope:** Simulasi manual untuk alur bisnis utama.
- **Skenario:**
  - Instructor membuat assignment dan melakukan pembayaran.
  - Student membuat submission, auto-save via WebSocket.
  - Instructor melakukan cek plagiarisme.
  - Download file PDF/DOCX dari cloud storage.
  - Monitoring submission via WebSocket.
- **Checklist:**
  - Semua event WebSocket (`notification`, `submissionUpdated`, `submissionListUpdated`) terkirim sesuai payload di Daftar Lengkap Endpoint API Protextify.md.
  - Validasi proteksi endpoint dan error handling.

### 6.6 **Audit Logging & Monitoring** ✅

- **Scope:** Pastikan semua aktivitas penting tercatat dan dapat dimonitor.
- **Tools:** Winston (logging), BullMQ dashboard (queue), custom monitoring.
- **Checklist:**
  - Logging terstruktur untuk request, error, dan event penting.
  - Monitoring job queue (BullMQ) untuk plagiarisme.
  - Audit log untuk transaksi pembayaran dan perubahan submission.
  - Alerting untuk error kritis (integrasi Sentry/Slack opsional).
- **Referensi:** Best Practices Implementasi Backend.md

---

## 🚢 **Milestone 7: Deployment & DevOps (Go-Live)**

**Tujuan:** Otomatisasi build, test, dan deploy.

### 7.1 **Setup CI/CD Pipeline**

- Pipeline: install → lint → test → build → push → deploy.

### 7.2–7.3 **Persiapan Environment & Deployment**

- Infrastruktur cloud, domain & SSL, migrasi DB otomatis.

### 7.4 **Initial Deployment**

- Deploy ke Staging, smoke testing, lanjut ke Produksi.

---

## 📈 **Milestone 8: Pasca-Rilis — Monitoring & Dokumentasi**

**Tujuan:** Monitoring, pengelolaan, dan dokumentasi.

### 8.1–8.2 **Logging, Monitoring & Alerting**

- Logger terstruktur (pino/winston), error reporting (Sentry), alert ke Slack/email.

### 8.3–8.4 **Finalisasi Dokumentasi**

- Dokumentasi Swagger/OpenAPI, update README.md, buat RUNBOOK.md.

### 8.5 **Backup & Recovery Plan**

- Backup otomatis database, uji restore berkala.

---

> **Tips Visual:**
>
> - Gunakan emoji dan heading untuk navigasi cepat.
> - Checklist milestone dengan bullet dan sub-bullet.
> - Tambahkan highlight pada tugas penting dan praktik terbaik.

> ℹ️ Untuk detail request/response schema setiap endpoint dan event, silakan lihat langsung di Swagger API Docs pada aplikasi backend.
> Referensi struktur payload event WebSocket dapat dilihat di file `src/realtime/events.ts`.
