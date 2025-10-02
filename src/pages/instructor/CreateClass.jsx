import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, BookOpen, Save, Users, Info } from "lucide-react";
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
  Tooltip,
} from "../../components";
import { classesService } from "../../services";
import { createClassSchema } from "../../utils/validation";

export default function CreateClass() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const nameValue = watch("name");
  const descriptionValue = watch("description");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await classesService.createClass(data);

      toast.success("Kelas berhasil dibuat!");
      navigate(`/instructor/classes/${response.id}`, {
        state: {
          classToken: response.classToken,
          isNewClass: true,
        },
      });
    } catch (error) {
      console.error("Error creating class:", error);
      // Error sudah ditangani oleh api interceptor
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
          onClick={() => navigate("/instructor/classes")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Kelas Baru</h1>
          <p className="text-gray-600">Buat kelas baru untuk siswa Anda</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Informasi Kelas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nama Kelas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kelas *
                  <Tooltip content="Berikan nama yang jelas dan mudah diidentifikasi">
                    <Info className="h-4 w-4 ml-1 inline text-gray-400" />
                  </Tooltip>
                </label>
                <Input
                  {...register("name")}
                  placeholder="Contoh: Kalkulus 1 - Semester Genap 2025"
                  error={errors.name?.message}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">
                    {nameValue?.length || 0}/100 karakter
                  </span>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                  <Tooltip content="Deskripsi opsional untuk memberikan informasi tambahan tentang kelas">
                    <Info className="h-4 w-4 ml-1 inline text-gray-400" />
                  </Tooltip>
                </label>
                <Textarea
                  {...register("description")}
                  placeholder="Deskripsi singkat tentang kelas ini..."
                  rows={4}
                  error={errors.description?.message}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-500">
                    Opsional: Berikan informasi tambahan tentang kelas
                  </span>
                  <span className="text-sm text-gray-500">
                    {descriptionValue?.length || 0}/500 karakter
                  </span>
                </div>
              </div>

              {/* Preview Card */}
              {nameValue && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Preview Kelas
                  </h4>
                  <div className="bg-white rounded border p-3">
                    <h5 className="font-medium text-gray-900">{nameValue}</h5>
                    {descriptionValue && (
                      <p className="text-sm text-gray-600 mt-1">
                        {descriptionValue}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      <span>0 siswa</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <Alert variant="info">
                <div className="text-sm">
                  <strong>Informasi:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      Token kelas akan dibuat otomatis untuk siswa bergabung
                    </li>
                    <li>Anda dapat mengundang siswa setelah kelas dibuat</li>
                    <li>Pengaturan kelas dapat diubah kapan saja</li>
                    <li>Kelas tidak memerlukan pembayaran untuk dibuat</li>
                  </ul>
                </div>
              </Alert>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/instructor/classes")}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="bg-[#23407a] hover:bg-[#1a2f5c]"
            >
              <Save className="h-4 w-4 mr-2" />
              Buat Kelas
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}
