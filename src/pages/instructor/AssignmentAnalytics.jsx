import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { assignmentsService, submissionsService } from "../../services";
import { useAsyncData } from "../../hooks";
import { BarChart3, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

// Tidak ada WebSocket, hanya polling data dari BE
export default function AssignmentAnalytics() {
  const { assignmentId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get assignment detail (gunakan service sesuai BE)
  const { data: assignment, loading: loadingAssignment } = useAsyncData(
    () => assignmentsService.getAssignmentById(assignmentId),
    [assignmentId]
  );

  // Fetch assignment submissions for analytics
  const fetchAnalytics = async () => {
    if (!assignment?.classId || !assignmentId) return;
    setLoading(true);
    try {
      // Ambil semua submission untuk assignment ini (endpoint sesuai BE)
      const submissions = await submissionsService.getAssignmentSubmissions(
        assignment.classId,
        assignmentId
      );

      // Statistik: total submissions, submitted, graded, plagiarism score, average grade
      const totalSubmissions = submissions.length;
      const submittedCount = submissions.filter(
        (s) => s.status === "SUBMITTED"
      ).length;
      const gradedCount = submissions.filter(
        (s) => s.status === "GRADED"
      ).length;
      const plagiarismScores = submissions
        .map((s) => s.plagiarismChecks?.score)
        .filter((score) => typeof score === "number");
      const avgPlagiarism =
        plagiarismScores.length > 0
          ? Math.round(
              plagiarismScores.reduce((sum, s) => sum + s, 0) /
                plagiarismScores.length
            )
          : 0;
      const grades = submissions
        .map((s) => s.grade)
        .filter((g) => typeof g === "number");
      const avgGrade =
        grades.length > 0
          ? Math.round(grades.reduce((sum, g) => sum + g, 0) / grades.length)
          : 0;

      setAnalytics({
        totalSubmissions,
        submittedCount,
        gradedCount,
        avgPlagiarism,
        avgGrade,
        submissions,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Gagal memuat data analytics"
      );
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  // Polling data setiap 30 detik (jika ingin update berkala)
  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [assignmentId, assignment?.classId]);

  if (loading || loadingAssignment) {
    return (
      <Card className="p-6 text-center">
        <BarChart3 className="h-10 w-10 text-gray-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-500">Memuat data analytics...</p>
      </Card>
    );
  }

  if (!analytics || !assignment) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">Data analytics tidak tersedia</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Analytics Assignment: {assignment.title}
          </h2>
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Submission"
            value={analytics.totalSubmissions}
            subtitle="Semua submission"
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Sudah Dikumpulkan"
            value={analytics.submittedCount}
            subtitle="Status SUBMITTED"
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="Sudah Dinilai"
            value={analytics.gradedCount}
            subtitle="Status GRADED"
            icon={BarChart3}
            color="purple"
          />
          <StatCard
            title="Rata-rata Plagiarisme"
            value={analytics.avgPlagiarism + "%"}
            subtitle="Plagiarism Score"
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            title="Rata-rata Nilai"
            value={analytics.avgGrade}
            subtitle="Grade"
            icon={CheckCircle}
            color="yellow"
          />
        </div>
      </Card>

      {/* Tabel submissions jika ingin tampilkan detail */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Daftar Submission</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 px-3">Nama Siswa</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Nilai</th>
                <th className="text-left py-2 px-3">Plagiarisme</th>
                <th className="text-left py-2 px-3">Waktu Update</th>
              </tr>
            </thead>
            <tbody>
              {analytics.submissions.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 px-3">{s.student?.fullName || "-"}</td>
                  <td className="py-2 px-3">{s.status}</td>
                  <td className="py-2 px-3">
                    {typeof s.grade === "number" ? s.grade : "-"}
                  </td>
                  <td className="py-2 px-3">
                    {typeof s.plagiarismChecks?.score === "number"
                      ? s.plagiarismChecks.score + "%"
                      : "-"}
                  </td>
                  <td className="py-2 px-3">
                    {s.updatedAt
                      ? new Date(s.updatedAt).toLocaleString("id-ID")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    red: "text-red-600 bg-red-100",
    yellow: "text-yellow-600 bg-yellow-100",
    gray: "text-gray-600 bg-gray-100",
  };
  return (
    <div className={`p-4 rounded-lg ${colorMap[color] || colorMap.gray}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-5 w-5 ${colorMap[color]}`} />
        <span className="font-semibold">{title}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-600">{subtitle}</div>
    </div>
  );
}
