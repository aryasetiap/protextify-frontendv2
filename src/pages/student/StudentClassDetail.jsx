/**
 * Mapping utama:
 * - classesService.getClassById(classId) -> detail kelas
 * - Field kelas: id, name, description, classToken, instructor (fullName), enrollments[], assignments[], currentUserEnrollment (joinedAt), createdAt
 * - assignments: id, title, instructions, deadline, active, createdAt
 * - Tidak render fitur/field yang tidak ada di response BE.
 */

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  FileText,
  ArrowLeft,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

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
  const joinedAt =
    classDetail?.currentUserEnrollment?.joinedAt || classDetail?.createdAt;

  return (
    <Container className="py-8">
      {/* Header Section */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
        <div className="relative px-8 py-10">
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/classes")}
              className="mr-auto mb-4 text-white/80 hover:text-white hover:bg-white/10 w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Kelas
            </Button>
            <div>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Detail Kelas
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                {classDetail?.name}
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-2">
                Instruktur: {classDetail?.instructor?.fullName || "Instruktur"}
              </p>
              <p className="text-white/70 text-base">
                {classDetail?.description || "Tidak ada deskripsi"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Siswa"
          value={studentsCount}
          color="blue"
        />
        <StatCard
          icon={FileText}
          label="Total Tugas"
          value={assignmentsCount}
          color="green"
        />
        <StatCard
          icon={Clock}
          label="Tugas Aktif"
          value={activeAssignments}
          color="yellow"
        />
        <StatCard
          icon={Calendar}
          label="Bergabung Pada"
          value={formatDate(joinedAt, "dd MMM yyyy")}
          color="purple"
        />
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

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Overview Tab Component
function OverviewTab({ classDetail }) {
  const recentAssignments = (classDetail?.assignments || []).slice(0, 3);

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Class Info */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-[#23407a]" />
            <span>Informasi Kelas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow label="Nama Kelas" value={classDetail?.name} />
          <InfoRow
            label="Deskripsi"
            value={classDetail?.description || "Tidak ada deskripsi."}
          />
          <InfoRow
            label="Instruktur"
            value={classDetail?.instructor?.fullName || "Tidak diketahui"}
          />
        </CardContent>
      </Card>

      {/* Recent Assignments */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#23407a]" />
            <span>Tugas Terbaru</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAssignments.length > 0 ? (
            <div className="space-y-3">
              {recentAssignments.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/dashboard/assignments/${assignment.id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {assignment.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Deadline: {formatDate(assignment.deadline)}
                      </p>
                    </div>
                    {assignment.active && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aktif
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-10 w-10 mx-auto mb-3" />
              <p>Belum ada tugas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Assignments Tab Component
function AssignmentsTab({ classDetail }) {
  const assignments = classDetail?.assignments || [];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {assignments.length > 0 ? (
        assignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="border-0 shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 mb-4 sm:mb-0">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {assignment.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1.5 text-red-500" />
                      Deadline: {formatDate(assignment.deadline)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-blue-500" />
                      Status:{" "}
                      {assignment.active ? (
                        <span className="text-green-600 font-medium">
                          Aktif
                        </span>
                      ) : (
                        <span className="text-gray-500 font-medium">
                          Tidak Aktif
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#23407a]/30 text-[#23407a] hover:bg-[#23407a] hover:text-white"
                >
                  <Link to={`/dashboard/assignments/${assignment.id}`}>
                    Lihat Detail
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-16 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada tugas
            </h3>
            <p>
              Tugas akan muncul di sini ketika instruktur membuat tugas baru.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}

// Classmates Tab Component
function ClassmatesTab({ classDetail }) {
  const classmates = classDetail?.enrollments || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <Users className="h-5 w-5 text-[#23407a]" />
              <span>Teman Sekelas</span>
            </span>
            <span className="text-sm font-medium text-gray-600">
              {classmates.length} siswa
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {classmates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classmates.map((enrollment) => (
                <div
                  key={enrollment.student.id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200/80"
                >
                  <div className="w-10 h-10 bg-[#23407a] rounded-full flex items-center justify-center text-white font-medium mr-3">
                    {enrollment.student.fullName?.charAt(0).toUpperCase() ||
                      "?"}
                  </div>
                  <p className="font-medium text-gray-900 truncate">
                    {enrollment.student.fullName || "Tidak diketahui"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum ada teman sekelas
              </h3>
              <p>
                Teman sekelas akan muncul di sini ketika ada siswa lain yang
                bergabung.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Helper component for info rows
function InfoRow({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-2">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <p className="font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
