import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, GraduationCap } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { registerSchema } from "../../utils/validation";
import { USER_ROLES } from "../../utils/constants";
import {
  Button,
  Input,
  Select,
  Alert,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Container,
} from "../../components";

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      role: "",
      institution: "",
    },
  });

  const watchedRole = watch("role");

  const onSubmit = async (data) => {
    try {
      clearError();
      await registerUser(data);

      // Navigate to email verification page
      navigate("/auth/email-verification", {
        state: { email: data.email, justRegistered: true },
      });
    } catch (error) {
      // Error handled by AuthContext
      console.error("Registration failed:", error);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-12">
        <div className="max-w-lg mx-auto">
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
                Daftar Akun Baru
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Bergabunglah dengan platform Protextify untuk pengalaman
                pembelajaran yang lebih baik
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="error" title="Registrasi Gagal">
                    {error}
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Saya adalah... <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="relative">
                        <input
                          type="radio"
                          value={USER_ROLES.STUDENT}
                          {...register("role")}
                          className="sr-only peer"
                          disabled={loading}
                        />
                        <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-[#23407a] peer-checked:border-[#23407a] peer-checked:bg-[#23407a]/5">
                          <div className="flex flex-col items-center text-center">
                            <User className="h-8 w-8 text-gray-400 peer-checked:text-[#23407a] mb-2" />
                            <span className="font-medium text-gray-900">
                              Siswa
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              Mengerjakan tugas dan mengecek plagiarisme
                            </span>
                          </div>
                        </div>
                      </label>

                      <label className="relative">
                        <input
                          type="radio"
                          value={USER_ROLES.INSTRUCTOR}
                          {...register("role")}
                          className="sr-only peer"
                          disabled={loading}
                        />
                        <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-[#23407a] peer-checked:border-[#23407a] peer-checked:bg-[#23407a]/5">
                          <div className="flex flex-col items-center text-center">
                            <GraduationCap className="h-8 w-8 text-gray-400 peer-checked:text-[#23407a] mb-2" />
                            <span className="font-medium text-gray-900">
                              Pengajar
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              Membuat kelas dan mengelola tugas
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  <Input
                    label="Nama Lengkap"
                    type="text"
                    {...register("fullName")}
                    error={errors.fullName?.message}
                    placeholder="Masukkan nama lengkap"
                    autoComplete="name"
                    disabled={loading}
                    required
                  />

                  <Input
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    disabled={loading}
                    required
                  />

                  <Input
                    label="Institusi"
                    type="text"
                    {...register("institution")}
                    error={errors.institution?.message}
                    placeholder="Nama sekolah/universitas"
                    disabled={loading}
                    required
                  />

                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    error={errors.password?.message}
                    placeholder="Minimal 6 karakter"
                    autoComplete="new-password"
                    disabled={loading}
                    required
                    helperText="Password harus mengandung huruf besar, kecil, dan angka"
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

                {/* Terms & Conditions */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 h-4 w-4 text-[#23407a] border-gray-300 rounded focus:ring-[#23407a]"
                    required
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    Saya setuju dengan{" "}
                    <Link
                      to="/terms"
                      className="text-[#23407a] hover:text-[#1a2f5c]"
                    >
                      Syarat & Ketentuan
                    </Link>{" "}
                    dan{" "}
                    <Link
                      to="/privacy"
                      className="text-[#23407a] hover:text-[#1a2f5c]"
                    >
                      Kebijakan Privasi
                    </Link>
                  </label>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? "Memproses..." : "Daftar Sekarang"}
                  </Button>
                </div>

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
                  onClick={handleGoogleRegister}
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
                  Daftar dengan Google
                </Button>

                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Sudah punya akun?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-[#23407a] hover:text-[#1a2f5c] transition-colors"
                    >
                      Masuk di sini
                    </Link>
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
