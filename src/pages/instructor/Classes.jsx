import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  BookOpen,
  Users,
  FileText,
  Eye,
  Settings,
  Filter,
  SortAsc,
  SortDesc,
  Copy, // Add this
} from "lucide-react";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Select,
  Alert,
  LoadingSpinner,
  Breadcrumb,
} from "../../components";
import { classesService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatDate } from "../../utils/helpers";

export default function InstructorClasses() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");

  const {
    data: classes,
    loading,
    error,
    refetch,
  } = useAsyncData(classesService.getClasses, []);

  // Filter dan sort classes
  const filteredAndSortedClasses = useMemo(() => {
    if (!classes) return [];

    let filtered = classes.filter((cls) => {
      const matchesSearch =
        cls.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        cls.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        cls.instructor?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        false;

      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "active" && cls.assignments?.some((a) => a.active)) ||
        (filterStatus === "inactive" &&
          !cls.assignments?.some((a) => a.active)) ||
        (filterStatus === "no-students" &&
          (!cls.enrollments || cls.enrollments.length === 0)) ||
        (filterStatus === "has-students" &&
          cls.enrollments &&
          cls.enrollments.length > 0);

      return matchesSearch && matchesFilter;
    });

    // Enhanced sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = (a.name ?? "").toLowerCase();
          bValue = (b.name ?? "").toLowerCase();
          break;
        case "created":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "students":
          aValue = a.enrollments?.length || 0;
          bValue = b.enrollments?.length || 0;
          break;
        case "assignments":
          aValue = a.assignments?.length || 0;
          bValue = b.assignments?.length || 0;
          break;
        case "activity":
          // Sort by last activity (latest assignment or submission)
          aValue =
            a.assignments?.reduce((latest, assignment) => {
              const assignmentDate = new Date(assignment.createdAt);
              return assignmentDate > latest ? assignmentDate : latest;
            }, new Date(a.createdAt)) || new Date(a.createdAt);
          bValue =
            b.assignments?.reduce((latest, assignment) => {
              const assignmentDate = new Date(assignment.createdAt);
              return assignmentDate > latest ? assignmentDate : latest;
            }, new Date(b.createdAt)) || new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date) {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [classes, searchTerm, sortBy, sortOrder, filterStatus]);

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
                  Kelola Kelas
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Management Kelas 👨‍🏫
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Kelola semua kelas Anda dengan mudah.
                {filteredAndSortedClasses?.length > 0
                  ? ` Anda memiliki ${filteredAndSortedClasses.length} kelas aktif.`
                  : " Mulai dengan membuat kelas pertama Anda."}
              </p>
            </div>

            {/* Enhanced Action Button */}
            <div className="flex items-center space-x-3">
              <Link to="/instructor/create-class">
                <Button
                  size="lg"
                  className="bg-white text-[#23407a] hover:bg-gray-50 shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Buat Kelas Baru
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb - moved after header */}
      <Breadcrumb />

      {/* Enhanced Filters & Search */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-[#23407a] to-[#3b5fa4] rounded-full mr-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">
            Filter & Pencarian
          </h2>
        </div>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Enhanced Search */}
              <div className="lg:col-span-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Cari nama kelas, deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-2 border-gray-300 focus:border-[#23407a] rounded-xl"
                  />
                </div>
              </div>

              {/* Enhanced Filter Status */}
              <div className="lg:col-span-3">
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-12 border-2 border-gray-300 focus:border-[#23407a] rounded-xl"
                >
                  <option value="all">📚 Semua Status</option>
                  <option value="active">✅ Ada Tugas Aktif</option>
                  <option value="inactive">⏸️ Tidak Ada Tugas Aktif</option>
                  <option value="has-students">👥 Ada Siswa</option>
                  <option value="no-students">🆕 Belum Ada Siswa</option>
                </Select>
              </div>

              {/* Enhanced Sort Options */}
              <div className="lg:col-span-3">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-12 border-2 border-gray-300 focus:border-[#23407a] rounded-xl"
                >
                  <option value="name">📝 Nama Kelas</option>
                  <option value="created">📅 Tanggal Dibuat</option>
                  <option value="students">👥 Jumlah Siswa</option>
                  <option value="assignments">📋 Jumlah Tugas</option>
                  <option value="activity">⚡ Aktivitas Terakhir</option>
                </Select>
              </div>

              {/* Enhanced Sort Order */}
              <div className="lg:col-span-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="w-full h-12 border-2 border-gray-300 hover:border-[#23407a] hover:bg-[#23407a] hover:text-white rounded-xl transition-all duration-300"
                >
                  {sortOrder === "asc" ? (
                    <>
                      <SortAsc className="h-5 w-5 mr-2" />
                      A-Z
                    </>
                  ) : (
                    <>
                      <SortDesc className="h-5 w-5 mr-2" />
                      Z-A
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Filter Summary */}
            {(searchTerm || filterStatus !== "all") && (
              <div className="mt-4 flex items-center space-x-3">
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#23407a]/10 text-[#23407a]">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filterStatus !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Status: {filterStatus}
                    <button
                      onClick={() => setFilterStatus("all")}
                      className="ml-2 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Classes List */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg mb-6 w-3/4"></div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div
                        key={j}
                        className="text-center p-4 bg-gray-100 rounded-xl"
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-16 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedClasses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredAndSortedClasses.map((cls) => (
            <ClassCard key={cls.id} classData={cls} />
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
              {searchTerm || filterStatus !== "all"
                ? "Tidak ada kelas yang ditemukan"
                : "Belum Ada Kelas"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              {searchTerm || filterStatus !== "all"
                ? "Coba ubah filter atau kata kunci pencarian untuk menemukan kelas yang Anda cari."
                : "Mulai perjalanan mengajar Anda dengan membuat kelas pertama. Undang siswa dan kelola tugas dengan mudah."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Link to="/instructor/create-class">
                <Button
                  size="lg"
                  className="bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Buat Kelas Pertama
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

// Class Card Component
function ClassCard({ classData }) {
  const navigate = useNavigate();
  const studentsCount = classData.enrollments?.length || 0;
  const assignmentsCount = classData.assignments?.length || 0;
  const activeAssignments =
    classData.assignments?.filter((a) => a.active).length || 0;

  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#23407a]/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Status indicators */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        {activeAssignments > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            {activeAssignments} Tugas Aktif
          </span>
        )}
        {studentsCount === 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            Belum Ada Siswa
          </span>
        )}
      </div>

      <CardContent className="relative z-10 p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#23407a] transition-colors truncate">
                {classData.name}
              </h3>
              {classData.description && (
                <p className="text-gray-600 line-clamp-3 leading-relaxed">
                  {classData.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Users className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{studentsCount}</p>
            <p className="text-xs text-gray-600 font-medium">Siswa</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/50">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {assignmentsCount}
            </p>
            <p className="text-xs text-gray-600 font-medium">Total Tugas</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/50">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-bold text-gray-900">
              {new Date(classData.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
              })}
            </p>
            <p className="text-xs text-gray-600 font-medium">Dibuat</p>
          </div>
        </div>

        {/* Enhanced Class Token Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Token Kelas:
              </p>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-lg font-bold bg-white px-4 py-2 rounded-lg border-2 border-gray-200 tracking-wider">
                  {classData.classToken}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(classData.classToken);
                    toast.success("Token disalin ke clipboard!");
                  }}
                  className="border-[#23407a]/30 text-[#23407a] hover:bg-[#23407a] hover:text-white transition-all duration-300"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Salin
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/instructor/classes/${classData.id}`)}
            className="border-[#23407a]/30 text-[#23407a] hover:bg-[#23407a] hover:text-white transition-all duration-300"
          >
            <Eye className="h-4 w-4 mr-2" />
            Detail
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/instructor/classes/${classData.id}/settings`)
            }
            className="border-gray-300 text-gray-600 hover:bg-gray-600 hover:text-white transition-all duration-300"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>

          <Link
            to={`/instructor/classes/${classData.id}/create-assignment`}
            className="lg:col-span-1 col-span-2"
          >
            <Button
              size="sm"
              className="w-full bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Tugas
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
