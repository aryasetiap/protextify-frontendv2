/**
 * Mapping utama:
 * - plagiarismService.getPlagiarismReport(submissionId) -> report (score, sources[], pdfReportUrl, checkedAt, detailedResults)
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
import { plagiarismService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import {
  FileText,
  Download,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PlagiarismReportPage() {
  const { id: submissionId } = useParams();
  const navigate = useNavigate();

  const {
    data: report,
    loading,
    error,
    refetch,
  } = useAsyncData(
    () => plagiarismService.getPlagiarismReport(submissionId),
    [submissionId]
  );

  const [downloading, setDownloading] = useState(false);

  // Download PDF handler
  const handleDownloadPDF = async () => {
    if (!report?.pdfReportUrl) {
      toast.error("Laporan PDF tidak tersedia");
      return;
    }
    setDownloading(true);
    try {
      window.open(report.pdfReportUrl, "_blank");
      toast.success("Laporan PDF berhasil diunduh");
    } catch (err) {
      toast.error("Gagal mengunduh laporan PDF");
    } finally {
      setDownloading(false);
    }
  };

  // Score badge
  const getScoreBadge = (score) => {
    if (typeof score !== "number") return null;
    let color = "bg-gray-100 text-gray-700";
    let icon = <CheckCircle className="h-4 w-4 mr-1" />;
    if (score >= 30) {
      color = "bg-red-100 text-red-700";
      icon = <AlertTriangle className="h-4 w-4 mr-1" />;
    } else if (score >= 10) {
      color = "bg-yellow-100 text-yellow-700";
      icon = <AlertTriangle className="h-4 w-4 mr-1" />;
    } else {
      color = "bg-green-100 text-green-700";
      icon = <CheckCircle className="h-4 w-4 mr-1" />;
    }
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-semibold ${color}`}
      >
        {icon}
        {score}%
      </span>
    );
  };

  // Loading state
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
          <p>Gagal memuat laporan plagiarisme: {error.message}</p>
          <Button onClick={refetch} size="sm" className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container className="py-8">
        <Card>
          <CardContent className="text-center py-16">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Laporan Tidak Ditemukan
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Laporan plagiarisme belum tersedia untuk submission ini.
            </p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Mapping field
  const score = typeof report.score === "number" ? report.score : 0;
  const checkedAt = report.checkedAt
    ? new Date(report.checkedAt).toLocaleString("id-ID")
    : "-";
  const sources = Array.isArray(report.detailedResults?.sources)
    ? report.detailedResults.sources
    : [];

  return (
    <Container className="py-8">
      <Breadcrumb />

      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <FileText className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Laporan Plagiarisme
          </h1>
          <p className="text-gray-600">Submission ID: {submissionId}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <div className="mb-2 text-gray-600 text-sm">Dicek pada:</div>
              <div className="font-medium text-gray-900">{checkedAt}</div>
            </div>
            <div>
              <div className="mb-2 text-gray-600 text-sm">
                Skor Plagiarisme:
              </div>
              {getScoreBadge(score)}
            </div>
            <div>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDownloadPDF}
                loading={downloading}
                aria-label="Download PDF"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Sumber Plagiarisme */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Sumber Terdeteksi
            </h3>
            {sources.length > 0 ? (
              <div className="space-y-4">
                {sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {source.title || source.url}
                      </div>
                      <div className="text-sm text-blue-600 truncate">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          {source.url}
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          source.score > 80
                            ? "bg-red-100 text-red-700"
                            : source.score > 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {Math.round(source.score)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 italic py-6">
                Tidak ada sumber plagiarisme terdeteksi.
              </div>
            )}
          </div>

          {/* Ringkasan Konten (jika ada) */}
          {report.detailedResults?.result && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Ringkasan Konten
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-900">
                    {report.detailedResults.result.textWordCounts || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Kata</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-red-600">
                    {report.detailedResults.result.totalPlagiarismWords || 0}
                  </div>
                  <div className="text-sm text-gray-600">Kata Terindikasi</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-blue-600">
                    {report.creditsUsed || 0}
                  </div>
                  <div className="text-sm text-gray-600">Kredit Digunakan</div>
                </div>
              </div>
            </div>
          )}

          {/* File Preview (jika BE mengirimkan) */}
          {report.filePreviewUrl && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Preview File
              </h3>
              <iframe
                src={report.filePreviewUrl}
                title="Preview File"
                className="w-full h-96 border rounded-lg"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
