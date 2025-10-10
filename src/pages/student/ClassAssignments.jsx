import { useMemo } from "react";
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
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatDate } from "../../utils/helpers";
import {
  FileText,
  CheckCircle,
  Clock,
  Eye,
  User,
  ShieldCheck,
  ArrowLeft,
  Star,
  Calendar,
  Edit,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ClassAssignments() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useAsyncData(async () => {
    const [classDetail, submissions] = await Promise.all([
      classesService.getClassById(classId),
      submissionsService.getHistory(),
    ]);
    return { classDetail, submissions };
  }, [classId]);

  const { classDetail, submissions } = data || {
    classDetail: null,
    submissions: [],
  };

  const processedAssignments = useMemo(() => {
    if (!classDetail?.assignments) return [];
    return classDetail.assignments.map((assignment) => {
      const submission = submissions.find(
        (s) => s.assignmentId === assignment.id
      );
      return {
        ...assignment,
        submission: submission || null,
      };
    });
  }, [classDetail, submissions]);

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

  const instructorName = classDetail?.instructor?.fullName || "Instruktur";
  const className = classDetail?.name || "-";
  const classDescription = classDetail?.description || "";
  const memberCount = classDetail?.enrollments?.length || 0;

  return (
    <Container className="py-8">
      <Breadcrumb />
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
                  <User className="w-4 h-4 mr-1.5" /> {memberCount} anggota
                </span>
                <span className="text-white/80 text-sm flex items-center">
                  <FileText className="w-4 h-4 mr-1.5" />{" "}
                  {processedAssignments.length} tugas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      {processedAssignments.length === 0 ? (
        <div className="text-center py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-100/30 rounded-2xl shadow-lg border border-gray-200/50">
          <div className="w-24 h-24 bg-white/70 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-md">
            <FileText className="h-12 w-12 text-[#23407a]" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Belum Ada Tugas di Kelas Ini
          </h3>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
            Tugas akan muncul di sini ketika instruktur membuat tugas baru.
            Nantikan informasi selanjutnya!
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {processedAssignments.map((assignment, index) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </Container>
  );
}

// Modernized Assignment Card Component
function AssignmentCard({ assignment, index }) {
  const navigate = useNavigate();
  const { submission } = assignment;
  const canEdit = !submission || submission.status === "DRAFT";

  const getStatusBadge = () => {
    if (!submission) {
      return (
        <Badge color="yellow" className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" /> Belum Dikerjakan
        </Badge>
      );
    }
    switch (submission.status) {
      case "DRAFT":
        return (
          <Badge color="gray" className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> Draft
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge color="blue" className="flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3" /> Menunggu Penilaian
          </Badge>
        );
      case "GRADED":
        return (
          <Badge color="green" className="flex items-center gap-1.5">
            <Star className="h-3 w-3" /> Dinilai: {submission.grade}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50"></div>

        <CardHeader className="relative z-10 border-b border-gray-200/80 bg-white/50 backdrop-blur-sm">
          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#23407a] transition-colors truncate">
            {assignment.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 flex flex-1 flex-col p-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center text-sm text-red-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-medium">
                Deadline: {formatDate(assignment.deadline)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge()}
              {typeof submission?.plagiarismScore === "number" && (
                <Badge
                  color="yellow"
                  variant="outline"
                  className="flex items-center gap-1.5"
                >
                  <ShieldCheck className="h-3 w-3" />
                  {submission.plagiarismScore.toFixed(1)}%
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-200/80 flex gap-3">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400"
              onClick={() =>
                navigate(`/dashboard/assignments/${assignment.id}`)
              }
            >
              <Eye className="h-4 w-4 mr-2" />
              Detail
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-[#23407a] hover:bg-[#1a2f5c] text-white shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
              onClick={() =>
                canEdit &&
                navigate(`/dashboard/assignments/${assignment.id}/write`)
              }
              disabled={!canEdit}
              title={
                !canEdit ? "Tugas sudah dikumpulkan/dinilai" : "Kerjakan Tugas"
              }
            >
              {canEdit ? (
                <Edit className="h-4 w-4 mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {canEdit ? "Kerjakan" : "Terkumpul"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
