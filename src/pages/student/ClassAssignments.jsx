import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Clock,
  ArrowLeft,
  Calendar,
  CheckCircle,
  AlertCircle,
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
  Badge,
} from "../../components";
import { classesService, assignmentsService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatDate } from "../../utils/helpers";

export default function ClassAssignments() {
  const { classId } = useParams();
  const navigate = useNavigate();

  // Fetch class detail untuk header info
  const { data: classDetail, loading: classLoading } = useAsyncData(
    () => classesService.getClassById(classId),
    [classId]
  );

  // Fetch assignments untuk kelas ini
  const {
    data: assignments,
    loading: assignmentsLoading,
    error,
    refetch,
  } = useAsyncData(
    () => assignmentsService.getClassAssignments(classId),
    [classId]
  );

  const loading = classLoading || assignmentsLoading;

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
          <AlertCircle className="h-4 w-4" />
          <div>
            <strong>Gagal memuat tugas</strong>
            <p>{error.message}</p>
          </div>
          <Button onClick={refetch} size="sm" className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  const safeAssignments = Array.isArray(assignments) ? assignments : [];
  const activeAssignments = safeAssignments.filter((a) => a.active);
  const inactiveAssignments = safeAssignments.filter((a) => !a.active);

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
          Kembali ke Kelas
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Tugas - {classDetail?.name}
          </h1>
          <p className="text-gray-600">
            {safeAssignments.length} tugas tersedia
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tugas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {safeAssignments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tugas Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeAssignments.length}
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
                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inactiveAssignments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Assignments */}
      {activeAssignments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tugas Aktif
          </h2>
          <div className="space-y-4">
            {activeAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                classId={classId}
                isActive={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Assignments */}
      {inactiveAssignments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tugas Belum Aktif
          </h2>
          <div className="space-y-4">
            {inactiveAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                classId={classId}
                isActive={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {safeAssignments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Tugas
            </h3>
            <p className="text-gray-600 mb-6">
              Instruktur belum membuat tugas untuk kelas ini.
            </p>
            <Link to={`/dashboard/classes/${classId}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Detail Kelas
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

// Assignment Card Component
function AssignmentCard({ assignment, classId, isActive }) {
  const navigate = useNavigate();

  const getStatusInfo = () => {
    if (!isActive) {
      return {
        label: "Belum Aktif",
        color: "bg-gray-100 text-gray-800",
        description: "Menunggu pembayaran instruktur",
      };
    }

    const now = new Date();
    const deadline = new Date(assignment.deadline);

    if (deadline < now) {
      return {
        label: "Terlewat",
        color: "bg-red-100 text-red-800",
        description: "Deadline sudah terlewat",
      };
    }

    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3) {
      return {
        label: "Segera Berakhir",
        color: "bg-orange-100 text-orange-800",
        description: `${daysLeft} hari lagi`,
      };
    }

    return {
      label: "Aktif",
      color: "bg-green-100 text-green-800",
      description: "Dapat dikerjakan",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {assignment.title}
              </h3>
              <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
            </div>
            <p className="text-gray-600 mb-3">
              {assignment.instructions?.substring(0, 150)}
              {assignment.instructions?.length > 150 && "..."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Deadline: {formatDate(assignment.deadline)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{statusInfo.description}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            {isActive && (
              <Button
                size="sm"
                onClick={() =>
                  navigate(`/dashboard/assignments/${assignment.id}/write`)
                }
                className="bg-[#23407a] hover:bg-[#1a2f5c]"
              >
                <FileText className="h-4 w-4 mr-2" />
                Kerjakan
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Navigate to assignment detail (if exists)
                console.log("View assignment detail:", assignment.id);
              }}
            >
              Detail
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
