import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { classesService, submissionsService } from "../../services";
import { formatDate } from "../../utils/helpers";
import {
  FileText,
  CheckCircle,
  Clock,
  Eye,
  User,
  ShieldCheck,
} from "lucide-react";

export default function ClassAssignments() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classDetail, setClassDetail] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch class detail & submissions history
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [detail, history] = await Promise.all([
          classesService.getClassById(classId),
          submissionsService.getHistory(),
        ]);
        setClassDetail(detail);
        setSubmissions(history);
      } catch (err) {
        setError({
          statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
          message:
            err?.response?.data?.message ||
            err?.message ||
            "Gagal memuat data kelas",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [classId]);

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
          <p>Gagal memuat data kelas: {error.message}</p>
          <Button
            onClick={() => window.location.reload()}
            size="sm"
            className="mt-3"
          >
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  const assignments = Array.isArray(classDetail?.assignments)
    ? classDetail.assignments
    : [];
  const instructorName = classDetail?.instructor?.fullName || "Instruktur";
  const className = classDetail?.name || "-";
  const classDescription = classDetail?.description || "";
  const memberCount = Array.isArray(classDetail?.enrollments)
    ? classDetail.enrollments.length
    : 0;

  // Helper: get submission for assignment
  function getSubmissionForAssignment(assignmentId) {
    return submissions.find((s) => s.assignmentId === assignmentId);
  }

  // Helper: cek status submission
  function canEditAssignment(assignmentId) {
    const submission = getSubmissionForAssignment(assignmentId);
    if (!submission) return true;
    return submission.status === "DRAFT";
  }

  // Helper: badge status
  function getStatusBadge(status) {
    switch (status) {
      case "DRAFT":
        return <Badge color="gray">Draft</Badge>;
      case "SUBMITTED":
        return <Badge color="blue">Sudah dikumpulkan</Badge>;
      case "GRADED":
        return <Badge color="green">Sudah dinilai</Badge>;
      default:
        return <Badge color="gray">Belum dikumpulkan</Badge>;
    }
  }

  return (
    <Container className="py-8">
      <Breadcrumb />
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
                  Daftar Tugas Kelas
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                {className}
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-2">
                Instruktur: {instructorName}
              </p>
              <p className="text-white/70 text-base mb-2">{classDescription}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-white/80 text-sm flex items-center">
                  <User className="w-4 h-4 mr-1" /> {memberCount} anggota
                </span>
                <span className="text-white/80 text-sm flex items-center">
                  <FileText className="w-4 h-4 mr-1" /> {assignments.length}{" "}
                  tugas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Tugas</CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-[#23407a] mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Belum Ada Tugas
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Tugas akan muncul di sini ketika instruktur membuat tugas baru
                di kelas Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {assignments.map((assignment) => {
                const submission = getSubmissionForAssignment(assignment.id);
                return (
                  <Card
                    key={assignment.id}
                    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/30"
                  >
                    <CardHeader className="relative z-10 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#23407a] transition-colors truncate">
                            {assignment.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mb-1">
                            Deadline: {formatDate(assignment.deadline)}
                          </p>
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusBadge(submission?.status)}
                            {typeof submission?.grade === "number" && (
                              <span className="text-sm text-green-700 font-bold ml-2">
                                Nilai: {submission.grade}
                              </span>
                            )}
                            {typeof submission?.plagiarismScore ===
                              "number" && (
                              <span className="text-sm text-yellow-700 font-bold ml-2 flex items-center">
                                <ShieldCheck className="w-4 h-4 mr-1" />
                                Plagiarisme: {submission.plagiarismScore}%
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Status:{" "}
                            {submission?.status === "SUBMITTED" ? (
                              <span className="text-blue-600 font-medium">
                                Sudah dikumpulkan
                              </span>
                            ) : submission?.status === "GRADED" ? (
                              <span className="text-green-600 font-medium">
                                Sudah dinilai
                              </span>
                            ) : (
                              <span className="text-gray-500 font-medium">
                                Belum dikumpulkan
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 flex justify-end">
                      <Button
                        size="sm"
                        className="bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        onClick={() =>
                          navigate(`/dashboard/assignments/${assignment.id}`)
                        }
                        aria-label={`Lihat Detail ${assignment.title}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </Button>
                      {canEditAssignment(assignment.id) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2"
                          onClick={() =>
                            navigate(
                              `/dashboard/assignments/${assignment.id}/write`
                            )
                          }
                          aria-label={`Kerjakan Tugas ${assignment.title}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Kerjakan Tugas
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2"
                          disabled
                          aria-label={`Tugas sudah dikumpulkan`}
                          title="Tugas sudah dikumpulkan, tidak bisa diedit"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Sudah Dikumpulkan
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
