/**
 * Mapping utama:
 * - submissionsService.getSubmissionById(submissionId) -> detail submission
 * - submissionsService.downloadSubmission(submissionId, format) -> { filename, url, size }
 * - plagiarismService.getPlagiarismReport(submissionId) -> report (jika tersedia)
 * - Tidak render data/fitur yang tidak dikirim BE.
 */

import { useState } from "react";
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
} from "../../components";
import { submissionsService, plagiarismService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/helpers";

export default function SubmissionDetail() {
  const { id: submissionId } = useParams();
  const navigate = useNavigate();

  const {
    data: submission,
    loading,
    error,
    refetch,
  } = useAsyncData(
    () => submissionsService.getSubmissionById(submissionId),
    [submissionId]
  );

  const [downloading, setDownloading] = useState(false);
  const [plagiarismLoading, setPlagiarismLoading] = useState(false);
  const [plagiarismReport, setPlagiarismReport] = useState(null);

  // Download file handler
  const handleDownload = async (format = "pdf") => {
    setDownloading(true);
    try {
      const result = await submissionsService.downloadSubmission(
        submissionId,
        format
      );
      if (result.url) {
        window.open(result.url, "_blank");
        toast.success(`File ${format.toUpperCase()} berhasil diunduh`);
      } else {
        toast.error("URL file tidak tersedia");
      }
    } catch (err) {
      toast.error("Gagal mengunduh file");
    } finally {
      setDownloading(false);
    }
  };

  // Fetch plagiarism report
  const handleViewPlagiarismReport = async () => {
    setPlagiarismLoading(true);
    try {
      const report = await plagiarismService.getPlagiarismReport(submissionId);
      setPlagiarismReport(report);
      if (report?.pdfReportUrl) {
        window.open(report.pdfReportUrl, "_blank");
      } else {
        toast.error("Laporan PDF tidak tersedia");
      }
    } catch (err) {
      toast.error("Gagal memuat laporan plagiarisme");
    } finally {
      setPlagiarismLoading(false);
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Dikumpulkan
          </span>
        );
      case "GRADED":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Dinilai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            Tidak diketahui
          </span>
        );
    }
  };

  // Plagiarism badge
  const getPlagiarismBadge = (score) => {
    if (typeof score !== "number") return null;
    let color = "bg-gray-100 text-gray-700";
    if (score >= 30) color = "bg-red-100 text-red-700";
    else if (score >= 10) color = "bg-yellow-100 text-yellow-700";
    else color = "bg-green-100 text-green-700";
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}
        title="Skor plagiarisme"
      >
        Plagiarisme: {score}%
      </span>
    );
  };

  // Loading state
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
          <p>Gagal memuat detail submission: {error.message}</p>
          <Button onClick={refetch} size="sm" className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!submission) {
    return (
      <Container className="py-6">
        <Card>
          <CardContent className="text-center py-16">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Submission Tidak Ditemukan
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Data submission tidak tersedia atau Anda tidak memiliki akses.
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Mapping field
  const assignmentTitle = submission.assignment?.title || "-";
  const className = submission.assignment?.class?.name || "-";
  const submittedAt = submission.submittedAt
    ? formatDate(submission.submittedAt)
    : "-";
  const updatedAt = submission.updatedAt
    ? formatDate(submission.updatedAt)
    : "-";
  const grade = typeof submission.grade === "number" ? submission.grade : "-";
  const plagiarismScore =
    typeof submission.plagiarismScore === "number"
      ? submission.plagiarismScore
      : submission.plagiarismChecks?.score;
  const statusBadge = getStatusBadge(submission.status);
  const plagiarismBadge = getPlagiarismBadge(plagiarismScore);

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard/submissions")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Detail Submission
          </h1>
          <p className="text-gray-600">
            {assignmentTitle} • {className}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Submission</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Info Section */}
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Judul Tugas:
                </span>
                <p className="font-medium text-gray-900">{assignmentTitle}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Nama Kelas:
                </span>
                <p className="font-medium text-gray-900">{className}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Tanggal Pengumpulan:
                </span>
                <p className="font-medium text-gray-900">{submittedAt}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Status:
                </span>
                <div className="mt-1">{statusBadge}</div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Nilai:
                </span>
                <p className="font-medium text-blue-700 text-lg">
                  {grade !== "-" ? (
                    grade
                  ) : (
                    <span className="text-gray-500">Belum dinilai</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Plagiarisme:
                </span>
                <div className="mt-1">
                  {plagiarismBadge || (
                    <span className="text-gray-500">Belum dicek</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Terakhir Update:
                </span>
                <p className="font-medium text-gray-900">{updatedAt}</p>
              </div>
            </div>

            {/* Actions Section */}
            <div className="space-y-6">
              <Button
                size="lg"
                className="w-full bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleDownload("pdf")}
                loading={downloading}
                aria-label="Download PDF"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => handleDownload("docx")}
                loading={downloading}
                aria-label="Download DOCX"
              >
                <Download className="h-5 w-5 mr-2" />
                Download DOCX
              </Button>
              {plagiarismScore !== undefined && plagiarismScore !== null && (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={handleViewPlagiarismReport}
                  loading={plagiarismLoading}
                  aria-label="Lihat Laporan Plagiarisme"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Lihat Laporan Plagiarisme
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plagiarism Report Modal (optional, jika ingin tampilkan detail di modal) */}
      {/* 
      {plagiarismReport && (
        <Modal
          isOpen={!!plagiarismReport}
          onClose={() => setPlagiarismReport(null)}
          title="Laporan Plagiarisme"
        >
          <div>
            <p>Score: {plagiarismReport.score}%</p>
            <a
              href={plagiarismReport.pdfReportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download PDF Report
            </a>
          </div>
        </Modal>
      )}
      */}
    </Container>
  );
}
