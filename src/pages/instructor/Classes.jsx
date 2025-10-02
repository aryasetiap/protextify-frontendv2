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
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.instructor?.fullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

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
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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
    <Container className="py-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Kelas</h1>
          <p className="text-gray-600">Manage kelas dan tugas Anda</p>
        </div>
        <Link to="/instructor/create-class">
          <Button className="bg-[#23407a] hover:bg-[#1a2f5c]">
            <Plus className="h-4 w-4 mr-2" />
            Buat Kelas Baru
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari kelas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Enhanced Filter Status */}
            <div className="w-full lg:w-48">
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="active">Ada Tugas Aktif</option>
                <option value="inactive">Tidak Ada Tugas Aktif</option>
                <option value="has-students">Ada Siswa</option>
                <option value="no-students">Belum Ada Siswa</option>
              </Select>
            </div>

            {/* Enhanced Sort Options */}
            <div className="w-full lg:w-48">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Nama Kelas</option>
                <option value="created">Tanggal Dibuat</option>
                <option value="students">Jumlah Siswa</option>
                <option value="assignments">Jumlah Tugas</option>
                <option value="activity">Aktivitas Terakhir</option>
              </Select>
            </div>

            {/* Sort Order */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Classes List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredAndSortedClasses.length > 0 ? (
        <div className="grid gap-6">
          {filteredAndSortedClasses.map((cls) => (
            <ClassCard key={cls.id} classData={cls} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== "all"
                ? "Tidak ada kelas yang ditemukan"
                : "Belum ada kelas"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Coba ubah filter atau kata kunci pencarian"
                : "Buat kelas pertama Anda untuk memulai"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Link to="/instructor/create-class">
                <Button className="bg-[#23407a] hover:bg-[#1a2f5c]">
                  <Plus className="h-4 w-4 mr-2" />
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {classData.name}
                </h3>
                {classData.description && (
                  <p className="text-gray-600 text-sm">
                    {classData.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {activeAssignments > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {activeAssignments} tugas aktif
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{studentsCount} siswa</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                <span>{assignmentsCount} tugas</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs">
                  Dibuat: {formatDate(classData.createdAt)}
                </span>
              </div>
            </div>

            {/* Class Token */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Token Kelas:
                  </span>
                  <span className="ml-2 font-mono text-sm bg-white px-2 py-1 rounded border">
                    {classData.classToken}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(classData.classToken);
                    toast.success("Token disalin!");
                  }}
                >
                  Salin
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/instructor/classes/${classData.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Lihat Detail
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(`/instructor/classes/${classData.id}/settings`)
            }
          >
            <Settings className="h-4 w-4 mr-2" />
            Pengaturan
          </Button>
          <Link to={`/instructor/classes/${classData.id}/create-assignment`}>
            <Button size="sm" className="bg-[#23407a] hover:bg-[#1a2f5c]">
              <Plus className="h-4 w-4 mr-2" />
              Buat Tugas
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
