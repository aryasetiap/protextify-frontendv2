/**
 * Mapping utama:
 * - usersService.getCurrentUser() -> profil user (id, email, fullName, institution, role, emailVerified, createdAt, updatedAt)
 * - usersService.updateProfile({ fullName?, institution? }) -> profil user terbaru
 * - Tidak render data/fitur yang tidak dikirim BE.
 */

import React, { useState } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Alert,
  LoadingSpinner,
  Breadcrumb,
} from "../../components";
import { usersService, authService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useApi } from "../../hooks/useApi";
import { updateProfileSchema, resetPasswordSchema } from "../../utils/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  GraduationCap,
  ShieldCheck,
  Edit2,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

export default function StudentProfile() {
  const {
    data: user,
    loading,
    error,
    refetch,
  } = useAsyncData(() => usersService.getCurrentUser(), []);

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: "",
      institution: "",
      phone: "",
    },
  });

  const { loading: saving, error: saveError, execute: saveProfile } = useApi();

  // Reset password form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
    reset: resetResetForm,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: "", newPassword: "" },
  });
  const { loading: resetting, error: resetError, execute: doReset } = useApi();
  const { loading: sendingLink, execute: doSendLink } = useApi();

  // Sync form with user data
  React.useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        institution: user.institution || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  // Handle save
  const onSave = async (data) => {
    try {
      await saveProfile(() => usersService.updateProfile(data), {
        loadingMessage: "Menyimpan perubahan...",
        successMessage: "Profil berhasil diperbarui",
        showSuccessToast: true,
      });
      toast.success("Profil berhasil diperbarui");
      setIsEditing(false);
      refetch();
    } catch (err) {
      // Error toast sudah ditangani oleh useApi
    }
  };

  // Avatar (initial)
  const avatar = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <Container className="py-8">
      {/* Header Section */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Profil Saya
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Profil Akun Student
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Lihat dan perbarui data profil Anda. Pastikan data sesuai agar
                proses belajar berjalan lancar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Loading/Error State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="error" className="mb-8">
          <p>Gagal memuat data profil: {error.message}</p>
          <Button size="sm" onClick={refetch} className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden mb-8">
            <CardHeader className="relative z-10 pb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#23407a] to-[#3b5fa4] text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                  {avatar}
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {user?.fullName || "-"}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {user?.role === "STUDENT" ? "Siswa" : user?.role}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-8">
              <form onSubmit={handleSubmit(onSave)} className="space-y-6">
                {/* Email (readonly) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <Input
                      value={user?.email || ""}
                      readOnly
                      disabled
                      className="bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <Input
                      {...register("fullName")}
                      disabled={!isEditing}
                      placeholder="Nama lengkap"
                      error={errors.fullName?.message}
                      className={isEditing ? "" : "bg-gray-100 text-gray-600"}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Institution */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Institusi <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                    <Input
                      {...register("institution")}
                      disabled={!isEditing}
                      placeholder="Nama institusi"
                      error={errors.institution?.message}
                      className={isEditing ? "" : "bg-gray-100 text-gray-600"}
                    />
                  </div>
                  {errors.institution && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.institution.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Nomor Telepon
                  </label>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <Input
                      {...register("phone")}
                      disabled={!isEditing}
                      placeholder="Contoh: 081234567890"
                      error={errors.phone?.message}
                      className={isEditing ? "" : "bg-gray-100 text-gray-600"}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Email Verified */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Status Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <ShieldCheck
                      className={`h-5 w-5 ${
                        user?.emailVerified
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        user?.emailVerified
                          ? "text-green-700"
                          : "text-yellow-700"
                      }`}
                    >
                      {user?.emailVerified
                        ? "Terverifikasi"
                        : "Belum diverifikasi"}
                    </span>
                  </div>
                </div>

                {/* Created/Updated At */}
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Dibuat:</span>
                    <span className="ml-2">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleString("id-ID")
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Terakhir Update:</span>
                    <span className="ml-2">
                      {user?.updatedAt
                        ? new Date(user.updatedAt).toLocaleString("id-ID")
                        : "-"}
                    </span>
                  </div>
                </div>

                {/* Error Alert */}
                {saveError && (
                  <Alert variant="error" className="mb-4">
                    <p>{saveError.message}</p>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={() => {
                          setIsEditing(false);
                          reset({
                            fullName: user?.fullName || "",
                            institution: user?.institution || "",
                            phone: user?.phone || "",
                          });
                        }}
                        disabled={saving}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        loading={saving}
                        disabled={!isDirty || saving}
                        size="lg"
                        className="bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        aria-label="Simpan Perubahan"
                      >
                        <Save className="h-5 w-5 mr-2" />
                        Simpan Perubahan
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setIsEditing(true)}
                      className="border-2 border-[#23407a]/30 text-[#23407a] hover:bg-[#23407a] hover:text-white transition-all duration-300"
                      aria-label="Edit Profil"
                    >
                      <Edit2 className="h-5 w-5 mr-2" />
                      Edit Profil
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Management */}
          <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="text-xl font-bold text-gray-900">
                Keamanan & Kata Sandi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Send reset link */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 font-medium">Kirim tautan reset ke email</p>
                  <p className="text-xs text-gray-500">Kami akan mengirimkan email ke {user?.email}</p>
                </div>
                <Button
                  type="button"
                  loading={sendingLink}
                  onClick={() =>
                    doSendLink(() => authService.forgotPassword(user.email), {
                      loadingMessage: "Mengirim tautan reset...",
                      successMessage: "Tautan reset terkirim ke email",
                      showSuccessToast: true,
                    })
                  }
                  className="bg-[#23407a] hover:bg-[#1a2f5c]"
                >
                  Kirim Link Reset
                </Button>
              </div>

              {/* Divider */}
              {/* <div className="h-px bg-gray-200" /> */}

              {/* Reset with token */}
              <form
                onSubmit={handleSubmitReset(async (payload) => {
                  try {
                    await doReset(() => authService.resetPassword(payload), {
                      loadingMessage: "Mereset password...",
                      successMessage: "Password berhasil direset",
                      showSuccessToast: true,
                    });
                    resetResetForm();
                  } catch (e) {}
                })}
                className="space-y-4"
              >
                {/* <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Token Reset
                  </label>
                  <Input
                    {...registerReset("token")}
                    placeholder="Tempel token dari email"
                    error={resetErrors.token?.message}
                  />
                </div> */}
                {/* <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Password Baru
                  </label>
                  <Input
                    type="password"
                    {...registerReset("newPassword")}
                    placeholder="Password baru"
                    error={resetErrors.newPassword?.message}
                  />
                </div> */}
                {resetError && (
                  <Alert variant="error">
                    <p>{resetError.message}</p>
                  </Alert>
                )}
                {/* <div className="flex justify-end">
                  <Button type="submit" loading={resetting} className="bg-[#23407a] hover:bg-[#1a2f5c]">
                    Reset Password
                  </Button>
                </div> */}
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </Container>
  );
}
