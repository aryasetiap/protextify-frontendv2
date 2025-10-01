export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";

export const USER_ROLES = {
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
};

export const SUBMISSION_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  GRADED: "GRADED",
};

export const ASSIGNMENT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ARCHIVED: "ARCHIVED",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CLASSES: "/dashboard/classes",
  JOIN_CLASS: "/dashboard/join-class",
  INSTRUCTOR_DASHBOARD: "/instructor/dashboard",
  INSTRUCTOR_CLASSES: "/instructor/classes",
  CREATE_CLASS: "/instructor/create-class",
};

export const BRAND_COLORS = {
  primary: "#23407a",
  primaryDark: "#1a2f5c",
  primaryLight: "#3b5fa4",
};
