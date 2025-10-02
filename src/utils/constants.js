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
  GOOGLE_CALLBACK: "/auth/google/callback",
};

// Auth related constants
export const AUTH_STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  REFRESH_TOKEN: "refreshToken",
};

export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

// ===== DESIGN SYSTEM CONSTANTS =====
export const BRAND_COLORS = {
  PRIMARY: "#23407a",
  PRIMARY_DARK: "#1a2f5c",
  PRIMARY_LIGHT: "#3b5fa4",
  PRIMARY_LIGHTER: "#4f6bb5",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
  INFO: "#3b82f6",
};

export const COLOR_PALETTE = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#23407a", // Main brand
    900: "#1e3a8a",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
};

// API Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Koneksi bermasalah. Periksa internet Anda.",
  UNAUTHORIZED: "Sesi telah berakhir. Silakan login kembali.",
  FORBIDDEN: "Anda tidak memiliki akses untuk melakukan tindakan ini.",
  NOT_FOUND: "Data tidak ditemukan.",
  VALIDATION_ERROR: "Data yang dimasukkan tidak valid.",
  SERVER_ERROR: "Terjadi kesalahan server. Silakan coba lagi.",
  TIMEOUT_ERROR: "Permintaan membutuhkan waktu terlalu lama.",
};

// Feature flags
export const FEATURES = {
  GOOGLE_AUTH: import.meta.env.VITE_ENABLE_GOOGLE_AUTH === "true",
  WEBSOCKET: import.meta.env.VITE_ENABLE_WEBSOCKET === "true",
  PLAGIARISM: import.meta.env.VITE_ENABLE_PLAGIARISM === "true",
};

export const TYPOGRAPHY_SCALE = {
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.625",
  },

  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
};

export const SPACING_SCALE = {
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
};

export const BORDER_RADIUS = {
  none: "0",
  sm: "0.125rem", // 2px
  default: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
};

export const BOX_SHADOW = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  default: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  brand: "0 4px 14px 0 rgba(35, 64, 122, 0.15)",
  brandLg: "0 10px 28px 0 rgba(35, 64, 122, 0.2)",
};

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
};

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const ANIMATION_DURATION = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  slower: "500ms",
};

export const TRANSITION_EASING = {
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  linear: "linear",
};
