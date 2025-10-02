import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/utils/constants";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk error handling
api.interceptors.response.use(
  (response) => {
    // Return only data from response
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan yang tidak diketahui";

    // Handle specific error codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - redirect to login
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          window.location.href = "/login";
        }
        break;
      case 403:
        toast.error("Anda tidak memiliki akses untuk melakukan tindakan ini");
        break;
      case 404:
        toast.error("Data tidak ditemukan");
        break;
      case 422:
        // Validation errors
        if (error.response.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          errors.forEach((err) => toast.error(err));
        } else {
          toast.error(message);
        }
        break;
      case 429:
        toast.error("Terlalu banyak permintaan. Silakan coba lagi nanti.");
        break;
      case 500:
        toast.error("Terjadi kesalahan server. Silakan coba lagi.");
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
