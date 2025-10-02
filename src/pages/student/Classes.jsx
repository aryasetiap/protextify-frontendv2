import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Users, FileText, Plus, Calendar } from "lucide-react";
import toast from "react-hot-toast";

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
import { classesService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatDate } from "../../utils/helpers";

export default function StudentClasses() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: classes,
    loading,
    error,
    refetch,
  } = useAsyncData(() => classesService.getClasses(), []);

  // Handle success message from join class
  useEffect(() => {
    if (location.state?.justJoined) {
      toast.success("Selamat! Anda berhasil bergabung ke kelas baru.");
      // Clear the state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  if (loading) {
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
          <p>Gagal memuat daftar kelas: {error.message}</p>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelas Saya</h1>
          <p className="text-gray-600">
            Daftar kelas yang Anda ikuti ({classes?.length || 0} kelas)
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/join-class")}
          className="bg-[#23407a] hover:bg-[#1a2f5c]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Gabung Kelas
        </Button>
      </div>

      {/* Classes Grid */}
      {classes && classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classData) => (
            <ClassCard
              key={classData.id}
              classData={classData}
              isNew={location.state?.newClass?.id === classData.id}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada kelas
            </h3>
            <p className="text-gray-600 mb-6">
              Gabung kelas pertama Anda untuk mulai belajar
            </p>
            <Button
              onClick={() => navigate("/dashboard/join-class")}
              className="bg-[#23407a] hover:bg-[#1a2f5c]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Gabung Kelas Pertama
            </Button>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

// Class Card Component
function ClassCard({ classData, isNew = false }) {
  const navigate = useNavigate();

  const studentsCount = classData.enrollments?.length || 0;
  const assignmentsCount = classData.assignments?.length || 0;
  const activeAssignments =
    classData.assignments?.filter((a) => a.active).length || 0;

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg ${
        isNew ? "ring-2 ring-green-500 bg-green-50" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {classData.name}
              {isNew && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Baru
                </span>
              )}
            </CardTitle>
            {classData.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {classData.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Instructor Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Instruktur:</span>{" "}
            {classData.instructor?.fullName || "Tidak diketahui"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {studentsCount}
            </p>
            <p className="text-xs text-gray-600">Siswa</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <FileText className="h-4 w-4 text-gray-600" />
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {assignmentsCount}
            </p>
            <p className="text-xs text-gray-600">Tugas</p>
          </div>
        </div>

        {/* Active Assignments */}
        {activeAssignments > 0 && (
          <div className="mb-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              {activeAssignments} tugas aktif
            </span>
          </div>
        )}

        {/* Class Info */}
        <div className="text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Bergabung: {formatDate(classData.enrolledAt || classData.createdAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => navigate(`/dashboard/classes/${classData.id}`)}
          >
            Lihat Detail
          </Button>
          {activeAssignments > 0 && (
            <Button
              size="sm"
              className="flex-1 bg-[#23407a] hover:bg-[#1a2f5c]"
              onClick={() =>
                navigate(`/dashboard/classes/${classData.id}/assignments`)
              }
            >
              Lihat Tugas
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
