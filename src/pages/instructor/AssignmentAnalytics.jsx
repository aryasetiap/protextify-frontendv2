// src/pages/instructor/AssignmentAnalytics.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Breadcrumb,
  LoadingSpinner,
} from "../../components";
import { assignmentsService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useWebSocket } from "../../hooks/useWebSocket";

export default function AssignmentAnalytics() {
  const { assignmentId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const { joinMonitoring, leaveMonitoring, on, off } = useWebSocket();

  // Get assignment detail
  const { data: assignment } = useAsyncData(
    () => assignmentsService.getAssignmentById(assignmentId),
    [assignmentId]
  );

  useEffect(() => {
    fetchAnalytics();

    if (assignmentId) {
      joinMonitoring(assignmentId);

      return () => {
        leaveMonitoring(assignmentId);
      };
    }
  }, [assignmentId]);

  useEffect(() => {
    const handleSubmissionUpdate = () => {
      fetchAnalytics();
    };

    on("submissionListUpdated", handleSubmissionUpdate);
    on("submissionUpdated", handleSubmissionUpdate);

    return () => {
      off("submissionListUpdated", handleSubmissionUpdate);
      off("submissionUpdated", handleSubmissionUpdate);
    };
  }, [on, off]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await assignmentsService.getAssignmentSubmissions(
        assignment?.classId,
        assignmentId
      );

      // Calculate analytics
      const submissions = response;
      const total = submissions.length;
      const submitted = submissions.filter(
        (s) => s.status === "SUBMITTED"
      ).length;
      const graded = submissions.filter((s) => s.status === "GRADED").length;
      const pending = submissions.filter((s) => s.status === "DRAFT").length;

      const grades = submissions.filter((s) => s.grade).map((s) => s.grade);
      const averageGrade =
        grades.length > 0
          ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length
          : 0;

      const plagiarismScores = submissions
        .filter((s) => s.plagiarismScore)
        .map((s) => s.plagiarismScore);
      const averagePlagiarism =
        plagiarismScores.length > 0
          ? plagiarismScores.reduce((sum, score) => sum + score, 0) /
            plagiarismScores.length
          : 0;

      const highPlagiarism = submissions.filter(
        (s) => s.plagiarismScore > 30
      ).length;

      // Grade distribution
      const gradeDistribution = {
        "90-100": grades.filter((g) => g >= 90).length,
        "80-89": grades.filter((g) => g >= 80 && g < 90).length,
        "70-79": grades.filter((g) => g >= 70 && g < 80).length,
        "60-69": grades.filter((g) => g >= 60 && g < 70).length,
        "< 60": grades.filter((g) => g < 60).length,
      };

      // Submission timeline (last 7 days)
      const timeline = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const daySubmissions = submissions.filter((s) => {
          if (!s.submittedAt) return false;
          const submissionDate = new Date(s.submittedAt);
          return submissionDate.toDateString() === date.toDateString();
        }).length;

        timeline.push({
          date: date.toLocaleDateString("id-ID", {
            month: "short",
            day: "numeric",
          }),
          submissions: daySubmissions,
        });
      }

      setAnalytics({
        total,
        submitted,
        graded,
        pending,
        averageGrade,
        averagePlagiarism,
        highPlagiarism,
        gradeDistribution,
        timeline,
        submissions,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-6">
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Assignment
          </h1>
          <p className="text-gray-600">{assignment?.title}</p>
        </div>
        <Link
          to={`/instructor/assignments/${assignmentId}/monitor`}
          className="text-blue-600 hover:text-blue-700"
        >
          Lihat Monitoring →
        </Link>
      </div>

      {analytics && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Siswa"
              value={analytics.total}
              icon={Users}
              color="bg-blue-500"
            />
            <StatCard
              title="Sudah Mengumpulkan"
              value={analytics.submitted}
              subtitle={`${
                analytics.total > 0
                  ? Math.round((analytics.submitted / analytics.total) * 100)
                  : 0
              }%`}
              icon={TrendingUp}
              color="bg-green-500"
            />
            <StatCard
              title="Sudah Dinilai"
              value={analytics.graded}
              subtitle={`${
                analytics.submitted > 0
                  ? Math.round((analytics.graded / analytics.submitted) * 100)
                  : 0
              }%`}
              icon={Clock}
              color="bg-purple-500"
            />
            <StatCard
              title="Plagiarisme Tinggi"
              value={analytics.highPlagiarism}
              subtitle="(> 30%)"
              icon={AlertTriangle}
              color="bg-red-500"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Nilai</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.gradeDistribution).map(
                    ([range, count]) => (
                      <div
                        key={range}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {range}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div
                            className="bg-blue-500 h-4 rounded"
                            style={{
                              width: `${
                                analytics.graded > 0
                                  ? (count / analytics.graded) * 100
                                  : 0
                              }%`,
                              minWidth: count > 0 ? "20px" : "0px",
                            }}
                          />
                          <span className="text-sm text-gray-500 w-8">
                            {count}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submission Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline Pengumpulan (7 Hari)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.timeline.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {day.date}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div
                          className="bg-green-500 h-4 rounded"
                          style={{
                            width: `${Math.max(
                              day.submissions * 10,
                              day.submissions > 0 ? 20 : 0
                            )}px`,
                          }}
                        />
                        <span className="text-sm text-gray-500 w-8">
                          {day.submissions}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistik Nilai</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rata-rata:</span>
                    <span className="font-semibold">
                      {analytics.averageGrade.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tertinggi:</span>
                    <span className="font-semibold">
                      {analytics.submissions.filter((s) => s.grade).length > 0
                        ? Math.max(
                            ...analytics.submissions
                              .filter((s) => s.grade)
                              .map((s) => s.grade)
                          )
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Terendah:</span>
                    <span className="font-semibold">
                      {analytics.submissions.filter((s) => s.grade).length > 0
                        ? Math.min(
                            ...analytics.submissions
                              .filter((s) => s.grade)
                              .map((s) => s.grade)
                          )
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistik Plagiarisme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rata-rata:</span>
                    <span className="font-semibold">
                      {analytics.averagePlagiarism.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sudah dicek:</span>
                    <span className="font-semibold">
                      {
                        analytics.submissions.filter((s) => s.plagiarismScore)
                          .length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Perlu perhatian:</span>
                    <span className="font-semibold text-red-600">
                      {analytics.highPlagiarism}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Pengumpulan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Draft:</span>
                    <span className="font-semibold text-yellow-600">
                      {analytics.pending}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dikumpulkan:</span>
                    <span className="font-semibold text-blue-600">
                      {analytics.submitted}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dinilai:</span>
                    <span className="font-semibold text-green-600">
                      {analytics.graded}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </Container>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color} text-white`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {subtitle && (
                <p className="ml-2 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
