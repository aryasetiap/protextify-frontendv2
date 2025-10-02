import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  TrendingUp,
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
} from "../../components";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    pendingSubmissions: 0,
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStats({
        totalClasses: 3,
        activeAssignments: 5,
        completedAssignments: 12,
        pendingSubmissions: 2,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Container className="py-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#23407a] to-[#1a2f5c] rounded-lg p-6 text-white mb-8">
        <h1 className="text-2xl font-bold">
          Selamat datang, {user?.fullName}!
        </h1>
        <p className="mt-2 opacity-90">
          Kelola tugas dan kelas Anda dengan mudah
        </p>
      </div>

      {/* Statistics Cards */}
      <Grid cols={1} mdCols={2} lgCols={4} gap={6} className="mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Kelas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalClasses}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tugas Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeAssignments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedAssignments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingSubmissions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid cols={1} lgCols={2} gap={8}>
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/dashboard/join-class">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Gabung Kelas Baru
                </Button>
              </Link>
              <Link to="/dashboard/assignments">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Lihat Tugas
                </Button>
              </Link>
              <Link to="/dashboard/submissions">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Riwayat Pengumpulan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada aktivitas</p>
              <p className="text-sm text-gray-400">
                Aktivitas tugas akan muncul di sini
              </p>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
}
