import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { loginSchema } from "../../utils/validation";
import {
  Button,
  Input,
  Alert,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Container,
} from "../../components";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      clearError();
      await login(data);
      navigate(from, { replace: true });
    } catch (error) {
      // Error handled by AuthContext
      console.error("Login failed:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleDemoCredentials = (role) => {
    if (role === "student") {
      setValue("email", "student@example.com");
      setValue("password", "password123");
    } else {
      setValue("email", "instructor@example.com");
      setValue("password", "password123");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center pb-6">
              <div className="mb-6">
                <img
                  className="mx-auto h-16 w-auto"
                  src="/src/assets/logo-protextify.png"
                  alt="Protextify"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Masuk ke akun Anda
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Silakan masuk untuk mengakses platform Protextify
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="error" title="Login Gagal">
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
                    autoComplete="email"
                    disabled={loading}
                  />

                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    error={errors.password?.message}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    disabled={loading}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
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
                    {loading ? "Memproses..." : "Masuk"}
                  </Button>
                </div>

                {/* Demo Credentials */}
                {import.meta.env.DEV && (
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500 text-center mb-2">
                      Demo Credentials (Development)
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDemoCredentials("student")}
                      >
                        Student Demo
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDemoCredentials("instructor")}
                      >
                        Instructor Demo
                      </Button>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">atau</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Masuk dengan Google
                </Button>

                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Belum punya akun?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-[#23407a] hover:text-[#1a2f5c] transition-colors"
                    >
                      Daftar sekarang
                    </Link>
                  </span>
                </div>

                {/* Forgot Password - Coming Soon */}
                <div className="text-center">
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-gray-700 cursor-not-allowed"
                    disabled
                  >
                    Lupa password? (Segera hadir)
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
