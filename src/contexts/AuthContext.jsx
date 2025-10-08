import { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "react-hot-toast";
import authService from "../services/auth";

const AuthContext = createContext();

// Auth reducer untuk state management
const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "LOGIN_START":
      return { ...state, loading: true, error: null };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case "UPDATE_USER":
      return { ...state, user: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  token: authService.getToken(),
  isAuthenticated: !!authService.getToken(),
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line
  }, []);

  // Auto-refresh token every 50 minutes (if token expires in 1 hour)
  useEffect(() => {
    if (state.isAuthenticated) {
      const refreshInterval = setInterval(() => {
        refreshTokenSilently();
      }, 50 * 60 * 1000); // 50 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [state.isAuthenticated]);

  const checkAuthStatus = async () => {
    const token = authService.getToken();

    if (token) {
      try {
        const user = await authService.getCurrentUser();
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token },
        });
      } catch (error) {
        // Token invalid or expired
        authService.logout();
        dispatch({ type: "LOGOUT" });
      }
    } else {
      dispatch({ type: "LOGOUT" });
    }

    dispatch({ type: "SET_LOADING", payload: false });
  };

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authService.login(credentials);

      if (response.accessToken) {
        localStorage.setItem("token", response.accessToken);
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.user,
          token: response.accessToken,
        },
      });

      toast.success(`Selamat datang, ${response.user.fullName}!`);

      // Return response agar bisa digunakan di Login component
      return response;
    } catch (error) {
      const formattedError = {
        statusCode: error.response?.data?.statusCode || error.statusCode || 400,
        message:
          error.response?.data?.message || error.message || "Login gagal",
      };
      dispatch({ type: "LOGIN_ERROR", payload: formattedError });
      toast.error(formattedError.message);
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authService.register(userData);

      toast.success("Registrasi berhasil! Silakan cek email untuk verifikasi.");
      dispatch({ type: "SET_LOADING", payload: false });

      return response;
    } catch (error) {
      const formattedError = {
        statusCode: error.response?.data?.statusCode || error.statusCode || 400,
        message:
          error.response?.data?.message || error.message || "Registrasi gagal",
      };
      dispatch({ type: "LOGIN_ERROR", payload: formattedError });
      toast.error(formattedError.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      authService.logout();
      dispatch({ type: "LOGOUT" });
      toast.success("Anda telah logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      toast.success("Profil berhasil diperbarui");
      return updatedUser;
    } catch (error) {
      const formattedError = {
        statusCode: error.response?.data?.statusCode || error.statusCode || 400,
        message:
          error.response?.data?.message ||
          error.message ||
          "Gagal memperbarui profil",
      };
      toast.error(formattedError.message);
      throw error;
    }
  };

  const refreshTokenSilently = async () => {
    try {
      await authService.refreshToken();
    } catch (error) {
      logout();
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value = {
    // State
    ...state,

    // Actions
    login,
    register,
    logout,
    updateUser,
    clearError,
    checkAuthStatus,

    // Helper functions
    isAuthenticated: state.isAuthenticated,
    isLoading: state.loading,
    hasError: !!state.error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
