# 📋 Daftar Task Penyelesaian Dashboard Student

Dokumentasi lengkap untuk menyelesaikan seluruh fungsionalitas Dashboard Student di platform Protextify berdasarkan analisis kodebase dan alur bisnis.

---

## 🔍 Analisis Komprehensif Dashboard Student

### Status Implementasi Saat Ini:

- ✅ **Struktur Layout:** Dashboard Layout sudah baik
- ✅ **Routing:** Routing dasar sudah tersedia
- ⚠️ **API Integration:** Partial implementation, beberapa endpoint belum terhubung
- ⚠️ **UI Components:** Banyak placeholder yang perlu diimplementasi
- ❌ **Real-time Features:** WebSocket integration belum optimal
- ❌ **Business Logic:** Alur bisnis belum sepenuhnya diimplementasi

---

## 📝 Daftar Task Prioritas

### 1. **Fix Route ClassAssignments (404 Error)**

**Deskripsi:**
Route `/dashboard/classes/:classId/assignments` menghasilkan 404 error karena belum diimplementasi di router.

**Masalah / Kekurangan Saat Ini:**

- Router tidak memiliki route untuk `classes/:classId/assignments`
- Component ClassAssignments sudah dibuat tapi belum terdaftar di router
- Navigation dari Classes page tidak berfungsi

**Perbaikan yang Diperlukan:**

```jsx
// Update router/index.jsx
{
  path: "classes/:classId/assignments",
  element: <ClassAssignments />,
},

// Update import di router
import { ClassAssignments } from "../pages/student";
```

**Prioritas:** High  
**Status:** ☐ Belum dikerjakan

### 2. **Implementasi Service getClassAssignments**

**Deskripsi:**
Service untuk mengambil daftar assignments dalam kelas tertentu belum diimplementasi.

**Masalah / Kekurangan Saat Ini:**

- `assignmentsService.getClassAssignments()` belum ada
- ClassAssignments component tidak bisa mengambil data

**Perbaikan yang Diperlukan:**

```js
// services/assignments.js
getClassAssignments: async (classId) => {
  try {
    const response = await api.get(`/classes/${classId}/assignments`);
    return Array.isArray(response) ? response : [];
  } catch (error) {
    throw error;
  }
};
```

**Prioritas:** High  
**Status:** ☐ Belum dikerjakan

### 3. **Perbaikan useStudentDashboard Hook**

**Deskripsi:**
Hook dashboard memiliki beberapa masalah dalam data fetching dan calculation statistik.

**Masalah / Kekurangan Saat Ini:**

- Endpoint `/assignments/recent` belum diimplementasi di service
- Calculation `activeAssignments` tidak akurat
- Error handling untuk Promise.allSettled tidak optimal

**Perbaikan yang Diperlukan:**

```js
// hooks/useStudentDashboard.js
// 1. Implement getRecentAssignments
// 2. Fix activeAssignments calculation from classes response
// 3. Add proper error handling for each Promise
// 4. Add WebSocket integration for real-time updates
```

**Prioritas:** High  
**Status:** ☐ Belum dikerjakan

### 4. **Implementasi Assignment Detail & Write Assignment**

**Deskripsi:**
Halaman detail assignment dan writing interface belum diimplementasi sepenuhnya.

**Masalah / Kekurangan Saat Ini:**

- WriteAssignment component masih placeholder
- Assignment detail navigation belum berfungsi
- Rich text editor belum terintegrasi

**Perbaikan yang Diperlukan:**

- Implementasi rich text editor (React Quill/TipTap)
- Auto-save functionality dengan WebSocket
- Word count dan character limits
- Citation tools integration
- Anti-copy-paste detection

**Prioritas:** High  
**Status:** ☐ Belum dikerjakan

### 5. **WebSocket Real-time Integration**

**Deskripsi:**
Integrasi WebSocket untuk fitur real-time belum optimal di dashboard.

**Masalah / Kekurangan Saat Ini:**

- WebSocket hook ada tapi belum digunakan optimal
- Real-time notifications belum diimplementasi
- Auto-save content belum berfungsi

**Perbaikan yang Diperlukan:**

```js
// Implement WebSocket events:
// - updateContent: auto-save submission content
// - notification: real-time notifications
// - submissionUpdated: submission status updates
// - Connection status indicator
```

**Prioritas:** Medium  
**Status:** ☐ Belum dikerjakan

### 6. **Perbaikan StatCard & Dashboard Statistics**

**Deskripsi:**
Statistik dashboard tidak akurat dan perlu perbaikan calculation logic.

**Masalah / Kekurangan Saat Ini:**

- `activeAssignments` count tidak sesuai dengan business logic
- `overdueAssignments` belum diimplementasi
- Stats tidak update real-time

**Perbaikan yang Diperlukan:**

```js
// Fix calculation logic:
// - activeAssignments: filter by active=true AND deadline > now
// - Add overdueAssignments calculation
// - Add real-time stats update via WebSocket
```

**Prioritas:** Medium  
**Status:** ☐ Belum dikerjakan

### 7. **Implementasi Activity Timeline yang Lengkap**

**Deskripsi:**
Activity timeline belum menampilkan informasi lengkap sesuai alur bisnis.

**Masalah / Kekurangan Saat Ini:**

- Field `grade` dan `plagiarismScore` belum ditampilkan
- Status submission tidak detail
- Timeline sorting tidak optimal

**Perbaikan yang Diperlukan:**

```jsx
// components/dashboard/ActivityTimeline.jsx
// - Display grade information when available
// - Show plagiarism score with color coding
// - Add detailed status (DRAFT, SUBMITTED, GRADED)
// - Improve timeline sorting and filtering
```

**Prioritas:** Medium  
**Status:** ☐ Belum dikerjakan

### 8. **Perbaikan Recent Classes Component**

**Deskripsi:**
Recent Classes component perlu update untuk menampilkan informasi terbaru.

**Masalah / Kekurangan Saat Ini:**

- Assignment count tidak akurat
- Instructor information tidak lengkap
- Enrollment date menggunakan fallback

**Perbaikan yang Diperlukan:**

```jsx
// components/dashboard/RecentClasses.jsx
// - Fix assignments count from new response structure
// - Display instructor.fullName properly
// - Use currentUserEnrollment.joinedAt for join date
```

**Prioritas:** Medium  
**Status:** ☐ Belum dikerjakan

### 9. **Implementasi Plagiarism Detection Interface**

**Deskripsi:**
Interface untuk deteksi plagiarisme belum diimplementasi di dashboard context.

**Masalah / Kekurangan Saat Ini:**

- Plagiarism check trigger belum ada
- Progress tracking belum diimplementasi
- Report visualization belum tersedia

**Perbaikan yang Diperlukan:**

- Plagiarism check button di assignment detail
- Progress indicator untuk queue monitoring
- Detailed plagiarism report view
- Source highlighting functionality

**Prioritas:** Medium  
**Status:** ☐ Belum dikerjakan

### 10. **Mobile Responsiveness Enhancement**

**Deskripsi:**
Dashboard perlu optimasi untuk mobile experience yang lebih baik.

**Masalah / Kekurangan Saat Ini:**

- Mobile bottom navigation belum optimal
- Card layout di mobile perlu perbaikan
- Touch interaction belum optimal

**Perbaikan yang Diperlukan:**

- Optimize StatCard layout untuk mobile
- Improve mobile navigation UX
- Add swipe gestures untuk card navigation
- Optimize modal dan popup untuk mobile

**Prioritas:** Low  
**Status:** ☐ Belum dikerjakan

### 11. **Error Handling & Loading States**

**Deskripsi:**
Konsistensi error handling dan loading states perlu diperbaiki.

**Masalah / Kekurangan Saat Ini:**

- Inconsistent error handling across components
- Loading states tidak uniform
- Error messages tidak user-friendly

**Perbaikan yang Diperlukan:**

```jsx
// Standardize error handling pattern:
// - Consistent LoadingSpinner usage
// - User-friendly error messages
// - Retry functionality
// - Offline state handling
```

**Prioritas:** Low  
**Status:** ☐ Belum dikerjakan

### 12. **Performance Optimization**

**Deskripsi:**
Optimasi performa dashboard untuk loading yang lebih cepat.

**Masalah / Kekurangan Saat Ini:**

- Multiple API calls tidak dioptimasi
- Component re-rendering tidak optimal
- Data caching belum diimplementasi

**Perbaikan yang Diperlukan:**

- Implement React.memo untuk expensive components
- Add data caching mechanism
- Optimize API calls dengan debouncing
- Add skeleton loading states

**Prioritas:** Low  
**Status:** ☐ Belum dikerjakan

---

## 🔄 Alur Kerja Implementasi

### Phase 1: Critical Fixes (Week 1)

1. Fix Route ClassAssignments
2. Implementasi Service getClassAssignments
3. Perbaikan useStudentDashboard Hook

### Phase 2: Core Features (Week 2-3)

4. Implementasi Assignment Detail & Write Assignment
5. WebSocket Real-time Integration
6. Perbaikan StatCard & Dashboard Statistics

### Phase 3: Enhanced Experience (Week 4)

7. Implementasi Activity Timeline yang Lengkap
8. Perbaikan Recent Classes Component
9. Implementasi Plagiarism Detection Interface

### Phase 4: Polish & Optimization (Week 5)

10. Mobile Responsiveness Enhancement
11. Error Handling & Loading States
12. Performance Optimization

---

## 📋 Checklist Backend Dependencies

### Endpoint yang Perlu Dikonfirmasi:

- [ ] `GET /assignments/recent` - untuk recent assignments di dashboard
- [ ] `GET /classes/:classId/assignments` - sudah tersedia, perlu testing
- [ ] WebSocket events implementation - perlu testing
- [ ] `POST /submissions/:id/check-plagiarism` - untuk plagiarism detection

### Field Response yang Perlu Dikonfirmasi:

- [ ] `currentUserEnrollment.joinedAt` di response `/classes`
- [ ] `grade` dan `plagiarismScore` di response `/submissions/history`
- [ ] `active` field di assignments response

---

## 🎯 Definition of Done

Dashboard Student dianggap selesai ketika:

- [ ] Semua routing berfungsi tanpa 404 error
- [ ] Statistics dashboard menampilkan data real-time yang akurat
- [ ] Student bisa mengerjakan assignment dengan editor yang lengkap
- [ ] Real-time notifications berfungsi optimal
- [ ] Plagiarism detection terintegrasi dengan baik
- [ ] Mobile experience optimal
- [ ] Error handling konsisten di seluruh komponen
- [ ] Performance optimal dengan loading time < 3 detik

---

**Estimasi Total:** 4-5 minggu untuk implementasi lengkap  
**Tim Involved:** Frontend Developer, Backend Developer (untuk konfirmasi endpoint)  
**Testing Required:** Unit tests, Integration tests, E2E tests untuk dashboard flow
