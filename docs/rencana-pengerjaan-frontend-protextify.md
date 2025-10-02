# 🔄 Rencana Pengerjaan Frontend Protextify dari Awal

## 📊 Executive Summary

Membangun frontend Protextify dari awal menggunakan React 19.1.0 + Vite + TailwindCSS dengan integrasi backend API yang sudah tersedia. Fokus pada **implementasi clean**, **design system konsisten**, dan **user experience yang optimal**.

## 🎯 Tujuan Utama

1. **Membangun frontend dari awal** dengan arsitektur yang scalable
2. **Implementasi design system** yang konsisten dengan brand color `#23407a`
3. **Integrasi lengkap dengan backend API** yang sudah tersedia
4. **Real-time features** dengan WebSocket integration
5. **Mobile-responsive** dan **PWA-ready**

## 🛠️ Tech Stack

- **Framework**: React 19.1.0 + Vite 7.1.7
- **Styling**: TailwindCSS 4.1.13 (dengan plugin @tailwindcss/vite)
- **Routing**: React Router DOM (akan diinstall)
- **HTTP Client**: Axios (akan diinstall)
- **WebSocket**: Socket.IO client (akan diinstall)
- **State Management**: Context API + Custom Hooks
- **Forms**: React Hook Form + Zod validation (akan diinstall)
- **Editor**: React Quill atau TipTap (akan diinstall)
- **Icons**: Lucide React (akan diinstall)
- **Notifications**: React Hot Toast (akan diinstall)

## 📋 Phase-by-Phase Development Plan

### **Phase 1: Project Foundation & Design System (Week 1)**

#### 1.1 Dependencies Installation & Basic Setup

```
Priority: Critical
Estimasi: 1 hari
```

**Tasks:**

- [✅] Install core dependencies

```bash
npm install react-router-dom axios socket.io-client
npm install @hookform/resolvers react-hook-form zod
npm install lucide-react react-hot-toast
npm install @headlessui/react clsx tailwind-merge
```

- [✅] Setup project structure dasar
- [✅] Konfigurasi absolute imports di vite.config.js
- [✅] Setup ESLint rules untuk project

**Files yang akan dibuat:**

```
src/
├── components/          # Komponen UI
├── pages/              # Pages/Routes
├── hooks/              # Custom hooks
├── services/           # API services
├── contexts/           # React contexts
├── utils/              # Utility functions
├── styles/             # CSS files
└── assets/             # Static assets
```

#### 1.2 Design System & Brand Colors

```
Priority: Critical
Estimasi: 2 hari
```

**Tasks:**

- [✅] Setup design tokens dengan brand color `#23407a`
- [✅] Konfigurasi TailwindCSS custom colors
- [✅] Buat utility CSS classes
- [✅] Setup typography scale
- [✅] Dokumentasi color palette

**Implementation:**

```css
/* src/styles/globals.css */
@import "tailwindcss";

:root {
  /* Brand Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #23407a; /* Main brand color */
  --primary-900: #1e3a8a;

  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}

/* Custom Components */
.btn-primary {
  @apply bg-[#23407a] hover:bg-[#1a2f5c] text-white font-medium px-4 py-2 rounded-lg transition-colors;
}

.input-field {
  @apply border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent;
}
```

**Tambahkan ke tailwind.config.js:**

```js
// tailwind.config.js (jika diperlukan custom config)
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
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
      },
    },
  },
};
```

#### 1.3 Base Components Library

```
Priority: Critical
Estimasi: 3 hari
```

**Tasks:**

- [✅] Button component dengan variants
- [✅] Input, Textarea, Select components
- [✅] Card, Modal, Alert components
- [✅] Loading spinner dan skeleton components
- [✅] Layout components (Container, Grid, Stack)

**Files:**

```
src/components/ui/
├── Button.jsx
├── Input.jsx
├── Card.jsx
├── Modal.jsx
├── LoadingSpinner.jsx
├── Alert.jsx
└── index.js
```

**Implementation Button.jsx:**

```jsx
// src/components/ui/Button.jsx
import { forwardRef } from "react";
import { clsx } from "clsx";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[#23407a] hover:bg-[#1a2f5c] text-white focus:ring-[#23407a]",
      secondary:
        "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500",
      outline:
        "border border-[#23407a] text-[#23407a] hover:bg-[#23407a] hover:text-white focus:ring-[#23407a]",
      ghost: "text-[#23407a] hover:bg-[#23407a]/10 focus:ring-[#23407a]",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <LoadingSpinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
```

### **Phase 2: Authentication System (Week 2)**

#### 2.1 Auth Context & Services

```
Priority: High
Estimasi: 2 hari
```

**Tasks:**

- [✅] Setup Auth Context dengan React Context API
- [✅] Implementasi auth service dengan Axios
- [✅] Protected Route component
- [✅] Persistent authentication dengan localStorage
- [✅] Auto-refresh token logic

**Backend Integration:**

- ✅ [`POST /auth/login`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-authlogin)
- ✅ [`POST /auth/register`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-authregister)
- ✅ [`GET /auth/google`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-authgoogle)
- ✅ [`GET /users/me`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-usersme)

**Files:**

```
src/
├── contexts/
│   └── AuthContext.jsx
├── services/
│   ├── api.js
│   └── auth.js
├── hooks/
│   └── useAuth.js
└── components/
    ├── ProtectedRoute.jsx
    └── PublicRoute.jsx
```

**Implementation AuthContext.jsx:**

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from "react";
import authService from "../services/auth";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload };
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
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user, token },
          });
        } catch (error) {
          localStorage.removeItem("token");
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "LOGOUT" });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.login(credentials);
      localStorage.setItem("token", response.accessToken);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: response.user, token: response.accessToken },
      });
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR", payload: error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR", payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    dispatch,
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
```

#### 2.2 Authentication Pages

```
Priority: High
Estimasi: 3 hari
```

**Tasks:**

- [✅] Login page dengan form validation
- [✅] Register page dengan role selection
- [✅] Email verification flow
- [✅] Google OAuth integration
- [⚠️] Password reset (jika tersedia di backend | Masih di lewati, BE belum menyediakan)

**Files:**

```
src/pages/
├── auth/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── EmailVerification.jsx
│   └── GoogleCallback.jsx
```

**Implementation Login.jsx:**

```jsx
// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Alert from "../../components/ui/Alert";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      // Error handled by context
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-16 w-auto"
            src="/src/assets/logo-protextify.png"
            alt="Protextify"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Masuk ke akun Anda
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              {...register("email")}
              error={errors.email?.message}
              placeholder="nama@email.com"
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={errors.password?.message}
              placeholder="Masukkan password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              }
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Masuk
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">atau</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              {/* Google icon SVG */}
            </svg>
            Masuk dengan Google
          </Button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="font-medium text-[#23407a] hover:text-[#1a2f5c]"
              >
                Daftar sekarang
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### **Phase 3: Routing & Layout System (Week 3)**

#### 3.1 Router Setup & Route Structure

```
Priority: High
Estimasi: 2 hari
```

**Tasks:**

- [✅] Setup React Router DOM
- [✅] Implement route structure
- [✅] Protected routes untuk authenticated users
- [✅] Role-based routing (STUDENT vs INSTRUCTOR)
- [✅] 404 dan error boundary pages

**Files:**

```
src/
├── router/
│   ├── index.jsx
│   ├── routes.jsx
│   └── ProtectedRoute.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── NotFound.jsx
│   ├── student/
│   │   ├── Dashboard.jsx
│   │   ├── Classes.jsx
│   │   └── JoinClass.jsx
│   └── instructor/
│       ├── Dashboard.jsx
│       ├── Classes.jsx
│       └── CreateClass.jsx
```

**Implementation router/index.jsx:**

```jsx
// src/router/index.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

// Pages
import Home from "../pages/Home";
import About from "../pages/About";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/NotFound";

// Student pages
import StudentDashboard from "../pages/student/Dashboard";
import StudentClasses from "../pages/student/Classes";
import JoinClass from "../pages/student/JoinClass";

// Instructor pages
import InstructorDashboard from "../pages/instructor/Dashboard";
import InstructorClasses from "../pages/instructor/Classes";
import CreateClass from "../pages/instructor/CreateClass";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      // Public routes
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },

      // Auth routes (only for non-authenticated users)
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },

      // Protected routes
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Navigate to="/dashboard/overview" replace />
          </ProtectedRoute>
        ),
      },

      // Student routes
      {
        path: "dashboard",
        element: <ProtectedRoute allowedRoles={["STUDENT"]} />,
        children: [
          { path: "overview", element: <StudentDashboard /> },
          { path: "classes", element: <StudentClasses /> },
          { path: "join-class", element: <JoinClass /> },
        ],
      },

      // Instructor routes
      {
        path: "instructor",
        element: <ProtectedRoute allowedRoles={["INSTRUCTOR"]} />,
        children: [
          { path: "dashboard", element: <InstructorDashboard /> },
          { path: "classes", element: <InstructorClasses /> },
          { path: "create-class", element: <CreateClass /> },
        ],
      },
    ],
  },
]);
```

#### 3.2 Layout Components

```
Priority: High
Estimasi: 2 hari
```

**Tasks:**

- [ ] Main layout dengan header dan footer
- [ ] Dashboard layout dengan sidebar
- [ ] Responsive navigation
- [ ] Breadcrumb component
- [ ] User menu dengan logout

**Files:**

```
src/
├── layouts/
│   ├── MainLayout.jsx
│   ├── DashboardLayout.jsx
│   └── AuthLayout.jsx
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Sidebar.jsx
│   ├── Breadcrumb.jsx
│   └── UserMenu.jsx
```

**Implementation Header.jsx:**

```jsx
// src/components/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Button from "./ui/Button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/src/assets/logo-protextify.png"
                alt="Protextify"
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold text-[#23407a]">
                Protextify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-[#23407a] px-3 py-2 text-sm font-medium"
            >
              Beranda
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-[#23407a] px-3 py-2 text-sm font-medium"
            >
              Tentang
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#23407a]"
                >
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">{user?.fullName}</span>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost">Masuk</Button>
                </Link>
                <Link to="/register">
                  <Button>Daftar</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#23407a] focus:outline-none focus:ring-2 focus:ring-[#23407a]"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#23407a] hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#23407a] hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Tentang
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#23407a] hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-[#23407a] hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2 px-3 py-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Daftar</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
```

### **Phase 4: API Integration & Services (Week 4)**

#### 4.1 API Client Setup

```
Priority: High
Estimasi: 2 hari
```

**Tasks:**

- [✅] Setup Axios dengan base configuration
- [✅] Implement request/response interceptors
- [✅] Error handling centralized
- [✅] API endpoints mapping
- [✅] Loading states management

**Files:**

```
src/services/
├── api.js           # Base axios config
├── auth.js          # Auth endpoints
├── classes.js       # Classes endpoints
├── assignments.js   # Assignments endpoints
├── submissions.js   # Submissions endpoints
├── plagiarism.js    # Plagiarism endpoints
└── payments.js      # Payment endpoints
```

**Implementation api.js:**

```js
// src/services/api.js
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    return response.data;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Terjadi kesalahan";

    // Handle specific error codes
    switch (error.response?.status) {
      case 401:
        // Unauthorized - redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
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
      case 500:
        toast.error("Terjadi kesalahan server. Silakan coba lagi.");
        break;
      default:
        toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
```

#### 4.2 Service Implementation

```
Priority: High
Estimasi: 3 hari
```

**Tasks:**

- [✅] Auth service (login, register, profile)
- [✅] Classes service (CRUD, join class)
- [✅] Assignments service (CRUD, submissions)
- [✅] File upload service
- [✅] WebSocket service setup

**Implementation classes.js:**

```js
// src/services/classes.js
import api from "./api";

const classesService = {
  // Get all classes for current user
  getClasses: async () => {
    return await api.get("/classes");
  },

  // Get class detail by ID
  getClassById: async (id) => {
    return await api.get(`/classes/${id}`);
  },

  // Create new class (instructor only)
  createClass: async (classData) => {
    return await api.post("/classes", classData);
  },

  // Join class using token (student only)
  joinClass: async (classToken) => {
    return await api.post("/classes/join", { classToken });
  },

  // Get assignments for a class
  getClassAssignments: async (classId) => {
    return await api.get(`/classes/${classId}/assignments`);
  },

  // Create assignment in class (instructor only)
  createAssignment: async (classId, assignmentData) => {
    return await api.post(`/classes/${classId}/assignments`, assignmentData);
  },

  // Get submissions for assignment (instructor only)
  getAssignmentSubmissions: async (classId, assignmentId) => {
    return await api.get(
      `/classes/${classId}/assignments/${assignmentId}/submissions`
    );
  },

  // Get class history (instructor only)
  getClassHistory: async (classId) => {
    return await api.get(`/classes/${classId}/history`);
  },
};

export default classesService;
```

### **Phase 5: Dashboard Implementation (Week 5-6)**

#### 5.1 Student Dashboard

```
Priority: High
Estimasi: 4 hari
```

**Tasks:**

- [✅] Dashboard overview dengan statistics
- [✅] Recent assignments list
- [✅] Quick actions (join class, view submissions)
- [✅] Activity timeline
- [✅] Progress indicators

**Backend Integration:**

- ✅ [`GET /classes`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-classes) - untuk daftar kelas student
- ✅ [`GET /submissions/history`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-submissionshistory) - untuk riwayat tugas

**Implementation StudentDashboard.jsx:**

```jsx
// src/pages/student/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Clock, CheckCircle, Plus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import classesService from "../../services/classes";
import submissionsService from "../../services/submissions";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    pendingSubmissions: 0,
  });
  const [recentClasses, setRecentClasses] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch classes and submissions in parallel
      const [classesData, submissionsData] = await Promise.all([
        classesService.getClasses(),
        submissionsService.getHistory(),
      ]);

      // Calculate statistics
      const totalClasses = classesData.length;
      const activeAssignments = classesData.reduce(
        (acc, cls) =>
          acc +
          (cls.assignments?.filter(
            (a) => a.active && new Date(a.deadline) > new Date()
          ).length || 0),
        0
      );
      const completedAssignments = submissionsData.filter(
        (s) => s.status === "SUBMITTED"
      ).length;
      const pendingSubmissions = submissionsData.filter(
        (s) => s.status === "DRAFT"
      ).length;

      setStats({
        totalClasses,
        activeAssignments,
        completedAssignments,
        pendingSubmissions,
      });

      setRecentClasses(classesData.slice(0, 3));
      setRecentSubmissions(submissionsData.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#23407a] to-[#1a2f5c] rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">
          Selamat datang, {user?.fullName}!
        </h1>
        <p className="mt-2 opacity-90">
          Kelola tugas dan kelas Anda dengan mudah
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Kelas</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalClasses}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tugas Aktif</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activeAssignments}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Selesai</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completedAssignments}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingSubmissions}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Classes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Kelas Terbaru
            </h2>
            <Link to="/dashboard/classes">
              <Button variant="ghost" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentClasses.length > 0 ? (
              recentClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-600">
                      {cls.instructor?.fullName}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {cls._count?.assignments || 0} tugas
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada kelas</p>
                <Link to="/dashboard/join-class" className="mt-2 inline-block">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Gabung Kelas
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Aktivitas Terbaru
            </h2>
            <Link to="/dashboard/submissions">
              <Button variant="ghost" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-start space-x-3">
                  <div
                    className={`p-1 rounded-full ${
                      submission.status === "SUBMITTED"
                        ? "bg-green-100"
                        : submission.status === "GRADED"
                        ? "bg-blue-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        submission.status === "SUBMITTED"
                          ? "bg-green-600"
                          : submission.status === "GRADED"
                          ? "bg-blue-600"
                          : "bg-yellow-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {submission.assignment?.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {submission.status === "SUBMITTED"
                        ? "Dikumpulkan"
                        : submission.status === "GRADED"
                        ? "Dinilai"
                        : "Draft"}
                      {" • "}
                      {new Date(submission.updatedAt).toLocaleDateString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada aktivitas</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
```

#### 5.2 Instructor Dashboard

```
Priority: High
Estimasi: 4 hari
```

**Tasks:**

- [✅] Overview statistics untuk instructor
- [✅] Class management overview
- [✅] Recent submissions monitoring
- [✅] Quick actions (create class, create assignment)
- [✅] Analytics charts

**Implementation:** Similar structure dengan data yang berbeda untuk instructor.

### **Phase 6: Class Management System (Week 7-8)**

#### 6.1 Class Creation & Management

```
Priority: High
Estimasi: 5 hari
```

**Tasks:**

- [✅] Create class form dengan validation
- [✅] Class list dengan search & filter
- [✅] Class detail page dengan tabs
- [✅] Member management
- [✅] Class settings

**Backend Integration:**

- ✅ [`POST /classes`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-classes)
- ✅ [`GET /classes/:id`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-classesid)

#### 6.2 Join Class (Student)

```
Priority: High
Estimasi: 2 hari
```

**Tasks:**

- [✅] Join class form dengan token validation
- [✅] Class preview sebelum join
- [✅] Success confirmation
- [✅] Error handling

**Backend Integration:**

- ✅ [`POST /classes/join`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-classesjoin)

### **Phase 7: Assignment System (Week 9-10)**

#### 7.1 Assignment Creation

```
Priority: High
Estimasi: 4 hari
```

**Tasks:**

- [✅] Rich assignment creation form
- [✅] Deadline picker
- [✅] Instructions editor (rich text)
- [✅] Payment integration untuk assignment activation
- [✅] Expected student count input

**Backend Integration:**

- ✅ [`POST /classes/:classId/assignments`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-classesclassidassignments)
- ✅ [`POST /payments/create-transaction`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-paymentscreate-transaction)

#### 7.2 Assignment Monitoring

```
Priority: High
Estimasi: 4 hari
```

**Tasks:**

- [✅] Real-time submission monitoring
- [✅] Bulk grading interface
- [✅] Export submissions
- [✅] Analytics dashboard

**WebSocket Integration:**

- ✅ Event: `submissionListUpdated`
- ✅ Event: `submissionUpdated`

### **Phase 8: Student Writing Experience (Week 11-12)**

#### 8.1 Writing Editor

```
Priority: Critical
Estimasi: 6 hari
```

**Tasks:**

- [✅] Rich text editor integration (React Quill atau TipTap)
- [✅] Real-time auto-save dengan WebSocket
- [✅] Word count & character limits
- [✅] Draft management
- [✅] Citation tools
- [✅] Anti-copy-paste detection

**WebSocket Integration:**

- ✅ Event: `updateContent` untuk auto-save

**Backend Integration:**

- ✅ [`POST /assignments/:assignmentId/submissions`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-assignmentsassignmentidsubmissions)
- ✅ [`PATCH /submissions/:id/content`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#patch-submissionsidcontent)
- ✅ [`POST /submissions/:id/submit`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-submissionsidsubmit)

### **Phase 9: Plagiarism Interface (Week 13)**

#### 9.1 Plagiarism Detection UI

```
Priority: Medium
Estimasi: 4 hari
```

**Tasks:**

- [ ] Plagiarism check trigger interface
- [ ] Progress tracking dengan queue monitoring
- [ ] Report visualization
- [ ] Source highlighting
- [ ] Detailed analysis view

**Backend Integration:**

- ✅ [`POST /submissions/:id/check-plagiarism`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-submissionsidcheck-plagiarism)
- ✅ [`GET /submissions/:id/plagiarism-report`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-submissionsidplagiarism-report)

### **Phase 10: Payment Integration (Week 14)**

#### 10.1 Payment Flow

```
Priority: High
Estimasi: 4 hari
```

**Tasks:**

- [ ] Midtrans integration
- [ ] Payment calculator
- [ ] Transaction history
- [ ] Invoice management
- [ ] Payment status tracking

**Backend Integration:**

- ✅ [`POST /payments/create-transaction`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#post-paymentscreate-transaction)

### **Phase 11: Final Features & Polish (Week 15-16)**

#### 11.1 WebSocket Real-time Features

```
Priority: High
Estimasi: 3 hari
```

**Tasks:**

- [ ] Setup WebSocket client
- [ ] Real-time notifications
- [ ] Live collaboration features
- [ ] Connection status indicator

#### 11.2 File Management

```
Priority: Medium
Estimasi: 2 hari
```

**Tasks:**

- [ ] File upload/download
- [ ] PDF generation client
- [ ] Export functionality

**Backend Integration:**

- ✅ [`GET /submissions/:id/download`](docs/Daftar%20Lengkap%20Endpoint%20API%20Protextify.md#get-submissionsiddownload)

#### 11.3 Mobile Optimization & PWA

```
Priority: Medium
Estimasi: 4 hari
```

**Tasks:**

- [ ] Mobile-responsive design
- [ ] Touch optimizations
- [ ] PWA setup (service worker, manifest)
- [ ] Offline capabilities

### **Phase 12: Testing & Deployment (Week 17)**

#### 12.1 Testing & QA

```
Priority: High
Estimasi: 4 hari
```

**Tasks:**

- [ ] Unit testing setup (Jest + React Testing Library)
- [ ] Integration testing
- [ ] E2E testing dengan Playwright
- [ ] Accessibility testing
- [ ] Performance optimization

#### 12.2 Deployment Preparation

```
Priority: High
Estimasi: 2 hari
```

**Tasks:**

- [ ] Environment configuration
- [ ] Build optimization
- [ ] CDN setup
- [ ] Monitoring setup
- [ ] Documentation

## 🎨 Design System Implementation

### Brand Colors

```css
/* Primary brand color: #23407a */
:root {
  --primary: #23407a;
  --primary-dark: #1a2f5c;
  --primary-light: #3b5fa4;
}
```

### Component Standards

- **Buttons**: Consistent dengan brand color, hover states
- **Forms**: Clean validation, good UX
- **Cards**: Subtle shadows, rounded corners
- **Navigation**: Clear hierarchy, active states

## 📁 Final Project Structure

```
src/
├── components/
│   ├── ui/              # Base UI components
│   ├── forms/           # Form components
│   ├── editor/          # Writing editor components
│   └── layout/          # Layout components
├── pages/
│   ├── auth/            # Authentication pages
│   ├── student/         # Student pages
│   ├── instructor/      # Instructor pages
│   └── public/          # Public pages
├── services/
│   ├── api.js           # API client
│   ├── auth.js          # Auth services
│   ├── classes.js       # Classes services
│   ├── websocket.js     # WebSocket service
│   └── ...
├── contexts/
│   ├── AuthContext.jsx
│   ├── WebSocketContext.jsx
│   └── ThemeContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useWebSocket.js
│   ├── useApi.js
│   └── ...
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validation.js
├── styles/
│   ├── globals.css
│   └── components.css
└── router/
    ├── index.jsx
    └── ProtectedRoute.jsx
```

## ⚡ Environment Variables

```env
# .env.local
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:3000
VITE_APP_NAME=Protextify
```

## 🔧 Development Guidelines

1. **Component Development**: Atomic design principles
2. **State Management**: Context untuk global state, useState untuk local
3. **Error Handling**: Centralized dengan toast notifications
4. **Performance**: Code splitting, lazy loading, memoization
5. **Accessibility**: WCAG 2.1 AA compliance
6. **Testing**: Unit tests untuk utils, integration tests untuk components

Rencana ini memberikan roadmap lengkap untuk membangun frontend Protextify dari awal dengan integrasi backend yang sudah tersedia, menggunakan modern React patterns dan best practices.

File ini telah disesuaikan dengan:

1. **Workspace yang fresh** - dimulai dari setup basic React + Vite
2. **Endpoint API yang tersedia** - mengintegrasikan semua endpoint dari dokumentasi
3. **Task yang detail** - setiap phase memiliki task spesifik dan estimasi waktu
4. **Brand consistency** - mempertahankan warna `#23407a`
5. **Modern React patterns** - menggunakan hooks, context, dan best practices
6. **Scalable architecture** - struktur folder yang terorganisir dan mudah dikembangkan

## 🗂️ Daftar Branch untuk Setiap Phase

| Phase    | Nama Branch                        |
| -------- | ---------------------------------- |
| Phase 1  | `feature/foundation-design-system` |
| Phase 2  | `feature/auth-system`              |
| Phase 3  | `feature/routing-layout`           |
| Phase 4  | `feature/api-integration`          |
| Phase 5  | `feature/student-dashboard`        |
| Phase 6  | `feature/class-management`         |
| Phase 7  | `feature/assignment-system`        |
| Phase 8  | `feature/writing-editor`           |
| Phase 9  | `feature/plagiarism-ui`            |
| Phase 10 | `feature/payment-integration`      |
| Phase 11 | `feature/final-polish-realtime`    |
| Phase 12 | `feature/testing-deployment`       |
