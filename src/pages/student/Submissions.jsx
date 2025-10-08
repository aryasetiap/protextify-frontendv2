/**
 * Mapping utama:
 * - submissionsService.getHistory() -> array submission
 * - Field submission: id, assignmentId, content, status, grade, createdAt, updatedAt, submittedAt, assignment (id, title, deadline, class { name }), plagiarismChecks
 * - Tidak render data/fitur yang tidak dikirim BE.
 */

import { useEffect } from "react";
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
import { submissionsService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { formatDate } from "../../utils/helpers";

export default function StudentSubmissions() {
  const {
    data: submissions,
    loading,
    error,
    refetch,
  } = useAsyncData(() => submissionsService.getHistory(), []);

  // Status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
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

  return (
    <Container className="py-6">
      <Breadcrumb />

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengumpulan</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error" className="mb-8">
              <p>Gagal memuat riwayat submission: {error.message}</p>
              <Button size="sm" onClick={refetch} className="mt-3">
                Coba Lagi
              </Button>
            </Alert>
          ) : Array.isArray(submissions) && submissions.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Belum Ada Submission
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Submission akan muncul di sini setelah Anda mengumpulkan tugas.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-3">Tugas</th>
                    <th className="text-left py-2 px-3">Kelas</th>
                    <th className="text-left py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">Nilai</th>
                    <th className="text-left py-2 px-3">Plagiarisme</th>
                    <th className="text-left py-2 px-3">Dikumpulkan</th>
                    <th className="text-left py-2 px-3">Terakhir Update</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => {
                    const assignmentTitle = submission.assignment?.title || "-";
                    const className = submission.assignment?.class?.name || "-";
                    const statusBadge = getStatusBadge(submission.status);
                    const grade =
                      typeof submission.grade === "number"
                        ? submission.grade
                        : "-";
                    const plagiarismScore =
                      typeof submission.plagiarismScore === "number"
                        ? submission.plagiarismScore
                        : submission.plagiarismChecks?.score;
                    const plagiarismBadge = getPlagiarismBadge(plagiarismScore);
                    const submittedAt = submission.submittedAt
                      ? formatDate(submission.submittedAt)
                      : "-";
                    const updatedAt = submission.updatedAt
                      ? formatDate(submission.updatedAt)
                      : "-";

                    return (
                      <tr key={submission.id}>
                        <td className="py-2 px-3 font-medium text-gray-900">
                          {assignmentTitle}
                        </td>
                        <td className="py-2 px-3 text-gray-700">{className}</td>
                        <td className="py-2 px-3">{statusBadge}</td>
                        <td className="py-2 px-3">
                          {grade !== "-" && (
                            <span className="inline-block font-semibold text-blue-700">
                              {grade}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">{plagiarismBadge}</td>
                        <td className="py-2 px-3">{submittedAt}</td>
                        <td className="py-2 px-3">{updatedAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
