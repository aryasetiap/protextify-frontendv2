/**
 * Mapping utama:
 * - classesService.previewClass(classToken) -> preview kelas (id, name, description, instructor, studentsCount, assignmentsCount, createdAt)
 * - classesService.joinClass(classToken) -> { message, class }
 * - Tidak render data/fitur yang tidak dikirim BE.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Users,
  Search,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  BookOpen,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Alert,
  Breadcrumb,
  LoadingSpinner,
} from "../../components";
import { classesService } from "../../services";
import { joinClassSchema } from "../../utils/validation";
import { formatDate } from "../../utils/helpers";

export default function JoinClass() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
  } = useForm({
    resolver: zodResolver(joinClassSchema),
    defaultValues: {
      classToken: "",
    },
  });

  const tokenValue = watch("classToken");

  // Format token input (uppercase, max 8 chars)
  const handleTokenChange = (e) => {
    // Hapus .toUpperCase()
    const value = e.target.value.trim().slice(0, 8);
    setValue("classToken", value);

    // Clear preview when token changes
    if (previewData) {
      setPreviewData(null);
      setShowPreview(false);
    }
  };

  // Preview class before joining
  const handlePreviewClass = async () => {
    if (!tokenValue || tokenValue.length !== 8) {
      setError("classToken", {
        message: "Token harus 8 karakter",
      });
      return;
    }

    try {
      setPreviewLoading(true);
      const classData = await classesService.previewClass(tokenValue);
      setPreviewData(classData);
      setShowPreview(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setError("classToken", {
          message: "Token kelas tidak ditemukan",
        });
      } else if (error.response?.status === 409) {
        setError("classToken", {
          message: "Anda sudah bergabung di kelas ini",
        });
      } else {
        setError("classToken", {
          message: "Gagal memuat preview kelas",
        });
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  // Join class
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await classesService.joinClass(data.classToken);

      toast.success("Berhasil bergabung ke kelas!");

      // Redirect to class list, highlight new class
      navigate("/dashboard/classes", {
        state: {
          newClass: response.class,
          justJoined: true,
        },
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setError("classToken", {
          message: "Token kelas tidak ditemukan",
        });
      } else if (error.response?.status === 409) {
        setError("classToken", {
          message: "Anda sudah bergabung di kelas ini",
        });
      } else {
        setError("classToken", {
          message: "Gagal bergabung ke kelas",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-8">
      {/* Enhanced Header Section with Gradient Background */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>

        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Gabung Kelas
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Bergabung dengan Kelas Baru ✨
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Masukkan token kelas yang diberikan instruktur untuk mulai
                perjalanan belajar Anda. Preview kelas tersedia sebelum
                bergabung.
              </p>
            </div>

            {/* Back Button with Glass Effect */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali ke Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb - moved after header */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gabung Kelas</h1>
          <p className="text-gray-600">Masukkan token kelas untuk bergabung</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Enhanced Join Form */}
        <Card className="mb-8 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#23407a]/10 to-blue-500/10 rounded-full transform translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-[#23407a]/10 rounded-full transform -translate-x-16 translate-y-16"></div>

          <CardHeader className="relative z-10 pb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#23407a]/10 rounded-2xl">
                <Users className="h-8 w-8 text-[#23407a]" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Masukkan Token Kelas
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Dapatkan token 8 karakter dari instruktur Anda
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Enhanced Token Input */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Token Kelas <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Token Input */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="relative">
                      <Input
                        {...register("classToken")}
                        placeholder="Contoh: ABC12345"
                        value={tokenValue}
                        onChange={handleTokenChange}
                        maxLength={8}
                        className="font-mono text-xl text-center tracking-widest h-14 border-2 border-gray-300 focus:border-[#23407a] transition-all duration-300"
                        error={errors.classToken?.message}
                        aria-label="Token Kelas"
                        autoFocus
                      />
                      <div className="absolute -bottom-6 left-0 right-0">
                        <div className="flex justify-center space-x-1">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-1 rounded-full transition-all duration-200 ${
                                i < tokenValue.length
                                  ? "bg-[#23407a]"
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span>Token terdiri dari 8 karakter huruf dan angka</span>
                    </div>
                  </div>

                  {/* Preview Button */}
                  <div className="flex items-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handlePreviewClass}
                      disabled={
                        !tokenValue || tokenValue.length !== 8 || previewLoading
                      }
                      loading={previewLoading}
                      className="w-full h-14 border-2 border-[#23407a]/30 text-[#23407a] hover:bg-[#23407a] hover:text-white transition-all duration-300 group"
                      aria-label="Preview Kelas"
                    >
                      <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      Preview Kelas
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="order-2 sm:order-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!showPreview || !previewData}
                  size="lg"
                  className="order-1 sm:order-2 bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  aria-label="Gabung Kelas Sekarang"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Gabung Kelas Sekarang
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Class Preview */}
        {showPreview && previewData && <ClassPreview classData={previewData} />}

        {/* Enhanced Info Box */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-500 rounded-2xl shadow-lg flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-3">
                  Panduan Bergabung Kelas
                </h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <p>
                      Dapatkan token kelas (8 karakter) dari instruktur Anda
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <p>
                      Masukkan token dan klik "Preview Kelas" untuk melihat
                      informasi
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <p>
                      Konfirmasi informasi kelas dan klik "Gabung Kelas
                      Sekarang"
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <p>
                      Setelah bergabung, Anda dapat mengerjakan tugas yang
                      tersedia
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

// Class Preview Component
function ClassPreview({ classData }) {
  return (
    <Card className="mb-8 border-0 shadow-2xl relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Success indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600"></div>

      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-500 rounded-2xl shadow-lg">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-green-800 flex items-center">
              Kelas Ditemukan!
            </CardTitle>
            <p className="text-green-700 mt-1">
              Preview informasi kelas sebelum bergabung
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Enhanced Class Info */}
        <div className="bg-white rounded-2xl p-6 border border-green-200/50 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {classData.name}
              </h3>
              {classData.description && (
                <p className="text-gray-600 leading-relaxed mb-4">
                  {classData.description}
                </p>
              )}
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {classData.studentsCount ?? 0}
              </p>
              <p className="text-xs text-gray-600 font-medium">Siswa</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {classData.assignmentsCount ?? 0}
              </p>
              <p className="text-xs text-gray-600 font-medium">Tugas</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <p className="text-xs font-bold text-gray-900">
                {classData.createdAt
                  ? new Date(classData.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric", // tambahkan year agar tahun ikut tampil
                    })
                  : "-"}
              </p>
              <p className="text-xs text-gray-600 font-medium">Dibuat</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl border border-yellow-200/50">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm font-bold text-gray-900 truncate">
                {classData.instructor?.fullName || "Instruktur"}
              </p>
              <p className="text-xs text-gray-600 font-medium">Pengajar</p>
            </div>
          </div>
        </div>

        {/* Enhanced Success Alert */}
        <Alert variant="success" className="border-green-300 bg-green-100">
          <div className="flex items-start space-x-3">
            {/* <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /> */}
            <div>
              <h4 className="font-semibold text-green-800">
                Siap untuk bergabung!
              </h4>
              <p className="text-green-700 text-sm mt-1">
                Kelas ini tersedia dan Anda dapat bergabung sekarang. Klik
                tombol "Gabung Kelas Sekarang" untuk mulai mengikuti kelas dan
                mengakses semua tugas yang tersedia.
              </p>
            </div>
          </div>
        </Alert>
      </CardContent>
    </Card>
  );
}
