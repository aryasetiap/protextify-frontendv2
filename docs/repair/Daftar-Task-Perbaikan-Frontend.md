# 📋 Daftar Rencana Perubahan Frontend Student Dashboard

Berdasarkan update dari Backend, berikut analisis dan daftar perbaikan yang diperlukan di Frontend untuk memastikan Student Dashboard berfungsi optimal dengan struktur baru.

---

## 🔍 **Analisis Perubahan BE vs FE Saat Ini**

### **Endpoint `/classes`**

- **Perubahan BE:** Response structure berubah, field baru ditambahkan
- **Status FE:** Service sudah ada di classes.js, perlu penyesuaian mapping

### **Endpoint `/submissions/history`**

- **Perubahan BE:** Field `grade`, `plagiarismScore`, `submittedAt` ditambahkan
- **Status FE:** Hook `useStudentDashboard` sudah memanggil, perlu update parsing

### **Endpoint `/assignments/recent`**

- **Perubahan BE:** Endpoint baru tersedia
- **Status FE:** Belum diimplementasi, masih placeholder `setRecentAssignments([])`

---

## 📝 **Daftar Task Perbaikan Frontend**

### **1. Service Layer - Classes Service**

- **File:** classes.js
- **Endpoint:** `GET /classes`
- **Perubahan yang diperlukan:**
  - Update response mapping untuk struktur enrollment baru
  - Tambahkan field `assignments` dengan struktur terbaru
  - Pastikan `instructor` dan `enrollments` ter-mapping dengan benar
- **Prioritas:** **High**

### **2. Service Layer - Submissions Service**

- **File:** submissions.js
- **Endpoint:** `GET /submissions/history`
- **Perubahan yang diperlukan:**
  - Tambahkan handling untuk field `grade`, `plagiarismScore`, `submittedAt`
  - Update parsing response untuk field `assignment.class.name`
  - Pastikan backward compatibility dengan response lama
- **Prioritas:** **High**

### **3. Service Layer - Assignments Service (Baru)**

- **File:** assignments.js
- **Endpoint:** `GET /assignments/recent`
- **Perubahan yang diperlukan:**
  - Implementasi fungsi `getRecentAssignments()` baru
  - Export ke index.js
  - Return structure sesuai expectation FE
- **Prioritas:** **Medium**

### **4. Hook - useStudentDashboard**

- **File:** useStudentDashboard.js
- **Endpoint:** Multiple endpoints
- **Perubahan yang diperlukan:**
  - Update `fetchDashboardData()` untuk call endpoint baru `/assignments/recent`
  - Fix statistik calculation untuk `activeAssignments` dari response `/classes`
  - Tambahkan handling untuk field baru di submission (grade, plagiarismScore)
  - Update activity timeline untuk include submission status yang lebih detail
- **Prioritas:** **High**

### **5. Dashboard Components - StatCard Display**

- **File:** Dashboard.jsx
- **Endpoint:** Data dari hook
- **Perubahan yang diperlukan:**
  - Update logic `activeAssignments` count dari assignments response
  - Pastikan `safeStats` handling tetap robust
  - Tambahkan fallback untuk field baru
- **Prioritas:** **Medium**

### **6. Dashboard Components - QuickActions**

- **File:** QuickActions.jsx
- **Endpoint:** Data dari stats
- **Perubahan yang diperlukan:**
  - Update link "Tugas Aktif" untuk redirect ke assignments yang benar
  - Tambahkan handling untuk `activeAssignments` count yang akurat
- **Prioritas:** **Low**

### **7. Dashboard Components - RecentClasses**

- **File:** RecentClasses.jsx
- **Endpoint:** Data dari `/classes`
- **Perubahan yang diperlukan:**
  - Update display untuk assignments count dari structure baru
  - Tambahkan instructor information display
  - Handle enrollment date dari `currentUserEnrollment.joinedAt`
- **Prioritas:** **Medium**

### **8. Dashboard Components - ActivityTimeline**

- **File:** ActivityTimeline.jsx
- **Endpoint:** Data dari `/submissions/history`
- **Perubahan yang diperlukan:**
  - Tambahkan display untuk `grade` dan `plagiarismScore`
  - Update timeline entry untuk show submission status (`DRAFT`, `SUBMITTED`, `GRADED`)
  - Tambahkan `submittedAt` timestamp untuk submitted items
- **Prioritas:** **Medium**

### **9. Student Classes Page**

- **File:** Classes.jsx
- **Endpoint:** `GET /classes`
- **Perubahan yang diperlukan:**
  - Update `ClassCard` untuk display assignments count dari response baru
  - Fix instructor name display dari field `instructor.fullName`
  - Update enrollment date dari `currentUserEnrollment.joinedAt`
- **Prioritas:** **Medium**

### **10. Student Class Detail Page**

- **File:** StudentClassDetail.jsx
- **Endpoint:** `GET /classes/:id`
- **Perubahan yang diperlukan:**
  - Update assignments listing dari response structure baru
  - Display instructor information yang benar
  - Show enrollments count dan classmates list
- **Prioritas:** **Medium**

### **11. Constants & Utils**

- **File:** constants.js
- **Endpoint:** N/A
- **Perubahan yang diperlukan:**
  - Tambahkan constant untuk assignment recent endpoint
  - Update API paths jika ada perubahan
- **Prioritas:** **Low**

---

## ⚡ **Prioritas Eksekusi**

### **Phase 1 - Critical (High Priority)**

1. classes.js - Update response mapping
2. submissions.js - Add new fields support
3. useStudentDashboard.js - Fix data fetching & calculation

### **Phase 2 - Important (Medium Priority)**

4. Dashboard.jsx - Update stats display
5. RecentClasses.jsx - Fix class display
6. ActivityTimeline.jsx - Add grade/plagiarism info
7. assignments.js - Implement recent assignments

### **Phase 3 - Enhancement (Low Priority)**

8. QuickActions.jsx - Update links
9. constants.js - Add new constants

---

## 🧪 **Testing Checklist**

- [ ] Dashboard loads without errors
- [ ] Statistics cards show correct counts
- [ ] Recent classes display proper assignment counts
- [ ] Activity timeline shows grades and plagiarism scores
- [ ] Navigation links work correctly
- [ ] WebSocket updates work for new fields
- [ ] Error handling untuk response structure baru

---

## 📚 **Referensi Dokumen**

- `student-dashboard-endpoint-expectation.md`
- `Daftar Lengkap Endpoint API Protextify.md`
- Current FE implementation di folder student

**Estimasi Total:** 2-3 hari kerja untuk semua perbaikan sesuai prioritas.
