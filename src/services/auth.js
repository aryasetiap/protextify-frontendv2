import api from "./api";

const authService = {
  // Login dengan email dan password
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Register user baru
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get("/users/me");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.patch("/users/me", userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Send email verification
  sendVerification: async (email) => {
    try {
      const response = await api.post("/auth/send-verification", { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verify email with token
  verifyEmail: async (token) => {
    try {
      const response = await api.post("/auth/verify-email", { token });
      return response;
    } catch (error) {
      throw error;
    }
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

  // Refresh token (if backend supports it)
  refreshToken: async () => {
    try {
      const response = await api.post("/auth/refresh");
      if (response.accessToken) {
        localStorage.setItem("token", response.accessToken);
      }
      return response;
    } catch (error) {
      // If refresh fails, logout
      authService.logout();
      throw error;
    }
  },
};

export default authService;
