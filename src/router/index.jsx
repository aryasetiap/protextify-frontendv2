import { createBrowserRouter, Navigate } from "react-router-dom";
import { USER_ROLES } from "../utils/constants";

// Layouts
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Components
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import ErrorBoundary from "../components/ErrorBoundary";

// Public Pages
import {
  Home,
  About,
  Pricing,
  Help,
  Docs,
  Privacy,
  Terms,
  NotFound,
} from "../pages/public";

// Auth Pages
import {
  Login,
  Register,
  EmailVerification,
  GoogleCallback,
  ForgotPassword,
  ResetPassword,
} from "../pages/auth";

// Student Pages
import {
  StudentDashboard,
  StudentClasses,
  JoinClass,
  StudentAssignments,
  StudentSubmissions,
  WriteAssignment,
  StudentClassDetail,
  StudentProfile,
  SubmissionDetail,
  PlagiarismReport,
  StorageHealth,
} from "../pages/student";

// Instructor Pages
import {
  InstructorDashboard,
  InstructorClasses,
  CreateClass,
  ClassDetail,
  ClassSettings,
  CreateAssignment,
  AssignmentDetail,
  MonitorSubmissions,
  BulkGrade,
  AssignmentAnalytics,
  PlagiarismAnalysis,
  TransactionHistory,
  TransactionDetail,
} from "../pages/instructor";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Layout dengan Header untuk public pages
    errorElement: <NotFound />,
    children: [
      // Public routes
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "pricing", element: <Pricing /> },
      { path: "help", element: <Help /> },
      { path: "docs", element: <Docs /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      {
        path: "verify-email",
        element: (
          <PublicRoute>
            <EmailVerification />
          </PublicRoute>
        ),
      },

      // Auth routes (gunakan RootLayout juga)
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: (
              <PublicRoute>
                <Login />
              </PublicRoute>
            ),
          },
          {
            path: "register",
            element: (
              <PublicRoute>
                <Register />
              </PublicRoute>
            ),
          },
          {
            path: "email-verification",
            element: (
              <PublicRoute>
                <EmailVerification />
              </PublicRoute>
            ),
          },
          {
            path: "google/callback",
            element: <GoogleCallback />,
          },
          {
            path: "forgot-password",
            element: (
              <PublicRoute>
                {/* TODO: Aktifkan logic setelah endpoint BE tersedia */}
                <ForgotPassword />
              </PublicRoute>
            ),
          },
          {
            path: "reset-password",
            element: (
              <PublicRoute>
                {/* TODO: Aktifkan logic setelah endpoint BE tersedia */}
                <ResetPassword />
              </PublicRoute>
            ),
          },
          {
            path: "verify-email",
            element: (
              <PublicRoute>
                <EmailVerification />
              </PublicRoute>
            ),
          },
        ],
      },
    ],
  },

  // Dashboard routes dengan layout terpisah (tanpa Header)
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="overview" replace />,
      },
      {
        path: "overview",
        element: <StudentDashboard />,
      },
      {
        path: "classes",
        element: <StudentClasses />,
      },
      {
        path: "join-class",
        element: <JoinClass />,
      },
      {
        path: "assignments",
        element: <StudentAssignments />,
      },
      {
        path: "submissions",
        element: <StudentSubmissions />,
      },
      {
        path: "classes/:classId",
        element: <StudentClassDetail />,
      },
      {
        path: "assignments/:id/write",
        element: <WriteAssignment />,
      },
      {
        path: "profile",
        element: <StudentProfile />,
      },
      {
        path: "submissions/:id",
        element: <SubmissionDetail />,
      },
      {
        path: "submissions/:id/plagiarism-report",
        element: <PlagiarismReport />,
      },
      {
        path: "storage-health",
        element: <StorageHealth />,
      },
      {
        path: "plagiarism/:submissionId",
        element: <PlagiarismAnalysis />,
      },
    ],
  },

  // Instructor routes dengan layout terpisah (tanpa Header)
  {
    path: "/instructor",
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.INSTRUCTOR]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <InstructorDashboard />,
      },
      {
        path: "classes",
        element: <InstructorClasses />,
      },
      {
        path: "create-class",
        element: <CreateClass />,
      },
      {
        path: "classes/:classId",
        element: <ClassDetail />,
      },
      {
        path: "classes/:classId/settings",
        element: <ClassSettings />,
      },
      {
        path: "classes/:classId/create-assignment",
        element: <CreateAssignment />,
      },
      {
        path: "assignments/:assignmentId",
        element: <AssignmentDetail />,
      },
      {
        path: "assignments/:assignmentId/monitor",
        element: <MonitorSubmissions />,
      },
      {
        path: "assignments/:assignmentId/bulk-grade",
        element: <BulkGrade />,
      },
      {
        path: "assignments/:assignmentId/analytics",
        element: <AssignmentAnalytics />,
      },
      {
        path: "plagiarism/:submissionId",
        element: <PlagiarismAnalysis />,
      },
      {
        path: "transactions",
        element: <TransactionHistory />,
      },
      {
        path: "transactions/:transactionId",
        element: <TransactionDetail />,
      },
    ],
  },

  // Legacy redirects
  {
    path: "login",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "register",
    element: <Navigate to="/auth/register" replace />,
  },
  {
    path: "classes/:classId/assignments/:assignmentId/write",
    element: <WriteAssignment />,
  },
]);

export default router;
