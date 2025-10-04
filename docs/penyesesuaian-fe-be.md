## 📊 Analisis Struktur Frontend yang Ada

### 🔍 Komponen dan Halaman Saat Ini

```
Frontend Structure Analysis:
├── 🔐 Authentication: Login, Register, Google OAuth ✅
├── 📱 Dashboard: Student & Instructor dashboards ✅
├── 🏫 Classes: Management, Join, Detail ✅
├── 📝 Assignments: Creation, Management ✅
├── 📤 Submissions: Writing, History ✅
├── 💳 Payments: Integration dengan Midtrans ✅
├── 🔍 Plagiarism: UI components ✅
├── 📁 File Management: Upload/Download ✅
└── 📡 WebSocket: Real-time features ✅
```

## ⚠️ Gap Analysis: Frontend vs Backend

### 1. **Data Structure Mismatch**

#### Problem: Classes Service Response Handling

**File:** classes.js

```js
// Current: Assumes enrollment wrapper
const transformedClasses = data.map((enrollment) => {
  const classData = enrollment?.class || {};
  return {
    ...classData,
    enrollmentId: enrollment?.id,
    enrolledAt: enrollment?.joinedAt, // ❌ Backend uses different structure
```

**Backend Actual Response:** `/classes`

```json
// Backend returns direct class array, not enrollment wrapper
[
  {
    "id": "string",
    "name": "string",
    "instructorId": "string",
    "classToken": "string"
  }
]
```

### 2. **Endpoint Path Inconsistencies**

#### Problem: Assignment Creation Endpoint

**File:** constants.js

```js
// Current FE expectation
ASSIGNMENT_CREATE: (classId) => `/classes/${classId}/assignments`,

// ✅ Matches backend: POST /classes/:classId/assignments
```

#### Problem: Submission History Endpoint

**Current:** `src/services/submissions.js` (mock)
**Backend:** `GET /submissions/history`

### 3. **Authentication Flow Gaps**

#### Problem: Missing Email Verification

**Backend Provides:**

- `POST /auth/send-verification`
- `POST /auth/verify-email`

**Frontend Missing:** Email verification components and flow

## 📋 Rencana Kerja Penyesuaian

### **Task 1: Authentication Service Alignment** ✅

**Priority: High | Estimasi: 2 hari**

#### 1.1 Update Auth Service

**File:** auth.js

```js
// ADD: Email verification endpoints
sendVerificationEmail: async (email) => {
  return await api.post("/auth/send-verification", { email });
},

verifyEmail: async (token) => {
  return await api.post("/auth/verify-email", { token });
},
```

#### 1.2 Create Email Verification Components

**New Files:**

- EmailVerification.jsx
- `src/pages/auth/VerifyEmail.jsx`

**Router Update:** index.jsx

```jsx
// ADD routes
{ path: "verify-email", element: <EmailVerification /> },
{ path: "verify/:token", element: <VerifyEmail /> },
```

---

### **Task 2: Classes Service Data Structure Fix** ✅

**Priority: Critical | Estimasi: 1 hari**

#### 2.1 Fix Classes Service Response Handling

**File:** classes.js

```js
// REPLACE current transformation logic
getClasses: async () => {
  try {
    const response = await api.get("/classes");
    // Backend returns direct array, no enrollment wrapper needed
    const data = Array.isArray(response) ? response : [];

    return data.map((classItem) => ({
      id: classItem.id,
      name: classItem.name,
      description: classItem.description,
      instructorId: classItem.instructorId,
      classToken: classItem.classToken,
      createdAt: classItem.createdAt,
      // Remove non-existent fields until properly fetched
      instructor: { fullName: "Loading..." },
      assignments: [],
      _count: { assignments: 0 }
    }));
```

#### 2.2 Update Class Detail Service

**File:** classes.js

```js
// ADD proper class detail fetching
getClassById: async (id) => {
  const response = await api.get(`/classes/${id}`);
  return {
    ...response,
    // Backend provides full instructor and enrollments data
    instructor: response.instructor,
    enrollments: response.enrollments,
    assignments: response.assignments || []
  };
},
```

---

### **Task 3: Assignments Service Implementation**

**Priority: High | Estimasi: 2 hari**

#### 3.1 Create Real Assignments Service

**File:** assignments.js (currently missing)

```js
import api from "./api";

const assignmentsService = {
  // Create assignment (instructor only)
  createAssignment: async (classId, assignmentData) => {
    return await api.post(`/classes/${classId}/assignments`, {
      title: assignmentData.title,
      instructions: assignmentData.instructions,
      deadline: assignmentData.deadline,
      expectedStudentCount: assignmentData.expectedStudentCount,
    });
  },

  // Get assignments for class
  getClassAssignments: async (classId) => {
    return await api.get(`/classes/${classId}/assignments`);
  },
};

export default assignmentsService;
```

#### 3.2 Update Services Index

**File:** index.js

```js
// REPLACE mock with real service
export { default as assignmentsService } from "./assignments";
```

---

### **Task 4: Submissions Service Implementation**

**Priority: High | Estimasi: 2 hari**

#### 4.1 Create Real Submissions Service

**File:** submissions.js (currently missing)

```js
import api from "./api";

const submissionsService = {
  // Create submission draft
  createSubmission: async (assignmentId, content = "") => {
    return await api.post(`/assignments/${assignmentId}/submissions`, {
      content,
    });
  },

  // Get submission history (student)
  getHistory: async () => {
    return await api.get("/submissions/history");
  },

  // Get class history (instructor)
  getClassHistory: async (classId) => {
    return await api.get(`/classes/${classId}/history`);
  },

  // Get submission detail
  getSubmissionById: async (id) => {
    return await api.get(`/submissions/${id}`);
  },

  // Update submission content (auto-save)
  updateContent: async (id, content) => {
    return await api.patch(`/submissions/${id}/content`, { content });
  },

  // Submit for grading
  submitAssignment: async (id) => {
    return await api.post(`/submissions/${id}/submit`);
  },

  // Download submission
  downloadSubmission: async (id, format = "pdf") => {
    return await api.get(`/submissions/${id}/download?format=${format}`);
  },
};

export default submissionsService;
```

---

### **Task 5: Dashboard Data Fetching Fix**

**Priority: High | Estimasi: 1 hari**

#### 5.1 Update Student Dashboard Hook

**File:** useStudentDashboard.js

```js
// REPLACE mock data fetching with real API calls
const fetchDashboardData = useCallback(async () => {
  try {
    setLoading(true);

    const [classesData, submissionsData] = await Promise.all([
      classesService.getClasses(),      // ✅ Real API call
      submissionsService.getHistory()   // ✅ Real API call
    ]);

    // Process real backend data structure
    const safeClassesData = Array.isArray(classesData) ? classesData : [];
    const safeSubmissionsData = Array.isArray(submissionsData) ? submissionsData : [];

    // Calculate stats from real data
    const totalClasses = safeClassesData.length;
    // Note: assignments count requires separate API calls to get accurate data
```

#### 5.2 Fix Dashboard Statistics Calculation

```js
// UPDATE to match backend data structure
const activeAssignments = 0; // Will require class assignments API calls
const completedAssignments = safeSubmissionsData.filter(
  (s) => s.status === "SUBMITTED" || s.status === "GRADED"
).length;
const pendingSubmissions = safeSubmissionsData.filter(
  (s) => s.status === "DRAFT"
).length;
```

---

### **Task 6: Plagiarism Service Implementation**

**Priority: Medium | Estimasi: 1 hari**

#### 6.1 Replace Mock Plagiarism Service

**File:** index.js

```js
// REPLACE mock with real implementation
export const plagiarismService = {
  // Trigger plagiarism check (instructor only)
  checkPlagiarism: async (submissionId, options = {}) => {
    return await api.post(
      `/submissions/${submissionId}/check-plagiarism`,
      options
    );
  },

  // Get plagiarism report
  getPlagiarismReport: async (submissionId) => {
    return await api.get(`/submissions/${submissionId}/plagiarism-report`);
  },

  // Get queue stats (debugging)
  getQueueStats: async () => {
    return await api.get("/plagiarism/queue-stats");
  },
};
```

---

### **Task 7: Payment Service Integration**

**Priority: Medium | Estimasi: 1 hari**

#### 7.1 Update Payment Service with Real Endpoints

**File:** payments.js (create if missing)

```js
import api from "./api";

const paymentsService = {
  // Create payment transaction
  createTransaction: async (amount, assignmentId) => {
    return await api.post("/payments/create-transaction", {
      amount,
      assignmentId,
    });
  },

  // Get transaction history
  getTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/payments/transactions?${queryString}`);
  },
};

export default paymentsService;
```

---

### **Task 8: WebSocket Events Alignment**

**Priority: Medium | Estimasi: 1 hari**

#### 8.1 Update WebSocket Service Events

**File:** websocket.js or create new

```js
// ALIGN with backend WebSocket events
const websocketService = {
  // Auto-save content
  updateContent: (submissionId, content) => {
    socket.emit("updateContent", {
      submissionId,
      content,
      updatedAt: new Date().toISOString(),
    });
  },

  // Listen for notifications
  onNotification: (callback) => {
    socket.on("notification", callback);
  },

  // Listen for submission updates
  onSubmissionUpdated: (callback) => {
    socket.on("submissionUpdated", callback);
  },

  // Listen for submission list updates
  onSubmissionListUpdated: (callback) => {
    socket.on("submissionListUpdated", callback);
  },
};
```

---

### **Task 9: Error Handling Standardization**

**Priority: High | Estimasi: 1 hari**

#### 9.1 Update API Error Handling

**File:** api.js

```js
// UPDATE error response handling to match backend structure
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message ||
                   error.response?.data?.error ||
                   error.message ||
                   "Terjadi kesalahan yang tidak diketahui";

    // Handle backend error structure
    switch (error.response?.status) {
      case 400:
        toast.error("Data tidak valid: " + message);
        break;
      case 401:
        // Backend returns 401 for invalid/expired tokens
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        break;
      case 403:
        toast.error("Anda tidak memiliki akses: " + message);
        break;
      case 404:
        toast.error("Data tidak ditemukan");
        break;
      case 409:
        toast.error("Konflik data: " + message);
        break;
```

---

### **Task 10: Component Updates for Backend Data**

**Priority: Medium | Estimasi: 2 hari**

#### 10.1 Update Class Components

**Files:**

- Classes.jsx
- Classes.jsx

```jsx
// UPDATE to handle backend class structure
const classes = classesData.map((cls) => ({
  ...cls,
  // Backend provides instructorId, need to fetch instructor details separately
  instructor: cls.instructor || { fullName: "Loading..." },
  assignmentCount: cls.assignments?.length || 0,
}));
```

#### 10.2 Update Assignment Components

**Files:**

- CreateAssignment.jsx
- `src/components/instructor/AssignmentForm.jsx`

```jsx
// UPDATE form to match backend expected fields
const handleSubmit = async (data) => {
  try {
    const result = await assignmentsService.createAssignment(classId, {
      title: data.title,
      instructions: data.instructions,
      deadline: data.deadline,
      expectedStudentCount: parseInt(data.expectedStudentCount),
    });

    // Backend returns payment requirement info
    if (result.paymentRequired) {
      // Navigate to payment flow
      setPaymentData(result.paymentData);
    }
  } catch (error) {
    // Handle error
  }
};
```

---

## 🎯 Summary Tasks Checklist

### **Week 1: Core Services Alignment**

- [ ] **Task 1**: Update Authentication Service & Components
- [ ] **Task 2**: Fix Classes Service Data Structure
- [ ] **Task 3**: Implement Real Assignments Service
- [ ] **Task 4**: Implement Real Submissions Service

### **Week 2: Integration & UI Updates**

- [ ] **Task 5**: Fix Dashboard Data Fetching
- [ ] **Task 6**: Implement Plagiarism Service
- [ ] **Task 7**: Update Payment Service Integration
- [ ] **Task 8**: Align WebSocket Events

### **Week 3: Polish & Testing**

- [ ] **Task 9**: Standardize Error Handling
- [ ] **Task 10**: Update Components for Backend Data
- [ ] **Task 11**: End-to-end Testing with Real Backend
- [ ] **Task 12**: Performance Optimization

## 🔧 Critical Files to Modify

| Priority    | File Path              | Changes Required                     |
| ----------- | ---------------------- | ------------------------------------ |
| 🔴 Critical | classes.js             | Data structure transformation fix    |
| 🔴 Critical | assignments.js         | Create real service (currently mock) |
| 🔴 Critical | submissions.js         | Create real service (currently mock) |
| 🟡 High     | useStudentDashboard.js | Real API integration                 |
| 🟡 High     | api.js                 | Error handling alignment             |
| 🟡 High     | auth                   | Email verification flow              |
| 🟢 Medium   | plagiarism.js          | Replace mock implementation          |
| 🟢 Medium   | instructor             | Assignment creation flow             |

## ⚡ Quick Wins (Immediate Impact)

1. **Fix Classes Service** (30 minutes) - Immediate dashboard fix
2. **Create Assignments Service** (1 hour) - Enable assignment management
3. **Create Submissions Service** (1 hour) - Enable submission workflow
4. **Update Error Handling** (30 minutes) - Better user experience

Rencana ini fokus pada **alignment dengan backend yang ada** tanpa menambahkan fitur baru, memastikan frontend bekerja sepenuhnya dengan API backend Protextify.
