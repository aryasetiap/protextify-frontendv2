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
import { Home, About, NotFound } from "../pages/public";

// Auth Pages
import {
  Login,
  Register,
  EmailVerification,
  GoogleCallback,
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
} from "../pages/instructor";
import PlagiarismAnalysis from "../pages/instructor/PlagiarismAnalysis";
import TransactionHistory from "../pages/instructor/TransactionHistory";
import TransactionDetail from "../pages/instructor/TransactionDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      // Public routes
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },

      // Auth routes (only for non-authenticated users)
      {
        path: "auth",
        element: <AuthLayout />,
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
        ],
      },

      // Legacy auth routes (for backward compatibility)
      {
        path: "login",
        element: <Navigate to="/auth/login" replace />,
      },
      {
        path: "register",
        element: <Navigate to="/auth/register" replace />,
      },

      // Protected Dashboard Routes (STUDENT)
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/overview" replace />,
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
            path: "plagiarism/:submissionId",
            element: <PlagiarismAnalysis />,
          },
        ],
      },

      // Protected Instructor Routes (INSTRUCTOR)
      {
        path: "instructor",
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.INSTRUCTOR]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/instructor/dashboard" replace />,
          },
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

      // Fallback for unmatched routes
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
