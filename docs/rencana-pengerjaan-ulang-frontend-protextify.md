# 🔄 Rencana Pengerjaan Ulang Frontend Protextify

## 📊 Executive Summary

Tim sebelumnya telah melakukan banyak pekerjaan integrasi dengan backend, namun implementasinya tidak konsisten dan banyak bug UI/UX. Rencana ini fokus pada **refactoring UI/UX** sambil mempertahankan integrasi backend yang sudah berjalan dan konsistensi visual yang ada.

## 🎯 Tujuan Utama

1. **Memperbaiki UI/UX** dengan design system yang konsisten
2. **Mempertahankan integrasi backend** yang sudah bekerja
3. **Meningkatkan performa** dan user experience
4. **Standarisasi komponen** dan code structure
5. **Mempertahankan gaya visual** yang sudah ada (`#23407a` branding)

## 🛠️ Stack & Tools yang Dipertahankan

- **Framework**: React 19.1.0 + Vite
- **Styling**: TailwindCSS (warna utama: `#23407a`)
- **Routing**: React Router DOM v7.6.3
- **HTTP Client**: Axios (sudah terintegrasi dengan backend)
- **Editor**: React Quill New
- **PDF**: jsPDF (akan dipindah ke backend melalui [`GET /submissions/:id/download`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md))
- **Citations**: Citation.js
- **WebSocket**: Socket.IO client (untuk real-time features)

## 📋 Phase-by-Phase Development Plan

### **Phase 1: Foundation & Design System Setup (Week 1-2)**

#### 1.1 Project Structure & Design Tokens

```
Priority: Critical
Estimasi: 3-4 hari
```

**Tasks:**

- [ ] Setup design tokens berdasarkan warna existing (`#23407a`)
- [ ] Standardisasi spacing, typography, dan breakpoints
- [ ] Buat theme provider untuk konsistensi
- [ ] Setup CSS custom properties untuk scalability
- [ ] Dokumentasi style guide

**Deliverables:**

```
src/styles/
├── tokens.css          # Design tokens
├── globals.css         # Global styles
├── components.css      # Component-specific styles
└── utilities.css       # Utility classes
```

**Implementation:**

```css
/* tokens.css */
:root {
  /* Primary Colors (existing branding) */
  --primary-900: #1a2f5c;
  --primary-800: #23407a; /* Main brand color */
  --primary-700: #2d4f8f;
  --primary-600: #3b5fa4;
  --primary-500: #4970b8;
  --primary-400: #6b87c7;

  /* Component spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

#### 1.2 Component Library Foundation

```
Priority: Critical
Estimasi: 4-5 hari
```

**Tasks:**

- [ ] Button variants (primary, secondary, danger, ghost) - konsisten dengan style existing
- [ ] Form components (Input, Textarea, Select, Checkbox)
- [ ] Layout components (Container, Grid, Card)
- [ ] Feedback components (Alert, Toast, Loading, Modal)
- [ ] Navigation components (breadcrumb, pagination)

**Files:**

```
src/components/ui/
├── Button/
│   ├── Button.jsx
│   ├── Button.module.css
│   └── index.js
├── Input/
│   ├── Input.jsx
│   ├── Input.module.css
│   └── index.js
├── Card/
├── Modal/
├── Alert/
└── index.js              # Export semua komponen
```

**Implementation Example:**

```jsx
// src/components/ui/Button/Button.jsx
const Button = ({
  variant = "primary",
  size = "md",
  children,
  loading = false,
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded transition-all duration-200 flex items-center justify-center";

  const variants = {
    primary:
      "bg-[#23407a] text-white hover:bg-[#16305a] focus:ring-2 focus:ring-[#23407a]/50",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-[#23407a] hover:bg-[#23407a]/10",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner className="mr-2" />}
      {children}
    </button>
  );
};
```

### **Phase 2: Core Layout & Navigation Overhaul (Week 2-3)**

#### 2.1 Layout System Redesign

```
Priority: High
Estimasi: 4 hari
```

**Tasks:**

- [ ] Refactor [`src/components/Navbar.jsx`](src/components/Navbar.jsx) - pertahankan style, perbaiki struktur
- [ ] Buat layout wrapper untuk konsistensi
- [ ] Implementasi responsive sidebar untuk dashboard
- [ ] Role-based navigation items
- [ ] Breadcrumb navigation untuk deep pages

**Files yang Dimodifikasi:**

- [`src/components/Navbar.jsx`](src/components/Navbar.jsx) ✅ (refactor existing)
- [`src/components/Footer.jsx`](src/components/Footer.jsx) ✅ (refactor existing)

**Files Baru:**

```
src/layouts/
├── MainLayout.jsx        # Layout utama dengan navbar
├── AuthLayout.jsx        # Layout untuk halaman auth
├── DashboardLayout.jsx   # Layout untuk dashboard dengan sidebar
└── index.js
```

**Implementation:**

```jsx
// src/layouts/MainLayout.jsx
const MainLayout = ({ children, showNavbar = true, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
};

// src/layouts/DashboardLayout.jsx
const DashboardLayout = ({ children, title, breadcrumbs = [] }) => {
  const { user } = useAuth();

  return (
    <MainLayout showFooter={false}>
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar userRole={user?.role} />
        <div className="flex-1 p-6">
          {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
          {title && (
            <h1 className="text-2xl font-bold text-[#23407a] mb-6">{title}</h1>
          )}
          {children}
        </div>
      </div>
    </MainLayout>
  );
};
```

#### 2.2 Authentication Pages Redesign

```
Priority: High
Estimasi: 3 hari
```

**Tasks:**

- [ ] Refactor [`src/components/Login.jsx`](src/components/Login.jsx) - pertahankan fungsi, perbaiki UI
- [ ] Refactor [`src/components/Register.jsx`](src/components/Register.jsx) - pertahankan fungsi, perbaiki UI
- [ ] Implementasi loading states dan error handling yang konsisten
- [ ] OAuth callback handling improvement

**Backend Integration:**

- ✅ [`POST /auth/login`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-authlogin)
- ✅ [`POST /auth/register`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-authregister)
- ✅ [`GET /auth/google`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-authgoogle)

### **Phase 3: Landing Pages & Public Content (Week 3-4)**

#### 3.1 Landing Pages Improvement

```
Priority: Medium
Estimasi: 4 hari
```

**Files yang Dimodifikasi:**

- [ ] [`src/components/Home.jsx`](src/components/Home.jsx) - perbaiki hero section dan layout
- [ ] [`src/components/HeroSection.jsx`](src/components/HeroSection.jsx) - responsive dan interactive elements
- [ ] [`src/components/Tentang.jsx`](src/components/Tentang.jsx) - improve form dan layout
- [ ] [`src/components/Panduan.jsx`](src/components/Panduan.jsx) - better UX untuk tab navigation

**Tasks:**

- [ ] Hero section responsive dengan call-to-action yang jelas
- [ ] Features showcase dengan visual yang menarik
- [ ] About page dengan value proposition yang kuat
- [ ] Panduan dengan better tab interface dan search functionality
- [ ] Contact/feedback form improvement

### **Phase 4: Dashboard Redesign (Week 4-5)**

#### 4.1 Student Dashboard

```
Priority: High
Estimasi: 3 hari
```

**Files yang Dimodifikasi:**

- [ ] [`src/components/student/DashboardStudent.jsx`](src/components/student/DashboardStudent.jsx)

**Tasks:**

- [ ] Card-based layout untuk recent assignments
- [ ] Quick stats (pending tasks, completed, grades)
- [ ] Recent activity feed
- [ ] Quick actions (join class, view assignments)

**Backend Integration:**

- ✅ [`GET /classes`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-classes) - untuk daftar kelas student
- ✅ [`GET /submissions/history`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-submissionshistory) - untuk riwayat tugas

#### 4.2 Instructor Dashboard

```
Priority: High
Estimasi: 3 hari
```

**Files yang Dimodifikasi:**

- [ ] [`src/components/instruktur/DashboardInstruktur.jsx`](src/components/instruktur/DashboardInstruktur.jsx)

**Tasks:**

- [ ] Statistics cards dengan data visualization
- [ ] Class overview dengan student count dan assignment status
- [ ] Recent submissions monitoring
- [ ] Quick actions (create class, create assignment)

### **Phase 5: Class Management System (Week 5-6)**

#### 5.1 Class Creation & Management (Instructor)

```
Priority: High
Estimasi: 5 hari
```

**Files yang Dimodifikasi:**

- [ ] [`src/components/instruktur/FormPembuatanKelas.jsx`](src/components/instruktur/FormPembuatanKelas.jsx) - improve wizard flow
- [ ] [`src/components/instruktur/DetailKelasInstruktur.jsx`](src/components/instruktur/DetailKelasInstruktur.jsx) - better layout dengan tabs
- [ ] [`src/components/instruktur/DaftarKelasInstruktur.jsx`](src/components/instruktur/DaftarKelasInstruktur.jsx) - add search & filter
- [ ] [`src/components/instruktur/InfoDataKelas.jsx`](src/components/instruktur/InfoDataKelas.jsx) - improve info display
- [ ] [`src/components/instruktur/ManajemenMember.jsx`](src/components/instruktur/ManajemenMember.jsx) - better table dan bulk actions
- [ ] [`src/components/instruktur/StatistikKelas.jsx`](src/components/instruktur/StatistikKelas.jsx) - add charts dan better visualization

**Tasks:**

- [ ] Step-by-step class creation wizard
- [ ] Class detail page dengan tabs (overview, students, assignments, statistics)
- [ ] Student management dengan bulk operations
- [ ] Class token management dan sharing
- [ ] Analytics dashboard untuk class performance

**Backend Integration:**

- ✅ [`POST /classes`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-classes)
- ✅ [`GET /classes/:id`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-classesid)

#### 5.2 Class Joining (Student)

```
Priority: High
Estimasi: 2 hari
```

**Files yang Dimodifikasi:**

- [ ] [`src/components/student/GabungKelasStudent.jsx`](src/components/student/GabungKelasStudent.jsx) - improve validation dan UX
- [ ] [`src/components/student/DaftarKelasStudent.jsx`](src/components/student/DaftarKelasStudent.jsx) - add progress indicators

**Tasks:**

- [ ] Class token validation dengan live feedback
- [ ] Class preview sebelum join
- [ ] My classes list dengan progress indicators dan status
- [ ] Class detail view untuk student dengan assignment list

**Backend Integration:**

- ✅ [`POST /classes/join`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-classesjoin)

### **Phase 6: Assignment System Complete Overhaul (Week 6-7)**

#### 6.1 Assignment Creation (Instructor)

```
Priority: High
Estimasi: 4 hari
```

**Files yang Dimodifikasi:**

- [ ] [`src/components/instruktur/FormTugasInstruktur.jsx`](src/components/instruktur/FormTugasInstruktur.jsx) - improve form UX dan validation
- [ ] [`src/components/instruktur/DetailTugasInstruktur.jsx`](src/components/instruktur/DetailTugasInstruktur.jsx) - better layout dan actions

**Tasks:**

- [ ] Rich text editor untuk assignment instructions
- [ ] Deadline picker dengan timezone support
- [ ] File attachment dengan drag & drop
- [ ] Assignment preview sebelum publish
- [ ] Expected student count input untuk pricing calculation
- [ ] Payment integration flow untuk assignment activation

**Backend Integration:**

- ✅ [`POST /classes/:classId/assignments`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-classesclassidassignments)
- ✅ [`POST /payments/create-transaction`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-paymentscreate-transaction)

#### 6.2 Assignment Monitoring (Instructor)

```
Priority: High
Estimasi: 4 hari
```

**Files yang Dimodifikasi:**

- [ ] [`src/components/instruktur/PengumpulanTugasInstruktur.jsx`](src/components/instruktur/PengumpulanTugasInstruktur.jsx) - real-time monitoring
- [ ] [`src/components/instruktur/PlagiarismeStudentInstruktur.jsx`](src/components/instruktur/PlagiarismeStudentInstruktur.jsx) - better plagiarism interface
- [ ] [`src/components/instruktur/DetailPlagiarismeInstruktur.jsx`](src/components/instruktur/DetailPlagiarismeInstruktur.jsx) - detailed report view

**Tasks:**

- [ ] Real-time submission list dengan WebSocket integration
- [ ] Bulk actions (grade multiple, check plagiarism)
- [ ] Export submissions functionality
- [ ] Analytics & statistics view
- [ ] Grading interface yang user-friendly

**WebSocket Integration:**

- ✅ Event: `submissionListUpdated` untuk real-time monitoring
- ✅ Event: `submissionUpdated` untuk status changes

**Backend Integration:**

- ✅ [`GET /classes/:classId/assignments/:assignmentId/submissions`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-classesclassidassignmentsassignmentidsubmissions)
- ✅ [`PATCH /submissions/:id/grade`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#patch-submissionsidgrade)

### **Phase 7: Student Writing Experience Overhaul (Week 7-8)**

#### 7.1 Assignment View & Management (Student)

```
Priority: High
Estimasi: 3 hari
```

**Files yang Dimodifikasi:**

- [ ] [`src/components/student/DetailTugasStudent.jsx`](src/components/student/DetailTugasStudent.jsx) - improve assignment view dan submission flow

**Tasks:**

- [ ] Assignment detail dengan clear instructions
- [ ] Deadline countdown dan reminders
- [ ] Submission status tracking
- [ ] File download functionality
- [ ] Feedback dan rating system improvement

**Backend Integration:**

- ✅ [`GET /submissions/:id/download`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-submissionsiddownload)

#### 7.2 Writing Editor Complete Overhaul

```
Priority: Critical
Estimasi: 5 hari
```

**Files yang Dimodifikasi:**

- [ ] [`src/components/student/EditorTugas.jsx`](src/components/student/EditorTugas.jsx) - complete rewrite
- [ ] [`src/ckeditor.js`](src/ckeditor.js) - improve editor configuration

**Tasks:**

- [ ] Clean editor interface dengan minimal distractions
- [ ] Real-time auto-save dengan visual indicator
- [ ] Word count & character limit display
- [ ] Citation tools integration improvement
- [ ] Anti-copy-paste feedback yang user-friendly
- [ ] Draft management sistem
- [ ] Collaborative features preparation

**WebSocket Integration:**

- ✅ Event: `updateContent` untuk auto-save
- ✅ Response: `{ status: 'success', updatedAt }` untuk feedback

**Backend Integration:**

- ✅ [`POST /assignments/:assignmentId/submissions`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-assignmentsassignmentidsubmissions)
- ✅ [`PATCH /submissions/:id/content`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#patch-submissionsidcontent)
- ✅ [`POST /submissions/:id/submit`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-submissionsidsubmit)

### **Phase 8: Plagiarism & Analytics Interface (Week 8-9)**

#### 8.1 Plagiarism Detection Interface

```
Priority: Medium
Estimasi: 4 hari
```

**Tasks:**

- [ ] Plagiarism report visualization yang interaktif
- [ ] Source highlighting dalam text dengan color coding
- [ ] Detailed source list dengan links dan credibility scores
- [ ] Batch plagiarism checking interface
- [ ] Progress tracking untuk plagiarism jobs

**Backend Integration:**

- ✅ [`POST /submissions/:id/check-plagiarism`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-submissionsidcheck-plagiarism)
- ✅ [`GET /submissions/:id/plagiarism-report`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-submissionsidplagiarism-report)
- ✅ [`GET /plagiarism/queue-stats`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-plagiarismqueue-stats)

#### 8.2 Analytics & Reports

```
Priority: Medium
Estimasi: 3 hari
```

**Tasks:**

- [ ] Student progress analytics dengan charts
- [ ] Class performance overview dashboard
- [ ] Plagiarism trends analysis
- [ ] Export reports functionality (PDF/Excel)

### **Phase 9: Payment & Subscription System (Week 9-10)**

#### 9.1 Payment Interface Redesign

```
Priority: High
Estimasi: 4 hari
```

**Files yang Dimodifikasi:**

- [ ] [`src/components/instruktur/CustomPaketKelas.jsx`](src/components/instruktur/CustomPaketKelas.jsx) - improve calculator
- [ ] [`src/components/instruktur/PilihPaketKelas.jsx`](src/components/instruktur/PilihPaketKelas.jsx) - better package selection
- [ ] [`src/components/instruktur/PaymentPage.jsx`](src/components/instruktur/PaymentPage.jsx) - streamline payment flow
- [ ] [`src/components/instruktur/AssignmentPayment.jsx`](src/components/instruktur/AssignmentPayment.jsx) - assignment-specific payment

**Tasks:**

- [ ] Pricing calculator untuk custom packages
- [ ] Smooth payment flow dengan Midtrans integration
- [ ] Transaction history tracking
- [ ] Invoice management dan download
- [ ] Quota tracking & alerts system

**Backend Integration:**

- ✅ [`POST /payments/create-transaction`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-paymentscreate-transaction)
- ✅ [`POST /payments/webhook`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-paymentswebhook) (handling di backend)

### **Phase 10: Admin Dashboard (Week 10-11)**

#### 10.1 Admin Interface Development

```
Priority: Low
Estimasi: 5 hari
```

**Files yang Dimodifikasi:**

- [ ] Files di [`src/components/admin/`](src/components/admin/) - complete overhaul

**Tasks:**

- [ ] System monitoring dashboard
- [ ] User management interface
- [ ] Queue monitoring dengan visual indicators
- [ ] System health checks display
- [ ] Configuration management interface

### **Phase 11: Mobile Optimization & PWA (Week 11-12)**

#### 11.1 Mobile-First Responsive Design

```
Priority: Medium
Estimasi: 4 hari
```

**Tasks:**

- [ ] Mobile navigation patterns
- [ ] Touch-friendly interactions
- [ ] Optimized forms untuk mobile
- [ ] Editor mobile experience

#### 11.2 PWA Implementation

```
Priority: Low
Estimasi: 3 hari
```

**Tasks:**

- [ ] Service worker untuk offline support
- [ ] App manifest configuration
- [ ] Push notifications setup
- [ ] Install prompt implementation

### **Phase 12: Testing, Performance & Deploy (Week 12-13)**

#### 12.1 Performance Optimization

```
Priority: High
Estimasi: 4 hari
```

**Tasks:**

- [ ] Code splitting & lazy loading implementation
- [ ] Bundle size optimization
- [ ] Image optimization dan lazy loading
- [ ] Caching strategies implementation
- [ ] WebSocket connection optimization

#### 12.2 Testing & Quality Assurance

```
Priority: High
Estimasi: 3 hari
```

**Tasks:**

- [ ] Cross-browser compatibility testing
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] User testing & feedback collection
- [ ] Bug fixes & polish
- [ ] Performance monitoring setup

## 🎨 Design System Guidelines

### Color Palette (Existing Branding)

```css
:root {
  /* Primary Colors (mempertahankan brand identity) */
  --primary-900: #1a2f5c;
  --primary-800: #23407a; /* Main brand color - TIDAK DIUBAH */
  --primary-700: #2d4f8f;
  --primary-600: #3b5fa4;
  --primary-500: #4970b8;
  --primary-400: #6b87c7;
  --primary-300: #8d9fd6;
  --primary-200: #afb7e5;
  --primary-100: #d1d7f4;
  --primary-50: #f3f5fc;

  /* Supporting Colors */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;

  /* Neutral Colors */
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-200: #e5e5e5;
  --gray-300: #d4d4d4;
  --gray-400: #a3a3a3;
  --gray-500: #737373;
  --gray-600: #525252;
  --gray-700: #404040;
  --gray-800: #2d2d2d;
  --gray-900: #1a1a1a;
}
```

### Component Patterns (Konsisten dengan Existing)

- **Cards**: White background, subtle shadow (`shadow-lg`), rounded corners (`rounded-lg`)
- **Buttons**: Primary `#23407a`, hover `#16305a`, consistent dengan existing
- **Forms**: Clean labels, proper spacing, validation feedback
- **Navigation**: Active states dengan font-bold dan underline
- **Typography**: Hierarchy yang jelas dengan ukuran yang konsisten

## 📁 Improved File Structure

```
src/
├── components/
│   ├── ui/                    # Base UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Alert/
│   │   └── index.js
│   ├── layout/               # Layout components
│   │   ├── MainLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── DashboardLayout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── Breadcrumb.jsx
│   ├── auth/                 # Auth components
│   ├── student/              # Student components (existing)
│   ├── instruktur/           # Instructor components (existing)
│   ├── admin/                # Admin components (existing)
│   └── common/               # Shared components
│       ├── LoadingSpinner.jsx
│       ├── ErrorBoundary.jsx
│       └── WebSocketProvider.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useWebSocket.js
│   ├── useLocalStorage.js
│   └── useApi.js
├── services/
│   ├── api.js               # Existing API service
│   ├── websocket.js         # WebSocket service
│   └── storage.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validation.js
├── styles/
│   ├── tokens.css
│   ├── globals.css
│   ├── components.css
│   └── utilities.css
└── contexts/
    ├── AuthContext.jsx
    ├── ThemeContext.jsx
    └── WebSocketContext.jsx
```

## 🔌 Backend Integration Status

### ✅ Sudah Terintegrasi & Berfungsi:

- **Authentication**: Login, Register, Google OAuth
- **Class Management**: Create, Join, List classes
- **Assignment Management**: Create, List assignments
- **Submission System**: Create, Update, Submit submissions
- **Payment Integration**: Midtrans payment flow
- **File Storage**: Upload/Download functionality

### 🔄 Perlu Diperbaiki/Ditingkatkan:

- **WebSocket Integration**: Real-time features perlu improvement
- **Error Handling**: Standardisasi error handling
- **Loading States**: Konsisten loading indicators
- **Caching**: Implementasi caching strategy

### ⚡ WebSocket Events yang Sudah Tersedia:

```javascript
// Auto-save functionality
socket.emit("updateContent", {
  submissionId: "uuid",
  content: "text content",
  updatedAt: new Date().toISOString(),
});

// Listen for submission updates
socket.on("submissionUpdated", (data) => {
  // Handle submission status changes
});

// Listen for notifications
socket.on("notification", (data) => {
  // Handle real-time notifications
});
```

## ⚡ Implementation Strategy

### Quick Wins (Week 1-2)

1. **Setup design system foundation**
2. **Create reusable UI components**
3. **Implement consistent layouts**

### Core Features (Week 3-8)

1. **Landing pages improvement**
2. **Dashboard redesign**
3. **Class management overhaul**
4. **Assignment system complete rewrite**
5. **Student writing experience improvement**

### Advanced Features (Week 9-12)

1. **Plagiarism interface enhancement**
2. **Payment system improvement**
3. **Admin dashboard development**
4. **Mobile optimization**

### Final Polish (Week 12-13)

1. **Performance optimization**
2. **Testing & bug fixes**
3. **Documentation**
4. **Deploy preparation**

## 🚀 Success Metrics

### Performance Targets

- **Page load time**: < 2 seconds
- **First Contentful Paint**: < 1.5 seconds
- **Time to Interactive**: < 3 seconds
- **Bundle size**: < 1MB (optimized)

### User Experience Targets

- **Mobile-friendly**: 100% responsive
- **Accessibility**: WCAG 2.1 AA compliance
- **Cross-browser**: Support for Chrome, Firefox, Safari, Edge
- **Offline capability**: Basic offline functionality with PWA

### Quality Targets

- **Code consistency**: 100% follows design system
- **Component reusability**: 80% shared components
- **Error handling**: Comprehensive error boundaries
- **Real-time features**: < 100ms WebSocket response time

## 📝 Development Guidelines

### 1. Component Development

- **Atomic Design**: Build components from smallest to largest
- **Props Validation**: Use PropTypes atau TypeScript
- **Accessibility**: Include ARIA labels dan keyboard navigation
- **Testing**: Unit tests untuk setiap komponen

### 2. State Management

- **Local State**: useState untuk component-level state
- **Global State**: Context API untuk shared state
- **Server State**: Custom hooks untuk API calls
- **Caching**: Implement proper caching strategies

### 3. Performance Best Practices

- **Code Splitting**: Dynamic imports untuk large components
- **Lazy Loading**: Images dan non-critical components
- **Memoization**: React.memo untuk expensive components
- **Bundle Optimization**: Tree shaking dan dead code elimination

### 4. Quality Assurance

- **Code Review**: Mandatory review untuk setiap PR
- **Testing**: Unit, integration, dan E2E testing
- **Performance Monitoring**: Real User Monitoring (RUM)
- **Error Tracking**: Implement error logging system

---

Rencana ini memberikan roadmap lengkap untuk membangun ulang frontend Protextify dengan fokus pada kualitas, konsistensi, dan performa sambil mempertahankan integrasi backend yang sudah ada dan brand identity yang konsisten.
