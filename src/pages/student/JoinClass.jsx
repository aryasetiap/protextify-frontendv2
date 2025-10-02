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
    const value = e.target.value.toUpperCase().slice(0, 8);
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
      // Get class preview (we'll use getClassById with token validation)
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

      // Redirect to class detail or student classes
      navigate("/dashboard/classes", {
        state: {
          newClass: response.class,
          justJoined: true,
        },
      });
    } catch (error) {
      console.error("Error joining class:", error);

      // Handle specific errors
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
    <Container className="py-6">
      {/* Breadcrumb */}
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

      <div className="max-w-2xl">
        {/* Join Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Token Kelas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Token Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Kelas *
                </label>
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <Input
                      {...register("classToken")}
                      placeholder="Contoh: ABC12345"
                      value={tokenValue}
                      onChange={handleTokenChange}
                      maxLength={8}
                      className="font-mono text-lg text-center tracking-wider"
                      error={errors.classToken?.message}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Masukkan 8 karakter token kelas dari instruktur
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviewClass}
                    disabled={
                      !tokenValue || tokenValue.length !== 8 || previewLoading
                    }
                    loading={previewLoading}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!showPreview || !previewData}
                  className="bg-[#23407a] hover:bg-[#1a2f5c]"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Gabung Kelas
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Class Preview */}
        {showPreview && previewData && <ClassPreview classData={previewData} />}

        {/* Info Box */}
        <Alert variant="info">
          <div className="text-sm">
            <strong>Informasi:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Token kelas terdiri dari 8 karakter huruf dan angka</li>
              <li>Dapatkan token dari instruktur kelas</li>
              <li>Anda dapat melihat preview kelas sebelum bergabung</li>
              <li>
                Setelah bergabung, Anda dapat mengerjakan tugas yang tersedia
              </li>
            </ul>
          </div>
        </Alert>
      </div>
    </Container>
  );
}

// Class Preview Component
function ClassPreview({ classData }) {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Preview Kelas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Class Info */}
          <div className="bg-white rounded-lg p-4 border">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {classData.name}
            </h3>
            {classData.description && (
              <p className="text-gray-600 mb-3">{classData.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Instruktur:</span>
                <p className="font-medium">
                  {classData.instructor?.fullName || "Tidak diketahui"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Jumlah Siswa:</span>
                <p className="font-medium">
                  {classData.enrollments?.length || 0} siswa
                </p>
              </div>
              <div>
                <span className="text-gray-500">Jumlah Tugas:</span>
                <p className="font-medium">
                  {classData.assignments?.length || 0} tugas
                </p>
              </div>
              <div>
                <span className="text-gray-500">Dibuat:</span>
                <p className="font-medium">
                  {new Date(classData.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Assignments */}
          {classData.assignments && classData.assignments.length > 0 && (
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium text-gray-900 mb-3">Tugas Terbaru</h4>
              <div className="space-y-2">
                {classData.assignments.slice(0, 3).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm font-medium">
                      {assignment.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        assignment.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {assignment.active ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Alert variant="success">
            <div className="text-sm">
              <strong>Siap bergabung!</strong> Klik tombol "Gabung Kelas" untuk
              mulai mengikuti kelas ini.
            </div>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
