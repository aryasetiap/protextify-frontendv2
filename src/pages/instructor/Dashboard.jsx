import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
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
import { StatCard } from "../../components/dashboard";
import {
  ClassOverview,
  SubmissionMonitor,
  InstructorQuickActions,
  AnalyticsChart,
  RecentActivity,
} from "../../components/instructor";
import { useInstructorDashboard } from "../../hooks/useInstructorDashboard";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    loading,
    error,
    stats,
    recentClasses,
    recentSubmissions,
    recentTransactions,
    analyticsData,
    refetch,
  } = useInstructorDashboard();

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
          Selamat datang, {user?.fullName}! 👨‍🏫
        </h1>
        <p className="mt-2 opacity-90">
          Kelola kelas dan monitor progress siswa dengan mudah.
          {stats.pendingGrading > 0 &&
            ` Ada ${stats.pendingGrading} submission menunggu penilaian.`}
        </p>
      </div>

      {/* Pending Actions Alert */}
      {stats.pendingGrading > 0 && (
        <Alert variant="warning" title="Perlu Perhatian" className="mb-6">
          <div className="flex items-center justify-between">
            <span>
              Anda memiliki {stats.pendingGrading} submission yang menunggu
              penilaian
            </span>
            <Link to="/instructor/submissions">
              <Button size="sm">Lihat Sekarang</Button>
            </Link>
          </div>
        </Alert>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "classes", label: "Kelas", icon: BookOpen },
            { id: "monitoring", label: "Monitoring", icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? "border-[#23407a] text-[#23407a]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

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
          title="Total Siswa"
          value={stats.totalStudents}
          icon={Users}
          color="green"
          trend="positive"
        />
        <StatCard
          title="Tugas Aktif"
          value={stats.activeAssignments}
          icon={Clock}
          color="yellow"
          trend={stats.activeAssignments > 0 ? "warning" : "positive"}
        />
        <StatCard
          title="Pendapatan Bulan Ini"
          value={`Rp ${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="purple"
          trend="positive"
        />
      </Grid>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <Grid cols={1} lgCols={3} gap={8}>
          {/* Quick Actions */}
          <InstructorQuickActions stats={stats} />

          {/* Class Overview */}
          <ClassOverview
            classes={recentClasses}
            totalClasses={stats.totalClasses}
          />

          {/* Recent Activity */}
          <RecentActivity
            submissions={recentSubmissions}
            transactions={recentTransactions}
          />
        </Grid>
      )}

      {activeTab === "classes" && (
        <Grid cols={1} lgCols={2} gap={8}>
          {/* Class Management */}
          <ClassOverview
            classes={recentClasses}
            totalClasses={stats.totalClasses}
            detailed={true}
          />

          {/* Analytics Chart */}
          <AnalyticsChart
            data={analyticsData.classActivity}
            title="Aktivitas Kelas"
            type="bar"
          />
        </Grid>
      )}

      {activeTab === "monitoring" && (
        <div className="space-y-8">
          {/* Submission Monitor */}
          <SubmissionMonitor
            submissions={recentSubmissions}
            pendingCount={stats.pendingGrading}
          />

          {/* Analytics Charts */}
          <Grid cols={1} lgCols={2} gap={8}>
            <AnalyticsChart
              data={analyticsData.submissionTrends}
              title="Trend Submission (7 Hari Terakhir)"
              type="line"
            />
            <AnalyticsChart
              data={analyticsData.gradingTrends}
              title="Trend Penilaian (7 Hari Terakhir)"
              type="area"
            />
          </Grid>
        </div>
      )}

      {/* Summary Statistics */}
      <Grid cols={1} mdCols={3} gap={6} className="mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {stats.completionRate}%
            </div>
            <div className="text-sm text-gray-600">Tingkat Penyelesaian</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {stats.averageGrade}
            </div>
            <div className="text-sm text-gray-600">Rata-rata Nilai</div>
            <div className="flex items-center justify-center mt-3">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                {stats.averageGrade >= 75
                  ? "Sangat Baik"
                  : stats.averageGrade >= 60
                  ? "Baik"
                  : "Perlu Perbaikan"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              Rp {stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Pendapatan</div>
            <div className="flex items-center justify-center mt-3">
              <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600">
                +{Math.round((stats.monthlyRevenue / stats.totalRevenue) * 100)}
                % bulan ini
              </span>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
}
