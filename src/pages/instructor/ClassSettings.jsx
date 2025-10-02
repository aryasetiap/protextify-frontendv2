// src/pages/instructor/ClassSettings.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Settings,
  Save,
  Trash2,
  AlertTriangle,
  Copy,
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
  Textarea,
  Alert,
  Breadcrumb,
  Modal,
  LoadingSpinner,
} from "../../components";
import { classesService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { updateClassSchema } from "../../utils/validation";

export default function ClassSettings() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    data: classDetail,
    loading: fetchLoading,
    error,
    refetch,
  } = useAsyncData(() => classesService.getClassById(classId), [classId]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(updateClassSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Reset form when data loads
  React.useEffect(() => {
    if (classDetail) {
      reset({
        name: classDetail.name,
        description: classDetail.description || "",
      });
    }
  }, [classDetail, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await classesService.updateClass(classId, data);
      toast.success("Pengaturan kelas berhasil diperbarui!");
      refetch();
    } catch (error) {
      console.error("Error updating class:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async () => {
    try {
      setDeleteLoading(true);
      await classesService.deleteClass(classId);
      toast.success("Kelas berhasil dihapus!");
      navigate("/instructor/classes");
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Gagal menghapus kelas");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const regenerateToken = async () => {
    try {
      const response = await classesService.regenerateClassToken(classId);
      toast.success("Token kelas berhasil diperbarui!");
      refetch();
    } catch (error) {
      console.error("Error regenerating token:", error);
    }
  };

  const copyClassToken = () => {
    navigator.clipboard.writeText(classDetail?.classToken);
    toast.success("Token kelas disalin!");
  };

  if (fetchLoading) {
    return (
      <Container className="py-6">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-6">
        <Alert variant="error">
          <p>Gagal memuat pengaturan kelas: {error.message}</p>
          <Button onClick={refetch} size="sm" className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/instructor/classes/${classId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Kelas</h1>
          <p className="text-gray-600">{classDetail?.name}</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Informasi Dasar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kelas *
                </label>
                <Input
                  {...register("name")}
                  placeholder="Nama kelas"
                  error={errors.name?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <Textarea
                  {...register("description")}
                  placeholder="Deskripsi kelas..."
                  rows={3}
                  error={errors.description?.message}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!isDirty}
                  className="bg-[#23407a] hover:bg-[#1a2f5c]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Class Token Management */}
        <Card>
          <CardHeader>
            <CardTitle>Token Kelas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="font-mono text-lg font-bold bg-white px-3 py-2 rounded border flex-1">
                {classDetail?.classToken}
              </span>
              <Button size="sm" variant="outline" onClick={copyClassToken}>
                <Copy className="h-4 w-4 mr-2" />
                Salin
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Regenerate token jika token lama sudah tidak aman
                </p>
              </div>
              <Button variant="outline" onClick={regenerateToken}>
                Regenerate Token
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Class Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistik Kelas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {classDetail?.enrollments?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Total Siswa</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {classDetail?.assignments?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Total Tugas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="error">
                <div className="text-sm">
                  <strong>Peringatan:</strong> Menghapus kelas akan menghapus
                  semua data termasuk tugas, submission, dan anggota kelas.
                  Tindakan ini tidak dapat dibatalkan.
                </div>
              </Alert>

              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Kelas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Konfirmasi Hapus Kelas"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus kelas "{classDetail?.name}"?
          </p>

          <Alert variant="error">
            <div className="text-sm">
              <strong>Data yang akan dihapus:</strong>
              <ul className="list-disc list-inside mt-2">
                <li>{classDetail?.enrollments?.length || 0} anggota kelas</li>
                <li>{classDetail?.assignments?.length || 0} tugas</li>
                <li>Semua submission dan laporan plagiarisme</li>
              </ul>
            </div>
          </Alert>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteLoading}
            >
              Batal
            </Button>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={handleDeleteClass}
              loading={deleteLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Ya, Hapus Kelas
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}
