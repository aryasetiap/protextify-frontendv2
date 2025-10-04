import axios from "axios";
import toast from "react-hot-toast";
import {
  API_BASE_URL,
  BACKEND_ERROR_MESSAGES,
  HTTP_STATUS_MESSAGES,
} from "@/utils/constants";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Sudah ditingkatkan dari 10000
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add logging untuk development
    if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk error handling
api.interceptors.response.use(
  (response) => {
    // Add logging untuk development
    if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${response.status}`
      );
    }

    // Return only data from response
    return response.data;
  },
  (error) => {
    // Enhanced message extraction with backend-specific handling
    const backendMessage =
      error.response?.data?.message || error.response?.data?.error;
    const specificMessage =
      BACKEND_ERROR_MESSAGES[backendMessage] || backendMessage;
    const defaultMessage =
      HTTP_STATUS_MESSAGES[error.response?.status] ||
      "Terjadi kesalahan yang tidak diketahui";

    const message = specificMessage || defaultMessage;

    // Add logging untuk development
    if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
      console.error(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        } - ${error.response?.status}`,
        {
          backendMessage,
          specificMessage,
          defaultMessage,
          finalMessage: message,
        }
      );
    }

    // Enhanced error handling with backend alignment
    switch (error.response?.status) {
      case 400:
        // Backend validation errors
        if (error.response.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          errors.forEach((err) =>
            toast.error(BACKEND_ERROR_MESSAGES[err] || err)
          );
        } else {
          toast.error(message);
        }
        break;
      case 401:
        // Enhanced 401 handling - check if already on auth pages
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        if (
          !["/auth/login", "/login", "/auth/register", "/register"].includes(
            window.location.pathname
          )
        ) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          window.location.href = "/auth/login";
        }
        break;
      case 403:
        // Enhanced forbidden message
        toast.error(message);
        break;
      case 404:
        // Contextual 404 messages
        if (error.config?.url?.includes("/classes/")) {
          toast.error("Kelas tidak ditemukan atau Anda tidak memiliki akses.");
        } else if (error.config?.url?.includes("/assignments/")) {
          toast.error("Assignment tidak ditemukan.");
        } else if (error.config?.url?.includes("/submissions/")) {
          toast.error("Submission tidak ditemukan.");
        } else {
          toast.error("Data tidak ditemukan.");
        }
        break;
      case 409:
        // Enhanced conflict handling
        if (backendMessage?.includes("already enrolled")) {
          toast.error("Anda sudah bergabung di kelas ini.");
        } else if (backendMessage?.includes("already submitted")) {
          toast.error("Tugas sudah dikumpulkan sebelumnya.");
        } else {
          toast.error(message);
        }
        break;
      case 422:
        // Enhanced validation error handling
        if (error.response.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          errors.forEach((err) =>
            toast.error(BACKEND_ERROR_MESSAGES[err] || err)
          );
        } else {
          toast.error(message);
        }
        break;
      case 429:
        toast.error("Terlalu banyak permintaan. Silakan tunggu beberapa saat.");
        break;
      case 500:
        toast.error("Terjadi kesalahan server. Tim teknis telah diberitahu.");
        break;
      case 503:
        toast.error(
          "Layanan sedang dalam pemeliharaan. Silakan coba lagi nanti."
        );
        break;
      default:
        if (error.response?.status >= 400) {
          toast.error(message);
        }
    }

    return Promise.reject(error);
  }
);

export default api;
