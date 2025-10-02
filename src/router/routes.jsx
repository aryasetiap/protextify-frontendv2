import { USER_ROLES } from "../utils/constants";

export const ROUTES = {
  // Public routes
  HOME: "/",
  ABOUT: "/about",

  // Auth routes
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    EMAIL_VERIFICATION: "/auth/email-verification",
    GOOGLE_CALLBACK: "/auth/google/callback",
  },

  // Legacy auth routes (for backward compatibility)
  LOGIN: "/login", // redirects to /auth/login
  REGISTER: "/register", // redirects to /auth/register

  // Student routes
  STUDENT: {
    DASHBOARD: "/dashboard/overview", // ✅ Pastikan ini konsisten
    CLASSES: "/dashboard/classes",
    JOIN_CLASS: "/dashboard/join-class",
    ASSIGNMENTS: "/dashboard/assignments",
    WRITE_ASSIGNMENT: (assignmentId) =>
      `/dashboard/assignments/${assignmentId}/write`,
    SUBMISSIONS: "/dashboard/submissions",
  },

  // Instructor routes
  INSTRUCTOR: {
    DASHBOARD: "/instructor/dashboard", // ✅ Pastikan ini konsisten
    CLASSES: "/instructor/classes",
    CREATE_CLASS: "/instructor/create-class",
    CLASS_DETAIL: (classId) => `/instructor/classes/${classId}`,
    CREATE_ASSIGNMENT: (classId) =>
      `/instructor/classes/${classId}/create-assignment`,
    ASSIGNMENT_DETAIL: (assignmentId) =>
      `/instructor/assignments/${assignmentId}`,
    MONITOR_SUBMISSIONS: (assignmentId) =>
      `/instructor/assignments/${assignmentId}/monitor`,
  },

  // Error routes
  NOT_FOUND: "/404",
};

export const getPublicRoutes = () => [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.EMAIL_VERIFICATION,
  ROUTES.AUTH.GOOGLE_CALLBACK,
  ROUTES.LOGIN, // legacy
  ROUTES.REGISTER, // legacy
];

export default ROUTES;
