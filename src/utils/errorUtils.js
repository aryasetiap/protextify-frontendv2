// NEW FILE: Enhanced error handling utilities
import { BACKEND_ERROR_MESSAGES, HTTP_STATUS_MESSAGES } from "./constants";

export const getErrorMessage = (error) => {
  const backendMessage =
    error.response?.data?.message || error.response?.data?.error;
  const specificMessage = BACKEND_ERROR_MESSAGES[backendMessage];
  const defaultMessage = HTTP_STATUS_MESSAGES[error.response?.status];

  return (
    specificMessage ||
    backendMessage ||
    defaultMessage ||
    "Terjadi kesalahan yang tidak diketahui"
  );
};

export const getErrorContext = (error) => {
  const url = error.config?.url || "";
  const method = error.config?.method?.toUpperCase();
  const status = error.response?.status;

  if (url.includes("/auth/")) return "authentication";
  if (url.includes("/classes/")) return "classes";
  if (url.includes("/assignments/")) return "assignments";
  if (url.includes("/submissions/")) return "submissions";
  if (url.includes("/payments/")) return "payments";
  if (url.includes("/plagiarism/")) return "plagiarism";

  return "general";
};

export const isRetryableError = (error) => {
  const status = error.response?.status;
  return status >= 500 || status === 429 || error.code === "NETWORK_ERROR";
};
