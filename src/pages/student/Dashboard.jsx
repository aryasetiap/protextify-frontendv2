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
import { useStudentDashboard } from "../../hooks/useStudentDashboard";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  LoadingSpinner,
  Alert,
  Button,
} from "../../components";
import {
  QuickActions,
  RecentClasses,
  ActivityTimeline,
} from "../../components/dashboard";
import { Grid } from "../../components/ui";

export default function StudentDashboard() {
  const { user } = useAuth();
  const {
    loading,
    error,
    stats,
    recentClasses,
    recentAssignments,
    activityTimeline,
    refetch,
    isConnected,
  } = useStudentDashboard();

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
          <p>Gagal memuat data dashboard: {error.message}</p>
          <Button onClick={refetch} size="sm" className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  // Safe fallback untuk stats
  const safeStats = {
    totalClasses: stats?.totalClasses || 0,
    activeAssignments: stats?.activeAssignments || 0,
    completedAssignments: stats?.completedAssignments || 0,
    pendingSubmissions: stats?.pendingSubmissions || 0,
  };

  // Safe fallback untuk arrays
  const safeRecentClasses = Array.isArray(recentClasses) ? recentClasses : [];
  const safeRecentAssignments = Array.isArray(recentAssignments)
    ? recentAssignments
    : [];
  const safeActivityTimeline = Array.isArray(activityTimeline)
    ? activityTimeline
    : [];

  return (
    <Container className="py-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#23407a] to-[#1a2f5c] rounded-lg p-6 text-white mb-8">
        <h1 className="text-2xl font-bold">
          Selamat datang, {user?.fullName || "Student"}!
        </h1>
        <p className="mt-2 opacity-90">
          Kelola tugas dan kelas Anda dengan mudah
        </p>
      </div>

      {/* Statistics Cards */}
      <Grid cols={1} mdCols={2} lgCols={4} gap={6} className="mb-8">
        <StatCard
          title="Total Kelas"
          value={safeStats.totalClasses}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Tugas Aktif"
          value={safeStats.activeAssignments}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Tugas Selesai"
          value={safeStats.completedAssignments}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Draft"
          value={safeStats.pendingSubmissions}
          icon={FileText}
          color="gray"
        />
      </Grid>

      {/* Main Content */}
      <Grid cols={1} lgCols={3} gap={8}>
        {/* Quick Actions */}
        <QuickActions stats={safeStats} />

        {/* Recent Classes */}
        <RecentClasses
          classes={safeRecentClasses}
          totalClasses={safeStats.totalClasses}
        />

        {/* Activity Timeline */}
        <ActivityTimeline submissions={safeActivityTimeline} />
      </Grid>
    </Container>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
