# Alur Bisnis Student Protextify

## Registrasi & Login

- **Registrasi:**  
   `POST /auth/register`
- **Login:**  
   `POST /auth/login` (JWT)

---

## Bergabung ke Kelas

- **Join Class:**  
   `POST /classes/join` (pakai token kelas)
- **Response:**  
   Data kelas & status join

---

## Melihat Daftar Kelas

- **Endpoint:**  
   `GET /classes`
- **Response:**  
   List kelas yang diikuti (beserta assignments & enrollments)

---

## Melihat Detail Kelas

- **Endpoint:**  
   `GET /classes/:id`
- **Response:**  
   Detail kelas, assignments, instructor, enrollments

---

## Melihat & Mengerjakan Tugas

- **Melihat tugas:**  
   `GET /classes/:classId/assignments`
- **Membuat submission:**  
   `POST /assignments/:assignmentId/submissions`
- **Auto-save:**  
   WebSocket event `updateContent`

---

## Submit Tugas

- **Submit:**  
   `POST /submissions/:id/submit`
- **Status:**  
   Submission jadi **SUBMITTED**

---

## Cek Riwayat Submission

- **Endpoint:**  
   `GET /submissions/history`
- **Response:**  
   Daftar submission siswa

---

## Cek Plagiarisme (Jika Diaktifkan)

- **Endpoint:**  
   `POST /submissions/:id/check-plagiarism` (oleh instructor)
- **Laporan:**  
   `GET /submissions/:id/plagiarism-report`

---

## Download Submission

- **Endpoint:**  
   `GET /submissions/:id/download`

---

## Monitoring & Notifikasi

- **Realtime:**  
   WebSocket event `notification`, `submissionUpdated`

---

---

## Task

Berikut daftar task penyesuaian Frontend (FE) agar sesuai dengan alur bisnis student dari Backend (BE):

---

### 1. **Implementasi Daftar Tugas Student**

- **File:** `Assignments.jsx`
- **Task:**
  - Fetch data tugas dari endpoint `/classes/:classId/assignments`.
  - Tampilkan daftar tugas yang relevan untuk student.
  - Pastikan mapping response sesuai struktur BE.

---

### 2. **Implementasi Riwayat Submission**

- **File:** `Submissions.jsx`
- **Task:**
  - Fetch data riwayat dari endpoint `/submissions/history`.
  - Tampilkan daftar riwayat pengumpulan tugas.
  - Tambahkan detail status dan tanggal submit.

---

### 3. **Fitur Cek & Report Plagiarisme**

- **File:** `WriteAssignment.jsx` (atau komponen baru)
- **Task:**
  - Tambahkan tombol untuk trigger cek plagiarisme (`POST /submissions/:id/check-plagiarism`).
  - Tampilkan hasil report (`GET /submissions/:id/plagiarism-report`).
  - Update UI agar status plagiarisme terlihat oleh student.

---

### 4. **Fitur Download Submission**

- **File:** `WriteAssignment.jsx` (atau komponen detail submission)
- **Task:**
  - Tambahkan tombol download pada detail submission.
  - Integrasi endpoint `/submissions/:id/download`.

---

### 5. **Integrasi Event Realtime (WebSocket)**

- **File:** `Dashboard.jsx`, `WriteAssignment.jsx`
- **Task:**
  - Tambahkan listener untuk event `notification` dan `submissionUpdated`.
  - Tampilkan notifikasi realtime di dashboard/student area.

---

### 6. **Refactor Placeholder**

- **File:** `Assignments.jsx`, `Submissions.jsx`
- **Task:**
  - Ganti placeholder dengan implementasi nyata.
  - Hapus state/komponen yang tidak terpakai.

---

### 7. **Sinkronisasi Service Layer**

- **File:** Semua file yang memanggil API
- **Task:**
  - Pastikan semua service (API call) menggunakan endpoint dan payload sesuai BE.
  - Perbaiki mapping data jika ada perbedaan struktur.

---

### 8. **Cek Duplikasi Data Fetch**

- **File:** `Dashboard.jsx`, `Classes.jsx`, `StudentClassDetail.jsx`
- **Task:**
  - Audit dan refactor agar tidak ada fetch data kelas/tugas yang berulang.
  - Gunakan shared state/context jika perlu.

---

**Prioritas:**  
Mulai dari task 1, 2, dan 3 (fitur utama student), lalu lanjutkan task 4 dan 5 (fitur tambahan), kemudian lakukan refactor dan sinkronisasi (task 6, 7, 8).

Setiap task dapat dibuat sebagai tiket/issue terpisah agar mudah tracking dan review.
