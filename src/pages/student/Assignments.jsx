/**
 * Mapping utama:
 * - assignmentsService.getRecentAssignments(limit) -> array assignment
 * - Field assignment: id, title, instructions, deadline, classId, class (name), expectedStudentCount, active, createdAt, submissions[], _count.submissions
 * - Hanya assignment yang dikirim BE yang ditampilkan. Tidak render fitur/field yang tidak ada di response.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  LoadingSpinner,
  Alert,
  Breadcrumb,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
} from "../../components";
import { assignmentsService, submissionsService } from "../../services";
import { formatDate } from "../../utils/helpers";
import { FileText, Clock, CheckCircle, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentAssignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("not_submitted");

  // Fetch assignments & submissions
  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assignmentsData, submissionsData] = await Promise.all([
        assignmentsService.getRecentAssignments(10),
        submissionsService.getHistory(),
      ]);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
    } catch (err) {
      setError({
        statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat daftar tugas",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Helper untuk status dan grade
  const getSubmissionInfo = (assignmentId) => {
    const submission = submissions.find((s) => s.assignmentId === assignmentId);
    if (!submission) return { status: "not_submitted", grade: null };
    if (submission.status === "SUBMITTED")
      return { status: "submitted", grade: submission.grade ?? null };
    if (submission.status === "GRADED")
      return { status: "graded", grade: submission.grade ?? null };
    return { status: "draft", grade: null };
  };

  // Filter assignments by tab
  const assignmentsWithStatus = assignments.map((assignment) => {
    const info = getSubmissionInfo(assignment.id);
    return { ...assignment, ...info };
  });

  const notSubmitted = assignmentsWithStatus.filter(
    (a) => a.status === "not_submitted" || a.status === "draft"
  );
  const submitted = assignmentsWithStatus.filter(
    (a) => a.status === "submitted"
  );
  const graded = assignmentsWithStatus.filter((a) => a.status === "graded");

  // Badge status
  const getStatusBadge = (status) => {
    switch (status) {
      case "not_submitted":
        return (
          <Badge color="yellow" className="flex items-center gap-1 w-max">
            <Clock className="h-3 w-3" />
            Belum Dikerjakan
          </Badge>
        );
      case "draft":
        return (
          <Badge color="gray" className="flex items-center gap-1 w-max">
            <Clock className="h-3 w-3" />
            Draft
          </Badge>
        );
      case "submitted":
        return (
          <Badge color="blue" className="flex items-center gap-1 w-max">
            <CheckCircle className="h-3 w-3" />
            Sudah Submit
          </Badge>
        );
      case "graded":
        return (
          <Badge color="green" className="flex items-center gap-1 w-max">
            <Star className="h-3 w-3" />
            Sudah Dinilai
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Container className="py-8">
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
                  Tugas Saya
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Daftar Tugas ✨
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Daftar tugas dari semua kelas yang Anda ikuti. Kerjakan tugas
                aktif sebelum deadline!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Loading/Error State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="error" className="mb-8">
          <p>Gagal memuat daftar tugas: {error.message}</p>
          <Button size="sm" onClick={fetchAssignments} className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="mb-6 flex gap-2 bg-gray-50 rounded-xl p-2 shadow">
            <TabsTrigger
              value="not_submitted"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Belum Dikerjakan
              <span className="ml-2 text-xs bg-gray-200 rounded px-2 py-0.5">
                {notSubmitted.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="submitted" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Sudah Submit
              <span className="ml-2 text-xs bg-gray-200 rounded px-2 py-0.5">
                {submitted.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="graded" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Sudah Dinilai
              <span className="ml-2 text-xs bg-gray-200 rounded px-2 py-0.5">
                {graded.length}
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Belum Dikerjakan */}
          <TabsContent value="not_submitted">
            <AnimatePresence mode="wait">
              <motion.div
                key="not_submitted"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                {notSubmitted.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50/30">
                    <CardContent className="text-center py-16">
                      <FileText className="h-12 w-12 text-[#23407a] mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Tidak ada tugas yang belum dikerjakan
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        Semua tugas sudah Anda kerjakan atau dikumpulkan.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {notSubmitted.map((assignment) => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        statusBadge={getStatusBadge(assignment.status)}
                        submissionGrade={assignment.grade}
                        onKerjakan={() =>
                          navigate(
                            `/dashboard/assignments/${assignment.id}/write`
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* Sudah Submit */}
          <TabsContent value="submitted">
            <AnimatePresence mode="wait">
              <motion.div
                key="submitted"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                {submitted.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50/30">
                    <CardContent className="text-center py-16">
                      <FileText className="h-12 w-12 text-[#23407a] mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Tidak ada tugas yang menunggu penilaian
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        Semua tugas sudah dinilai atau belum dikumpulkan.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {submitted.map((assignment) => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        statusBadge={getStatusBadge(assignment.status)}
                        submissionGrade={assignment.grade}
                        onKerjakan={() =>
                          navigate(
                            `/dashboard/assignments/${assignment.id}/write`
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* Sudah Dinilai */}
          <TabsContent value="graded">
            <AnimatePresence mode="wait">
              <motion.div
                key="graded"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                {graded.length === 0 ? (
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50/30">
                    <CardContent className="text-center py-16">
                      <FileText className="h-12 w-12 text-[#23407a] mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Tidak ada tugas yang sudah dinilai
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                        Tugas yang sudah dinilai akan muncul di sini.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {graded.map((assignment) => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        statusBadge={getStatusBadge(assignment.status)}
                        submissionGrade={assignment.grade}
                        onKerjakan={() =>
                          navigate(
                            `/dashboard/assignments/${assignment.id}/write`
                          )
                        }
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      )}
    </Container>
  );
}

// AssignmentCard Component
function AssignmentCard({
  assignment,
  statusBadge,
  submissionGrade,
  onKerjakan,
}) {
  const navigate = useNavigate();
  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#23407a] transition-colors truncate">
              {assignment.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-1">
              Kelas: {assignment.class?.name || "-"}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Deadline: {formatDate(assignment.deadline)}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Status:{" "}
              {assignment.active ? (
                <span className="text-green-600 font-medium">Aktif</span>
              ) : (
                <span className="text-gray-500 font-medium">Tidak Aktif</span>
              )}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Jumlah Submission: {assignment._count?.submissions || 0}
            </p>
            <div className="mb-2">{statusBadge}</div>
            {typeof submissionGrade === "number" && (
              <p className="text-sm text-gray-600 mb-1">
                Nilai:{" "}
                <span className="font-bold text-green-700">
                  {submissionGrade}
                </span>
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          className="border-[#23407a] text-[#23407a] hover:bg-[#23407a]/10"
          onClick={() => navigate(`/dashboard/assignments/${assignment.id}`)}
          aria-label={`Lihat Detail ${assignment.title}`}
        >
          Lihat Detail
        </Button>
        {assignment.active && (
          <Button
            size="sm"
            className="bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={onKerjakan}
            aria-label={`Kerjakan ${assignment.title}`}
          >
            Kerjakan
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
