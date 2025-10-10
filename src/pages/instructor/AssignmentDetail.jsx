import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Download,
  Eye,
  Shield,
  TrendingUp,
  Edit,
} from "lucide-react";
import toast from "react-hot-toast";

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
  Badge,
} from "../../components";
import { useAsyncData } from "../../hooks/useAsyncData";
import { assignmentsService } from "../../services";
import { formatDate, formatDateTime } from "../../utils/helpers";

export default function AssignmentDetail() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, submitted, not-submitted, graded

  // DUMMY DATA untuk testing UI
  const assignment = {
    id: assignmentId,
    title: "Analisis Sistem Informasi Manajemen",
    description: "Buatlah analisis mendalam tentang sistem informasi manajemen pada perusahaan pilihan Anda. Jelaskan komponen-komponen utama, proses bisnis, dan dampak teknologi informasi terhadap efisiensi organisasi.",
    dueDate: "2025-10-15T23:59:00",
    maxScore: 100,
    class: {
      id: "class-1",
      name: "Sistem Informasi Lanjut",
      code: "SIM-301",
    },
    expectedStudentCount: 30,
    submissions: [
      {
        id: "sub-1",
        student: {
          id: "student-1",
          fullName: "Andi Setiawan",
          studentId: "2111001",
        },
        status: "graded",
        submittedAt: "2025-10-12T14:30:00",
        score: 85,
        plagiarismScore: 12,
        fileUrl: "/uploads/submission-1.pdf",
      },
      {
        id: "sub-2",
        student: {
          id: "student-2",
          fullName: "Budi Santoso",
          studentId: "2111002",
        },
        status: "graded",
        submittedAt: "2025-10-13T09:15:00",
        score: 92,
        plagiarismScore: 5,
        fileUrl: "/uploads/submission-2.pdf",
      },
      {
        id: "sub-3",
        student: {
          id: "student-3",
          fullName: "Citra Dewi",
          studentId: "2111003",
        },
        status: "submitted",
        submittedAt: "2025-10-14T16:45:00",
        score: null,
        plagiarismScore: null,
        fileUrl: "/uploads/submission-3.pdf",
      },
      {
        id: "sub-4",
        student: {
          id: "student-4",
          fullName: "Dian Pratiwi",
          studentId: "2111004",
        },
        status: "submitted",
        submittedAt: "2025-10-14T20:30:00",
        score: null,
        plagiarismScore: 8,
        fileUrl: "/uploads/submission-4.pdf",
      },
      {
        id: "sub-5",
        student: {
          id: "student-5",
          fullName: "Eko Saputra",
          studentId: "2111005",
        },
        status: "graded",
        submittedAt: "2025-10-10T11:20:00",
        score: 78,
        plagiarismScore: 15,
        fileUrl: "/uploads/submission-5.pdf",
      },
      {
        id: "sub-6",
        student: {
          id: "student-6",
          fullName: "Farah Nabila",
          studentId: "2111006",
        },
        status: "pending",
        submittedAt: null,
        score: null,
        plagiarismScore: null,
        fileUrl: null,
      },
      {
        id: "sub-7",
        student: {
          id: "student-7",
          fullName: "Gita Maharani",
          studentId: "2111007",
        },
        status: "pending",
        submittedAt: null,
        score: null,
        plagiarismScore: null,
        fileUrl: null,
      },
      {
        id: "sub-8",
        student: {
          id: "student-8",
          fullName: "Hendra Wijaya",
          studentId: "2111008",
        },
        status: "submitted",
        submittedAt: "2025-10-15T08:00:00",
        score: null,
        plagiarismScore: 20,
        fileUrl: "/uploads/submission-8.pdf",
      },
      {
        id: "sub-9",
        student: {
          id: "student-9",
          fullName: "Indah Permata",
          studentId: "2111009",
        },
        status: "graded",
        submittedAt: "2025-10-11T15:45:00",
        score: 88,
        plagiarismScore: 7,
        fileUrl: "/uploads/submission-9.pdf",
      },
      {
        id: "sub-10",
        student: {
          id: "student-10",
          fullName: "Joko Purnomo",
          studentId: "2111010",
        },
        status: "submitted",
        submittedAt: "2025-10-14T22:15:00",
        score: null,
        plagiarismScore: null,
        fileUrl: "/uploads/submission-10.pdf",
      },
    ],
  };

  const loading = false;
  const error = null;
  const refetch = () => {
    toast.success("Data di-refresh!");
  };

  const submissions = assignment?.submissions || [];
  const submittedCount = submissions.filter((s) => s.status === "submitted" || s.status === "graded").length;
  const gradedCount = submissions.filter((s) => s.status === "graded").length;
  const expectedCount = assignment?.expectedStudentCount || 0;

  // Filter submissions
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = submission.student?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "submitted" && (submission.status === "submitted" || submission.status === "graded")) ||
      (filterStatus === "not-submitted" && submission.status === "pending") ||
      (filterStatus === "graded" && submission.status === "graded");

    return matchesSearch && matchesFilter;
  });

  const handleCheckPlagiarism = async (submissionId) => {
    try {
      toast.loading("Memulai cek plagiarisme...");
      await assignmentsService.checkPlagiarism(submissionId);
      toast.success("Cek plagiarisme berhasil dimulai!");
      refetch();
    } catch (error) {
      toast.error("Gagal memulai cek plagiarisme");
    }
  };

  const handleGrade = (submissionId) => {
    // Navigate ke halaman grading
    navigate(`/instructor/submissions/${submissionId}/grade`);
  };

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/instructor/classes/${assignment?.classId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Kelas
        </Button>

        <div className="bg-gradient-to-r from-[#23407a] to-[#1a2f5c] rounded-2xl p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{assignment?.title}</h1>
              <p className="text-white/80 text-lg mb-4">
                {assignment?.instructions}
              </p>
              <div className="flex items-center gap-6 text-white/90">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Deadline: {formatDate(assignment?.deadline)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>
                    {submittedCount}/{expectedCount} siswa submit
                  </span>
                </div>
              </div>
            </div>
            {assignment?.active && (
              <Badge className="bg-green-500 text-white text-sm">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Aktif
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Siswa</p>
                <p className="text-3xl font-bold text-gray-900">
                  {expectedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sudah Submit</p>
                <p className="text-3xl font-bold text-green-600">
                  {submittedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Belum Submit</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {expectedCount - submittedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sudah Dinilai</p>
                <p className="text-3xl font-bold text-purple-600">
                  {gradedCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#23407a] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                className={filterStatus === "all" ? "bg-[#23407a]" : ""}
              >
                Semua
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "submitted" ? "default" : "outline"}
                onClick={() => setFilterStatus("submitted")}
                className={filterStatus === "submitted" ? "bg-green-600" : ""}
              >
                Sudah Submit
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "not-submitted" ? "default" : "outline"}
                onClick={() => setFilterStatus("not-submitted")}
                className={filterStatus === "not-submitted" ? "bg-yellow-600" : ""}
              >
                Belum Submit
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "graded" ? "default" : "outline"}
                onClick={() => setFilterStatus("graded")}
                className={filterStatus === "graded" ? "bg-purple-600" : ""}
              >
                Dinilai
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Submission ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Siswa
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Submit Time
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Plagiarisme
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Aksi Cepat
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Nilai
                    </th>
                    <th className="text-right p-4 font-semibold text-gray-900">
                      Detail
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#23407a] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            {submission.student?.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {submission.student?.fullName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {submission.student?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {submission.status === "graded" ? (
                          <Badge className="bg-purple-100 text-purple-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Dinilai
                          </Badge>
                        ) : submission.status === "submitted" ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Submitted
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Belum Submit
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {submission.submittedAt
                          ? formatDateTime(submission.submittedAt)
                          : "-"}
                      </td>
                      <td className="p-4">
                        {submission.plagiarismScore !== null ? (
                          <div className="flex items-center">
                            <div
                              className={`text-sm font-semibold ${
                                submission.plagiarismScore > 30
                                  ? "text-red-600"
                                  : submission.plagiarismScore > 15
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                            >
                              {submission.plagiarismScore}%
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {submission.status === "submitted" || submission.status === "graded" ? (
                          <div className="flex items-center gap-2">
                            {submission.plagiarismScore === null && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCheckPlagiarism(submission.id)}
                                className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white text-xs whitespace-nowrap"
                              >
                                <Shield className="h-3 w-3 mr-1" />
                                Cek
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGrade(submission.id)}
                              className="border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white text-xs whitespace-nowrap"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Nilai
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {submission.grade !== null ? (
                          <span className="font-semibold text-gray-900">
                            {submission.grade}/100
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {submission.status !== "pending" && (
                            <>
                              <Link
                                to={`/instructor/submissions/${submission.id}`}
                              >
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Detail
                                </Button>
                              </Link>
                              {submission.fileUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    window.open(submission.fileUrl, "_blank")
                                  }
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada submission
              </h3>
          <p className="text-gray-600">
                {searchQuery || filterStatus !== "all"
                  ? "Coba ubah filter atau kata kunci pencarian"
                  : "Belum ada siswa yang submit tugas ini"}
          </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
