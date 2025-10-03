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

      {/* Enhanced Welcome Section with Gradient Background */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>

        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Dashboard Instructor
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Selamat datang, {user?.fullName}! 👨‍🏫
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Kelola kelas dan monitor progress siswa dengan mudah.
                {stats.pendingGrading > 0 &&
                  ` Ada ${stats.pendingGrading} submission menunggu penilaian.`}
              </p>
            </div>

            {/* Enhanced Quick Stats Indicator */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 bg-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-white text-sm font-medium">
                  {stats.totalClasses} Kelas Aktif
                </span>
              </div>
              {stats.pendingGrading > 0 && (
                <div className="flex items-center px-4 py-2 rounded-full backdrop-blur-sm border border-orange-300/50 bg-orange-500/20">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-white text-sm font-medium">
                    {stats.pendingGrading} Perlu Review
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Actions Alert */}
      {stats.pendingGrading > 0 && (
        <div className="mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl"></div>
          <div className="relative p-6 border border-orange-200/50 rounded-2xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-500 rounded-2xl shadow-lg">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-orange-900 mb-2">
                  Perlu Perhatian
                </h3>
                <p className="text-orange-800 mb-4">
                  Anda memiliki {stats.pendingGrading} submission yang menunggu
                  penilaian dari siswa.
                </p>
                <Link to="/instructor/submissions">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
                    <FileText className="h-4 w-4 mr-2" />
                    Review Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Tab Navigation */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-[#23407a] to-[#3b5fa4] rounded-full mr-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Sections
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-2">
          <nav className="flex space-x-2">
            {[
              {
                id: "overview",
                label: "Overview",
                icon: BarChart3,
                description: "Ringkasan aktivitas",
              },
              {
                id: "classes",
                label: "Kelas",
                icon: BookOpen,
                description: "Manajemen kelas",
              },
              {
                id: "monitoring",
                label: "Monitoring",
                icon: TrendingUp,
                description: "Monitor submission",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 p-4 rounded-xl transition-all duration-300 group ${
                  activeTab === tab.id
                    ? "bg-[#23407a] text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#23407a]"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <tab.icon
                    className={`h-5 w-5 ${
                      activeTab === tab.id
                        ? "text-white"
                        : "text-gray-500 group-hover:text-[#23407a]"
                    }`}
                  />
                  <span className="font-medium text-sm">{tab.label}</span>
                  <span
                    className={`text-xs ${
                      activeTab === tab.id ? "text-white/80" : "text-gray-400"
                    }`}
                  >
                    {tab.description}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-[#23407a] to-[#3b5fa4] rounded-full mr-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">
            Statistik Performa
          </h2>
        </div>
        <Grid cols={1} mdCols={2} lgCols={4} gap={6}>
          <StatCard
            title="Total Kelas"
            value={stats.totalClasses}
            icon={BookOpen}
            color="blue"
            gradient="from-blue-500 to-blue-600"
            trend={stats.totalClasses > 0 ? "positive" : "neutral"}
          />
          <StatCard
            title="Total Siswa"
            value={stats.totalStudents}
            icon={Users}
            color="green"
            gradient="from-green-500 to-emerald-600"
            trend="positive"
          />
          <StatCard
            title="Tugas Aktif"
            value={stats.activeAssignments}
            icon={Clock}
            color="yellow"
            gradient="from-yellow-500 to-orange-500"
            trend={stats.activeAssignments > 0 ? "warning" : "positive"}
          />
          <StatCard
            title="Pendapatan Bulan Ini"
            value={`Rp ${stats.monthlyRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="purple"
            gradient="from-purple-500 to-indigo-600"
            trend="positive"
          />
        </Grid>
      </div>

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

      {/* Enhanced Summary Statistics */}
      <div className="mt-12">
        <div className="flex items-center mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-[#23407a] to-[#3b5fa4] rounded-full mr-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analisis Performa
          </h2>
        </div>

        <Grid cols={1} mdCols={3} gap={8}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.completionRate}%
              </div>
              <div className="text-sm font-medium text-gray-600 mb-4">
                Tingkat Penyelesaian
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Rata-rata completion rate siswa
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.averageGrade}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-4">
                Rata-rata Nilai
              </div>
              <div className="flex items-center justify-center">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    stats.averageGrade >= 75
                      ? "bg-green-100 text-green-700"
                      : stats.averageGrade >= 60
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {stats.averageGrade >= 75
                    ? "Sangat Baik"
                    : stats.averageGrade >= 60
                    ? "Baik"
                    : "Perlu Perbaikan"}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Berdasarkan semua submission
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                Rp {stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-4">
                Total Pendapatan
              </div>
              <div className="flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-sm text-purple-600 font-medium">
                  +
                  {Math.round(
                    (stats.monthlyRevenue / (stats.totalRevenue || 1)) * 100
                  )}
                  % bulan ini
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Dari assignment yang dibuat
              </p>
            </CardContent>
          </Card>
        </Grid>
      </div>
    </Container>
  );
}
