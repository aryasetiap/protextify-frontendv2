import api from "./api";

const authService = {
  // Login dengan email dan password
  login: async (credentials) => {
    return await api.post("/auth/login", credentials);
  },

  // Register user baru
  register: async (userData) => {
    return await api.post("/auth/register", userData);
  },

  // Get current user profile
  getCurrentUser: async () => {
    return await api.get("/users/me");
  },

  // Update user profile
  updateProfile: async (userData) => {
    return await api.patch("/users/me", userData);
  },

  // Send email verification
  sendVerification: async (email) => {
    return await api.post("/auth/send-verification", { email });
  },

  // Tambahkan alias untuk konsistensi dengan spek task
  sendVerificationEmail: async (email) => {
    return await authService.sendVerification(email);
  },

  // Verify email with token
  verifyEmail: async (token) => {
    return await api.post("/auth/verify-email", { token });
  },

  // Google OAuth login
  googleLogin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  },

  // Logout (clear local data)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Get instructor-only endpoint (untuk testing role)
  getInstructorOnly: async () => {
    return await api.get("/auth/instructor-only");
  },
};

export default authService;
