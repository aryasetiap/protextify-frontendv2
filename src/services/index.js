export { default as api } from "./api";
export { default as authService } from "./auth";
export { default as classesService } from "./classes";
export { default as assignmentsService } from "./assignments";
export { default as submissionsService } from "./submissions";
export { default as paymentsService } from "./payments";

// Mock services untuk yang belum tersedia
export const plagiarismService = {
  checkPlagiarism: () => Promise.resolve({}),
  getPlagiarismReport: () => Promise.resolve({}),
};

export const uploadService = {
  uploadFile: () => Promise.resolve({}),
};

export const websocketService = {
  connect: () => Promise.resolve(),
  disconnect: () => {},
  on: () => {},
  off: () => {},
  emit: () => {},
};

// Utility functions
export { useApi } from "../hooks/useApi";
export { useAsyncData } from "../hooks/useAsyncData";
