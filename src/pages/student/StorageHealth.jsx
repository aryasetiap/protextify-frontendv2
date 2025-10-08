/**
 * Mapping utama:
 * - usersService.getStorageUsage() -> { totalUsed, limit, percentage, files[] }
 * - Tidak render data/fitur yang tidak dikirim BE.
 * - Endpoint opsional: GET /users/storage
 */

import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Alert,
  LoadingSpinner,
  Breadcrumb,
} from "../../components";
import { usersService } from "../../services";
import { FileText, BarChart3, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

// ProgressBar component (gunakan yang sudah ada, fallback jika tidak ada)
function ProgressBar({ value, max, color = "blue" }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  const colorClass =
    color === "blue"
      ? "bg-blue-500"
      : color === "green"
      ? "bg-green-500"
      : color === "red"
      ? "bg-red-500"
      : "bg-gray-400";
  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className={`${colorClass} h-4 rounded-full transition-all duration-500`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export default function StorageHealth() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch storage usage
  const fetchStorage = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!usersService.getStorageUsage) {
        throw new Error("Fitur storage usage belum tersedia di BE");
      }
      const result = await usersService.getStorageUsage();
      setData(result);
    } catch (err) {
      setError({
        statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat data storage",
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorage();
  }, []);

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
                  Storage Health
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Status Storage Akun
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Pantau penggunaan storage file Anda. Pastikan file tugas dan
                lampiran tidak melebihi batas yang ditentukan.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-10 w-10 text-white opacity-80" />
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
          <p>Gagal memuat data storage: {error.message}</p>
          <Button size="sm" onClick={fetchStorage} className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      ) : !data ? (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50/30">
          <CardContent className="text-center py-16">
            <FileText className="h-12 w-12 text-[#23407a] mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Data Storage Tidak Tersedia
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Fitur monitoring storage belum aktif untuk akun Anda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden mb-8">
            <CardHeader className="relative z-10 pb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#23407a] to-[#3b5fa4] text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Penggunaan Storage
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {data.totalUsed} MB dari {data.limit} MB
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Persentase Penggunaan
                </label>
                <ProgressBar
                  value={data.totalUsed}
                  max={data.limit}
                  color={
                    data.percentage >= 90
                      ? "red"
                      : data.percentage >= 70
                      ? "yellow"
                      : "blue"
                  }
                />
                <div className="mt-2 text-sm text-gray-600">
                  {data.percentage}% digunakan
                </div>
                {data.percentage >= 90 && (
                  <Alert variant="warning" className="mt-4">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>
                      Storage Anda hampir penuh. Hapus file yang tidak
                      diperlukan untuk menghindari masalah upload.
                    </span>
                  </Alert>
                )}
              </div>

              {/* File List */}
              {Array.isArray(data.files) && data.files.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    File Terbaru
                  </label>
                  <div className="space-y-2">
                    {data.files.slice(0, 5).map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-[#23407a]" />
                          <span className="font-medium text-gray-900 truncate">
                            {file.filename}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round((file.size / 1024 / 1024) * 100) / 100} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Container>
  );
}
