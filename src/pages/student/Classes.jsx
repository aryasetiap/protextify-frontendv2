import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Users, FileText, Plus, Calendar, Eye } from "lucide-react";
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
                  Kelas Saya
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Kelola Kelas Anda ✨
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Daftar kelas yang Anda ikuti ({classes?.length || 0} kelas
                aktif). Akses tugas, materi, dan pantau progres belajar Anda.
              </p>
            </div>

            {/* Enhanced Action Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => navigate("/dashboard/join-class")}
                size="lg"
                className="bg-white text-[#23407a] hover:bg-gray-50 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Gabung Kelas Baru
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb - moved after header */}
      <Breadcrumb />

      {/* Classes Grid */}
      {classes && classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {classes.map((classData) => (
            <ClassCard
              key={classData.id}
              classData={classData}
              isNew={location.state?.newClass?.id === classData.id}
            />
          ))}
        </div>
      ) : (
        <Card className="relative overflow-hidden border-0 shadow-lg">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50/30"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#23407a]/10 to-blue-500/10 rounded-full transform translate-x-16 -translate-y-16"></div>

          <CardContent className="relative z-10 text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-[#23407a]/20 to-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-[#23407a]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Belum Ada Kelas
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Mulai perjalanan belajar Anda dengan bergabung ke kelas pertama.
              Dapatkan akses ke materi pembelajaran dan tugas yang menarik.
            </p>
            <Button
              onClick={() => navigate("/dashboard/join-class")}
              size="lg"
              className="bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
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

  // Handle potential undefined values safely dengan data struktur baru
  const studentsCount = 0;
  const assignmentsCount = classData.assignments?.length || 0;
  const activeAssignments =
    classData.assignments?.filter((a) => a?.active).length || 0;
  const joinedDate = classData.enrolledAt || classData.createdAt;

  return (
    <Card
      className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
        isNew ? "ring-2 ring-green-500 bg-green-50/50" : ""
      }`}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#23407a]/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Status indicator for new classes */}
      {isNew && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            Baru Bergabung
          </span>
        </div>
      )}

      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#23407a] transition-colors truncate">
              {classData.name}
            </CardTitle>
            {classData.description && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {classData.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        {/* Instructor Info with enhanced styling */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#23407a] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {classData.instructor?.fullName?.charAt(0) || "I"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {classData.instructor?.fullName || "Loading..."}
              </p>
              <p className="text-xs text-gray-500">Instruktur</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{studentsCount}</p>
            <p className="text-xs text-gray-600 font-medium">Siswa</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-purple-500 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {assignmentsCount}
            </p>
            <p className="text-xs text-gray-600 font-medium">Tugas</p>
          </div>
        </div>

        {/* Active Assignments Indicator */}
        {activeAssignments > 0 && (
          <div className="mb-6 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-orange-800">
                {activeAssignments} tugas aktif menunggu dikerjakan
              </span>
            </div>
          </div>
        )}

        {/* Join Date with enhanced styling */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2 text-[#23407a]" />
          <span>Bergabung sejak {formatDate(joinedDate)}</span>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex space-x-3">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-[#23407a]/30 text-[#23407a] hover:bg-[#23407a] hover:text-white transition-all duration-300"
            onClick={() => navigate(`/dashboard/classes/${classData.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Detail
          </Button>
          <Button
            size="sm"
            className={`flex-1 transition-all duration-300 transform hover:scale-105 ${
              activeAssignments > 0
                ? "bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() =>
              activeAssignments > 0 &&
              navigate(`/dashboard/classes/${classData.id}/assignments`)
            }
            disabled={activeAssignments === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            {activeAssignments > 0
              ? `Tugas (${activeAssignments})`
              : "Belum Ada Tugas"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
