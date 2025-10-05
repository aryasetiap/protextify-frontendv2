// src/pages/student/StudentClassDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  FileText,
  ArrowLeft,
  Calendar,
  Clock,
} from "lucide-react";

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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components";
import { classesService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatDate } from "../../utils/helpers";

export default function StudentClassDetail() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: classDetail,
    loading,
    error,
    refetch,
  } = useAsyncData(() => classesService.getClassById(classId), [classId]);

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
          <p>Gagal memuat detail kelas: {error.message}</p>
          <Button onClick={refetch} size="sm" className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  const studentsCount = classDetail?.enrollments?.length || 0;
  const assignmentsCount = classDetail?.assignments?.length || 0;
  const activeAssignments =
    classDetail?.assignments?.filter((a) => a.active).length || 0;

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/classes")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {classDetail?.name}
          </h1>
          <p className="text-gray-600">
            {classDetail?.description || "Tidak ada deskripsi"}
          </p>
        </div>
        <div className="flex space-x-3">
          {activeAssignments > 0 && (
            <Button
              onClick={() =>
                navigate(`/dashboard/classes/${classId}/assignments`)
              }
              className="bg-[#23407a] hover:bg-[#1a2f5c]"
            >
              <FileText className="h-4 w-4 mr-2" />
              Lihat Tugas ({activeAssignments})
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentsCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tugas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignmentsCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tugas Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeAssignments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bergabung</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatDate(classDetail?.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">
            Tugas ({assignmentsCount})
          </TabsTrigger>
          <TabsTrigger value="classmates">
            Teman Sekelas ({studentsCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab classDetail={classDetail} />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentsTab classDetail={classDetail} />
        </TabsContent>

        <TabsContent value="classmates">
          <ClassmatesTab classDetail={classDetail} />
        </TabsContent>
      </Tabs>
    </Container>
  );
}

// Overview Tab Component
function OverviewTab({ classDetail }) {
  const recentAssignments = Array.isArray(classDetail?.assignments)
    ? classDetail.assignments.slice(0, 3)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Class Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Nama Kelas:
              </span>
              <p className="font-medium text-gray-900">{classDetail?.name}</p>
            </div>
            {classDetail?.description && (
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Deskripsi:
                </span>
                <p className="text-gray-700">{classDetail.description}</p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-600">
                Instruktur:
              </span>
              <p className="font-medium text-gray-900">
                {classDetail?.instructor?.fullName || "Tidak diketahui"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">
                Bergabung Sejak:
              </span>
              <p className="font-medium text-gray-900">
                {formatDate(classDetail?.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Tugas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAssignments.length > 0 ? (
            <div className="space-y-3">
              {recentAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {assignment.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Deadline: {formatDate(assignment.deadline)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {assignment.active && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aktif
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada tugas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Assignments Tab Component
function AssignmentsTab({ classDetail }) {
  const assignments = Array.isArray(classDetail?.assignments)
    ? classDetail.assignments
    : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Daftar Tugas</h3>
      </div>

      {assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {assignment.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {assignment.instructions?.substring(0, 100) || ""}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Deadline: {formatDate(assignment.deadline)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {assignment.active ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Tidak Aktif
                      </span>
                    )}
                    {assignment.active && (
                      <Button
                        size="sm"
                        className="bg-[#23407a] hover:bg-[#1a2f5c]"
                      >
                        Mulai Mengerjakan
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada tugas
            </h3>
            <p className="text-gray-600">
              Tugas akan muncul di sini ketika instruktur membuat tugas baru.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Classmates Tab Component
function ClassmatesTab({ classDetail }) {
  const classmates = Array.isArray(classDetail?.enrollments)
    ? classDetail.enrollments
    : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Teman Sekelas</h3>
        <p className="text-sm text-gray-600">
          Total: {classmates.length} siswa
        </p>
      </div>

      {classmates.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="space-y-0">
              {classmates.map((enrollment, index) => (
                <div
                  key={enrollment.student.id || index}
                  className={`flex items-center p-4 ${
                    index !== classmates.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="w-10 h-10 bg-[#23407a] rounded-full flex items-center justify-center text-white font-medium mr-3">
                    {enrollment.student.fullName
                      ? enrollment.student.fullName.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {enrollment.student.fullName || "Tidak diketahui"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {enrollment.student.institution ||
                        "Institusi tidak diketahui"}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Bergabung:{" "}
                    {formatDate(enrollment.createdAt || classDetail.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada teman sekelas
            </h3>
            <p className="text-gray-600">
              Teman sekelas akan muncul di sini ketika ada siswa lain yang
              bergabung.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
