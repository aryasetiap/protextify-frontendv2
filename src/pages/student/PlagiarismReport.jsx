/**
 * Mapping utama:
 * - plagiarismService.getPlagiarismReport(submissionId) -> report (score, sources[], pdfReportUrl, checkedAt, detailedResults)
 * - Tidak render data/fitur yang tidak ada di response BE.
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
  ArrowLeft,
  BarChart3,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { formatDate } from "../../utils/helpers";

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
  const checkedAt = report.checkedAt ? formatDate(report.checkedAt) : "-";
  const sources = Array.isArray(report.detailedResults?.sources)
    ? report.detailedResults.sources
    : [];
  const result = report.detailedResults?.result || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Container className="py-8">
      <Breadcrumb />

      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
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
              Laporan Plagiarisme
            </h1>
            <p className="text-gray-600 font-mono text-sm">
              Submission ID: {submissionId}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Button
            size="lg"
            variant="outline"
            onClick={handleDownloadPDF}
            loading={downloading}
            aria-label="Download PDF"
            className="bg-white shadow-md hover:bg-gray-50"
          >
            <Download className="h-5 w-5 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column - Score & Stats */}
        <div className="lg:col-span-1 space-y-8">
          <ScoreDonutChart score={score} />
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-[#23407a]" />
                <span>Ringkasan Konten</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatItem label="Total Kata" value={result.textWordCounts || 0} />
              <StatItem
                label="Kata Terindikasi"
                value={result.totalPlagiarismWords || 0}
                valueColor="text-red-600"
              />
              <StatItem
                label="Kredit Digunakan"
                value={report.creditsUsed || 0}
              />
              <StatItem label="Dicek Pada" value={checkedAt} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sources */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-5 w-5 text-[#23407a]" />
                <span>Sumber Terdeteksi ({sources.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sources.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {sources.map((source, idx) => (
                    <SourceListItem key={idx} source={source} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500 italic">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p className="font-medium text-lg text-gray-800">
                    Luar Biasa!
                  </p>
                  <p>Tidak ada sumber plagiarisme yang terdeteksi.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </Container>
  );
}

// --- Sub-components for better structure ---

function ScoreDonutChart({ score }) {
  const getScoreColor = (s) => {
    if (s >= 30) return { main: "#EF4444", bg: "#FEE2E2" }; // red
    if (s >= 10) return { main: "#F59E0B", bg: "#FEF3C7" }; // yellow
    return { main: "#22C55E", bg: "#DCFCE7" }; // green
  };

  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card className="border-0 shadow-lg p-6">
      <CardTitle className="text-center mb-4">Skor Plagiarisme</CardTitle>
      <div className="relative flex items-center justify-center h-48 w-48 mx-auto">
        <svg
          className="absolute"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={color.bg}
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={color.main}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="text-center">
          <span className="text-4xl font-bold" style={{ color: color.main }}>
            {score}%
          </span>
          <p className="text-sm font-medium" style={{ color: color.main }}>
            {score >= 30 ? "Tinggi" : score >= 10 ? "Sedang" : "Rendah"}
          </p>
        </div>
      </div>
    </Card>
  );
}

function StatItem({ label, value, valueColor = "text-gray-900" }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className={`text-sm font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}

function SourceListItem({ source }) {
  const getScoreColorClass = (s) => {
    if (s > 80) return "bg-red-100 text-red-700";
    if (s > 50) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200/80 hover:bg-gray-100 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">
          {source.title || "Sumber tidak diketahui"}
        </div>
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline truncate flex items-center gap-1"
        >
          {source.url}
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </a>
      </div>
      <div className="ml-4 text-right">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getScoreColorClass(
            source.score
          )}`}
        >
          {Math.round(source.score)}%
        </span>
      </div>
    </div>
  );
}
