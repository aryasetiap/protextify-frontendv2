import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  LoadingSpinner,
  Container,
  Alert,
} from "../../components";
import { Breadcrumb } from "../../components/layout";
import {
  StatCard,
  RecentClasses,
  ActivityTimeline,
  QuickActions,
} from "../../components/dashboard";
import { useStudentDashboard } from "../../hooks/useStudentDashboard";

export default function StudentDashboard() {
  const { user } = useAuth();
  const {
    loading,
    error,
    stats,
    recentClasses,
    recentSubmissions,
    upcomingDeadlines,
    refetch,
  } = useStudentDashboard();

  if (loading) {
    return (
      <Container className="py-6">
        <Breadcrumb />
        <div className="flex items-center justify-center min-h-64">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Memuat dashboard...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-6">
        <Breadcrumb />
        <Alert variant="error" title="Error" className="mb-6">
          <p>Gagal memuat data dashboard. Silakan coba lagi.</p>
          <Button onClick={refetch} size="sm" className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#23407a] to-[#1a2f5c] rounded-lg p-6 text-white mb-8">
        <h1 className="text-2xl font-bold">
          Selamat datang, {user?.fullName}! 👋
        </h1>
        <p className="mt-2 opacity-90">
          Kelola tugas dan kelas Anda dengan mudah.{" "}
          {stats.activeAssignments > 0 &&
            `Anda memiliki ${stats.activeAssignments} tugas aktif.`}
        </p>
      </div>

      {/* Upcoming Deadlines Alert */}
      {upcomingDeadlines.length > 0 && (
        <Alert variant="warning" title="Deadline Mendekat" className="mb-6">
          <div className="space-y-2">
            {upcomingDeadlines.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between"
              >
                <span className="text-sm">
                  <strong>{assignment.title}</strong> - {assignment.className}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(assignment.deadline).toLocaleDateString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid cols={1} mdCols={2} lgCols={4} gap={6} className="mb-8">
        <StatCard
          title="Total Kelas"
          value={stats.totalClasses}
          icon={BookOpen}
          color="blue"
          trend={stats.totalClasses > 0 ? "positive" : "neutral"}
        />
        <StatCard
          title="Tugas Aktif"
          value={stats.activeAssignments}
          icon={Clock}
          color="yellow"
          trend={stats.activeAssignments > 0 ? "warning" : "positive"}
        />
        <StatCard
          title="Tugas Selesai"
          value={stats.completedAssignments}
          icon={CheckCircle}
          color="green"
          trend="positive"
        />
        <StatCard
          title="Menunggu Review"
          value={stats.pendingSubmissions}
          icon={FileText}
          color="purple"
          trend={stats.pendingSubmissions > 0 ? "warning" : "positive"}
        />
      </Grid>

      {/* Main Content Grid */}
      <Grid cols={1} lgCols={3} gap={8}>
        {/* Quick Actions */}
        <QuickActions stats={stats} />

        {/* Recent Classes */}
        <RecentClasses
          classes={recentClasses}
          totalClasses={stats.totalClasses}
        />

        {/* Activity Timeline */}
        <ActivityTimeline
          submissions={recentSubmissions}
          className="lg:col-span-1"
        />
      </Grid>

      {/* Progress Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Assignment Completion Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Tingkat Penyelesaian Tugas
                </span>
                <span className="text-sm text-gray-600">
                  {stats.completedAssignments} / {stats.totalAssignments}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#23407a] h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      stats.totalAssignments > 0
                        ? (stats.completedAssignments /
                            stats.totalAssignments) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Activity This Week */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Aktivitas Minggu Ini
                </span>
                <span className="text-sm text-gray-600">
                  {stats.weeklyActivity} submission
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (stats.weeklyActivity / 7) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
