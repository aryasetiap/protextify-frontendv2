import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Download,
  CheckCircle,
  Clock,
  Filter,
  Search,
  RefreshCw,
  MoreVertical,
  Star,
  FileText,
  AlertCircle,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Alert,
  Breadcrumb,
  LoadingSpinner,
  Badge,
  Dropdown,
  ExportModal,
} from "../../components";
import {
  assignmentsService,
  submissionsService,
  plagiarismService,
} from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useWebSocket } from "../../hooks/useWebSocket";
import { formatDate, formatRelativeTime } from "../../utils/formatters";

export default function MonitorSubmissions() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);

  const { joinMonitoring, leaveMonitoring, on, off } = useWebSocket();

  // Get assignment detail
  const { data: assignment, loading: assignmentLoading } = useAsyncData(
    () => assignmentsService.getAssignmentById(assignmentId),
    [assignmentId]
  );

  // Fetch submissions
  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await assignmentsService.getAssignmentSubmissions(
        assignment?.classId,
        assignmentId
      );
      setSubmissions(response);
      setFilteredSubmissions(response);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Gagal memuat data submission");
    } finally {
      setLoading(false);
    }
  }, [assignmentId, assignment?.classId]);

  // Join WebSocket monitoring room
  useEffect(() => {
    if (assignmentId) {
      joinMonitoring(assignmentId);

      return () => {
        leaveMonitoring(assignmentId);
      };
    }
  }, [assignmentId, joinMonitoring, leaveMonitoring]);

  // WebSocket event handlers
  useEffect(() => {
    const handleSubmissionListUpdate = (data) => {
      if (data.assignmentId === assignmentId) {
        setSubmissions(data.submissions);
        setFilteredSubmissions(data.submissions);
      }
    };

    const handleSubmissionUpdate = (data) => {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === data.submissionId ? { ...sub, ...data } : sub
        )
      );
    };

    on("submissionListUpdated", handleSubmissionListUpdate);
    on("submissionUpdated", handleSubmissionUpdate);

    return () => {
      off("submissionListUpdated", handleSubmissionListUpdate);
      off("submissionUpdated", handleSubmissionUpdate);
    };
  }, [assignmentId, on, off]);

  // Fetch data when assignment is loaded
  useEffect(() => {
    if (assignment?.classId) {
      fetchSubmissions();
    }
  }, [assignment?.classId, fetchSubmissions]);

  // Filter and search
  useEffect(() => {
    let filtered = submissions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (submission) =>
          submission.student?.fullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.student?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (submission) => submission.status === statusFilter
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "studentName":
          aValue = a.student?.fullName || "";
          bValue = b.student?.fullName || "";
          break;
        case "submittedAt":
          aValue = new Date(a.submittedAt || a.updatedAt);
          bValue = new Date(b.submittedAt || b.updatedAt);
          break;
        case "grade":
          aValue = a.grade || 0;
          bValue = b.grade || 0;
          break;
        case "plagiarismScore":
          aValue = a.plagiarismScore || 0;
          bValue = b.plagiarismScore || 0;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, statusFilter, sortBy, sortOrder]);

  const getStatusBadge = (status) => {
    const variants = {
      DRAFT: { variant: "secondary", label: "Draft" },
      SUBMITTED: { variant: "warning", label: "Dikumpulkan" },
      GRADED: { variant: "success", label: "Dinilai" },
    };

    return variants[status] || variants.DRAFT;
  };

  const handleSelectSubmission = (submissionId, checked) => {
    if (checked) {
      setSelectedSubmissions((prev) => [...prev, submissionId]);
    } else {
      setSelectedSubmissions((prev) =>
        prev.filter((id) => id !== submissionId)
      );
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedSubmissions(filteredSubmissions.map((sub) => sub.id));
    } else {
      setSelectedSubmissions([]);
    }
  };

  const handleBulkGrade = () => {
    if (selectedSubmissions.length === 0) {
      toast.error("Pilih minimal satu submission");
      return;
    }
    // Navigate to bulk grading interface
    navigate(`/instructor/assignments/${assignmentId}/bulk-grade`, {
      state: { selectedSubmissions },
    });
  };

  const handleExportSubmissions = () => {
    setShowExportModal(true);
  };

  const stats = {
    total: submissions.length,
    submitted: submissions.filter((s) => s.status === "SUBMITTED").length,
    graded: submissions.filter((s) => s.status === "GRADED").length,
    pending: submissions.filter((s) => s.status === "DRAFT").length,
    averageGrade:
      submissions.filter((s) => s.grade).reduce((acc, s) => acc + s.grade, 0) /
        submissions.filter((s) => s.grade).length || 0,
  };

  if (assignmentLoading) {
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
          onClick={() => navigate(`/instructor/classes/${assignment?.classId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Kelas
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Monitor Submission
          </h1>
          <p className="text-gray-600">{assignment?.title}</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleExportSubmissions}
            disabled={filteredSubmissions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleBulkGrade}
            disabled={selectedSubmissions.length === 0}
            className="bg-[#23407a] hover:bg-[#1a2f5c]"
          >
            <Star className="h-4 w-4 mr-2" />
            Nilai Massal ({selectedSubmissions.length})
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Total"
          value={stats.total}
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Dikumpulkan"
          value={stats.submitted}
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Dinilai"
          value={stats.graded}
          icon={Star}
          color="text-purple-600"
        />
        <StatCard
          title="Draft"
          value={stats.pending}
          icon={Clock}
          color="text-yellow-600"
        />
        <StatCard
          title="Rata-rata Nilai"
          value={stats.averageGrade.toFixed(1)}
          icon={FileText}
          color="text-indigo-600"
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama atau email siswa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a]"
            >
              <option value="ALL">Semua Status</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Dikumpulkan</option>
              <option value="GRADED">Dinilai</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a]"
            >
              <option value="submittedAt-desc">Terbaru</option>
              <option value="submittedAt-asc">Terlama</option>
              <option value="studentName-asc">Nama A-Z</option>
              <option value="studentName-desc">Nama Z-A</option>
              <option value="grade-desc">Nilai Tertinggi</option>
              <option value="grade-asc">Nilai Terendah</option>
              <option value="plagiarismScore-desc">Plagiarisme Tinggi</option>
              <option value="plagiarismScore-asc">Plagiarisme Rendah</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchSubmissions}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Daftar Submission ({filteredSubmissions.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  selectedSubmissions.length === filteredSubmissions.length &&
                  filteredSubmissions.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 focus:ring-[#23407a]"
              />
              <span className="text-sm text-gray-600">Pilih Semua</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada submission
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "ALL"
                  ? "Tidak ada submission yang sesuai dengan filter"
                  : "Belum ada siswa yang mengumpulkan tugas"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={
                          selectedSubmissions.length ===
                          filteredSubmissions.length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 focus:ring-[#23407a]"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Siswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dikumpulkan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nilai
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plagiarisme
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <SubmissionRow
                      key={submission.id}
                      submission={submission}
                      isSelected={selectedSubmissions.includes(submission.id)}
                      onSelect={(checked) =>
                        handleSelectSubmission(submission.id, checked)
                      }
                      assignmentId={assignmentId}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          submissions={filteredSubmissions}
          assignmentTitle={assignment?.title}
        />
      )}
    </Container>
  );
}

// Helper Components
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-full bg-gray-100 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SubmissionRow({ submission, isSelected, onSelect, assignmentId }) {
  const [loading, setLoading] = useState(false);

  const handlePlagiarismCheck = async () => {
    try {
      setLoading(true);
      await plagiarismService.checkPlagiarism(submission.id);
      toast.success("Pengecekan plagiarisme dimulai");
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      toast.error("Gagal memulai pengecekan plagiarisme");
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = getStatusBadge(submission.status);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="rounded border-gray-300 focus:ring-[#23407a]"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">
            {submission.student?.fullName}
          </div>
          <div className="text-sm text-gray-500">
            {submission.student?.email}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {submission.submittedAt ? (
          <div>
            <div>{formatDate(submission.submittedAt)}</div>
            <div className="text-xs text-gray-400">
              {formatRelativeTime(submission.submittedAt)}
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Belum dikumpulkan</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {submission.grade ? (
          <span className="text-sm font-medium text-gray-900">
            {submission.grade}/100
          </span>
        ) : (
          <span className="text-sm text-gray-400">Belum dinilai</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {submission.plagiarismScore ? (
          <div className="flex items-center">
            <span
              className={`text-sm font-medium ${
                submission.plagiarismScore > 30
                  ? "text-red-600"
                  : submission.plagiarismScore > 15
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {submission.plagiarismScore}%
            </span>
            {submission.plagiarismScore > 30 && (
              <AlertCircle className="h-4 w-4 text-red-600 ml-1" />
            )}
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handlePlagiarismCheck}
            disabled={loading || submission.status === "DRAFT"}
            className="text-xs"
          >
            {loading ? "Checking..." : "Cek"}
          </Button>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Dropdown
          trigger={
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          }
        >
          <div className="py-1">
            <Link
              to={`/instructor/submissions/${submission.id}`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Eye className="h-4 w-4 inline mr-2" />
              Lihat Detail
            </Link>
            {submission.status === "SUBMITTED" && (
              <Link
                to={`/instructor/submissions/${submission.id}/grade`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Star className="h-4 w-4 inline mr-2" />
                Beri Nilai
              </Link>
            )}
            <button
              onClick={() =>
                submissionsService.downloadSubmission(submission.id)
              }
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Download className="h-4 w-4 inline mr-2" />
              Download
            </button>
          </div>
        </Dropdown>
      </td>
    </tr>
  );
}

function getStatusBadge(status) {
  const variants = {
    DRAFT: { variant: "secondary", label: "Draft" },
    SUBMITTED: { variant: "warning", label: "Dikumpulkan" },
    GRADED: { variant: "success", label: "Dinilai" },
  };

  return variants[status] || variants.DRAFT;
}
