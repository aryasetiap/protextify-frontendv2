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
  Input,
  Textarea,
} from "../../components";
import { assignmentsService, submissionsService } from "../../services";
import { formatDate } from "../../utils/helpers";
import {
  FileText,
  CheckCircle,
  Clock,
  Upload,
  Edit,
  AlertCircle,
  Download,
} from "lucide-react";

export default function AssignmentDetail() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch assignment & submission
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const assignmentData = await assignmentsService.getAssignmentById(
          assignmentId
        );
        setAssignment(assignmentData);

        // Cek apakah sudah ada submission untuk assignment ini
        if (assignmentData?.id) {
          const submissionData =
            await submissionsService.getSubmissionByAssignmentId(
              assignmentData.id
            );
          setSubmission(submissionData);
        }
      } catch (err) {
        setError({
          statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
          message:
            err?.response?.data?.message ||
            err?.message ||
            "Gagal memuat detail assignment",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [assignmentId]);

  // Status assignment
  const getStatusBadge = () => {
    if (!submission) {
      return (
        <Badge color="yellow" className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Belum dikumpulkan
        </Badge>
      );
    }
    if (submission.status === "SUBMITTED") {
      return (
        <Badge color="blue" className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4" />
          Sudah dikumpulkan
        </Badge>
      );
    }
    if (submission.status === "GRADED") {
      return (
        <Badge color="green" className="flex items-center gap-1">
          <CheckCircle className="h-4 w-4" />
          Dinilai
        </Badge>
      );
    }
    return (
      <Badge color="gray" className="flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        Tidak diketahui
      </Badge>
    );
  };

  // File preview
  const filePreview = submission?.fileUrl ? (
    <div className="flex items-center gap-2 mt-2">
      <FileText className="h-5 w-5 text-blue-600" />
      <a
        href={submission.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 underline"
      >
        {submission.fileName || "File Tugas"}
      </a>
      <Button
        size="sm"
        variant="outline"
        onClick={() => window.open(submission.fileUrl, "_blank")}
        className="ml-2"
      >
        <Download className="h-4 w-4 mr-1" />
        Download
      </Button>
    </div>
  ) : (
    <div className="text-gray-500 italic">Belum ada file yang diunggah</div>
  );

  // Feedback
  const feedbackSection =
    submission?.status === "GRADED" ? (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nilai & Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-lg font-bold text-green-700">
              Nilai:{" "}
              {typeof submission.grade === "number" ? submission.grade : "-"}
            </span>
            {submission.feedback && <Badge color="blue">Ada Feedback</Badge>}
          </div>
          <div className="text-gray-700">
            {submission.feedback || "Belum ada feedback dari dosen."}
          </div>
        </CardContent>
      </Card>
    ) : null;

  // Loading/Error state
  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="py-8">
        <Alert variant="error">
          <p>Gagal memuat detail assignment: {error.message}</p>
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
  if (!assignment) {
    return (
      <Container className="py-8">
        <Card>
          <CardContent className="text-center py-16">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Assignment Tidak Ditemukan
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Data assignment tidak tersedia atau Anda tidak memiliki akses.
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Mapping field
  const className = assignment.class?.name || "-";
  const instructorName = assignment.class?.instructor?.fullName || "-";
  const deadline = assignment.deadline
    ? formatDate(assignment.deadline, "dd MMMM yyyy, HH:mm")
    : "-";
  const points = assignment.points || assignment.bobot || 10;
  const description = assignment.instructions || assignment.description || "-";
  const lastSubmitted = submission?.submittedAt
    ? formatDate(submission.submittedAt, "dd MMMM yyyy, HH:mm")
    : "-";

  return (
    <Container className="py-8">
      <Breadcrumb />
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {assignment.title}
          </h1>
          <p className="text-gray-600">
            {className} - {instructorName}
          </p>
        </div>
        <div className="ml-auto">{getStatusBadge()}</div>
      </div>

      {/* Informasi Assignment */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informasi Tugas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-gray-700">{description}</div>
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">Deadline:</span>{" "}
              <span className="font-bold">{deadline}</span>
            </div>
            <div>
              <span className="font-medium">Bobot:</span>{" "}
              <span className="font-bold">{points} poin</span>
            </div>
            {assignment.attachmentUrl && (
              <div>
                <span className="font-medium">Lampiran:</span>{" "}
                <a
                  href={assignment.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline"
                >
                  Download Lampiran
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bagian Pengumpulan */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pengumpulan Tugas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <span className="font-medium">File Tugas:</span>
            {filePreview}
          </div>
          <div className="mb-2">
            <span className="font-medium">Waktu Pengumpulan Terakhir:</span>{" "}
            <span className="text-gray-700">{lastSubmitted}</span>
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              size="lg"
              className="bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() =>
                navigate(`/dashboard/assignments/${assignment.id}/write`)
              }
              aria-label={submission ? "Edit Pengumpulan" : "Upload Tugas"}
            >
              {submission ? (
                <>
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Pengumpulan
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Tugas
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bagian Nilai dan Feedback */}
      {feedbackSection}
    </Container>
  );
}
