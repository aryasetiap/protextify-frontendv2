/**
 * Mapping utama:
 * - assignmentsService.getRecentAssignments(limit) -> array assignment
 * - Field assignment: id, title, instructions, deadline, classId, class (name), expectedStudentCount, active, createdAt, submissions[], _count.submissions
 * - Hanya assignment yang dikirim BE yang ditampilkan. Tidak render fitur/field yang tidak ada di response.
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  LoadingSpinner,
  Alert,
  Breadcrumb,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Badge,
} from "../../components";
import { assignmentsService, submissionsService } from "../../services";
import { useAsyncData } from "../../hooks/useAsyncData";
import { formatDate } from "../../utils/helpers";
import {
  FileText,
  Clock,
  CheckCircle,
  Star,
  Calendar,
  BookOpen,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentAssignments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("not_submitted");

  const {
    data,
    loading,
    error,
    refetch: fetchAssignments,
  } = useAsyncData(async () => {
    const [assignmentsData, submissionsData] = await Promise.all([
      assignmentsService.getRecentAssignments(20), // Increased limit
      submissionsService.getHistory(),
    ]);
    return {
      assignments: Array.isArray(assignmentsData) ? assignmentsData : [],
      submissions: Array.isArray(submissionsData) ? submissionsData : [],
    };
  }, []);

  const { assignments, submissions } = data || {
    assignments: [],
    submissions: [],
  };

  // Memoize the processed assignments to avoid re-calculation on re-render
  const processedAssignments = useMemo(() => {
    const getSubmissionInfo = (assignmentId) => {
      const submission = submissions.find(
        (s) => s.assignmentId === assignmentId
      );
      if (!submission) return { status: "not_submitted", grade: null };
      if (submission.status === "GRADED")
        return { status: "graded", grade: submission.grade ?? null };
      if (submission.status === "SUBMITTED")
        return { status: "submitted", grade: submission.grade ?? null };
      return { status: "draft", grade: null };
    };

    return assignments.map((assignment) => {
      const info = getSubmissionInfo(assignment.id);
      return { ...assignment, ...info };
    });
  }, [assignments, submissions]);

  const notSubmitted = processedAssignments.filter(
    (a) => a.status === "not_submitted" || a.status === "draft"
  );
  const submitted = processedAssignments.filter(
    (a) => a.status === "submitted"
  );
  const graded = processedAssignments.filter((a) => a.status === "graded");

  const getStatusBadge = (status, grade) => {
    switch (status) {
      case "not_submitted":
        return (
          <Badge color="yellow" className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> Belum Dikerjakan
          </Badge>
        );
      case "draft":
        return (
          <Badge color="gray" className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" /> Draft
          </Badge>
        );
      case "submitted":
        return (
          <Badge color="blue" className="flex items-center gap-1.5">
            <CheckCircle className="h-3 w-3" /> Menunggu Penilaian
          </Badge>
        );
      case "graded":
        return (
          <Badge color="green" className="flex items-center gap-1.5">
            <Star className="h-3 w-3" /> Dinilai: {grade}
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderContent = (assignmentList) => {
    if (assignmentList.length === 0) {
      const messages = {
        not_submitted: {
          title: "Tidak Ada Tugas Aktif",
          description: "Semua tugas sudah Anda kerjakan atau kumpulkan.",
        },
        submitted: {
          title: "Tidak Ada Tugas Menunggu Penilaian",
          description:
            "Tugas yang sudah dinilai akan pindah ke tab 'Sudah Dinilai'.",
        },
        graded: {
          title: "Belum Ada Tugas yang Dinilai",
          description:
            "Tugas yang sudah dinilai oleh instruktur akan muncul di sini.",
        },
      };
      const message = messages[activeTab];
      return (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50/30">
          <CardContent className="text-center py-20 px-6">
            <FileText className="h-12 w-12 text-[#23407a] mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {message.title}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              {message.description}
            </p>
          </CardContent>
        </Card>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {assignmentList.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            statusBadge={getStatusBadge(assignment.status, assignment.grade)}
          />
        ))}
      </div>
    );
  };

  return (
    <Container className="py-8">
      {/* Header Section */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#23407a] via-[#1a2f5c] to-[#162849] rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl"></div>
        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                <span className="text-white/70 text-sm font-medium">
                  Tugas Saya
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Daftar Tugas ✨
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                Daftar tugas dari semua kelas yang Anda ikuti. Kerjakan tugas
                aktif sebelum deadline!
              </p>
            </div>
          </div>
        </div>
      </div>

      <Breadcrumb />

      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="error" className="mb-8">
          <p>Gagal memuat daftar tugas: {error.message}</p>
          <Button size="sm" onClick={fetchAssignments} className="mt-3">
            Coba Lagi
          </Button>
        </Alert>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="mb-8 grid w-full grid-cols-3 gap-2 rounded-xl bg-gray-100 p-2 shadow-inner">
            {[
              {
                value: "not_submitted",
                label: "Belum Dikerjakan",
                count: notSubmitted.length,
                icon: Clock,
              },
              {
                value: "submitted",
                label: "Menunggu Nilai",
                count: submitted.length,
                icon: CheckCircle,
              },
              {
                value: "graded",
                label: "Sudah Dinilai",
                count: graded.length,
                icon: Star,
              },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                <span className="ml-2 text-xs bg-gray-200 data-[state=active]:bg-white/30 rounded px-2 py-0.5">
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="not_submitted">
                {renderContent(notSubmitted)}
              </TabsContent>
              <TabsContent value="submitted">
                {renderContent(submitted)}
              </TabsContent>
              <TabsContent value="graded">{renderContent(graded)}</TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      )}
    </Container>
  );
}

// Modernized AssignmentCard Component
function AssignmentCard({ assignment, statusBadge }) {
  const navigate = useNavigate();
  const canWorkOn =
    assignment.status === "not_submitted" || assignment.status === "draft";

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50"></div>

      <CardHeader className="relative z-10 border-b border-gray-200/80 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
          <BookOpen className="h-4 w-4 text-[#23407a]" />
          <span className="truncate">{assignment.class?.name || "Kelas"}</span>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#23407a] transition-colors truncate">
          {assignment.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 flex flex-1 flex-col p-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center text-sm text-red-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="font-medium">
              Deadline: {formatDate(assignment.deadline)}
            </span>
          </div>
          <div>{statusBadge}</div>
        </div>

        <div className="mt-6 pt-5 border-t border-gray-200/80 flex gap-3">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400"
            onClick={() => navigate(`/dashboard/assignments/${assignment.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Detail
          </Button>
          {assignment.active && (
            <Button
              size="sm"
              className="flex-1 bg-[#23407a] hover:bg-[#1a2f5c] text-white shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
              onClick={() =>
                canWorkOn &&
                navigate(`/dashboard/assignments/${assignment.id}/write`)
              }
              disabled={!canWorkOn}
              title={
                !canWorkOn
                  ? "Tugas sudah dikumpulkan/dinilai"
                  : "Kerjakan Tugas"
              }
            >
              {canWorkOn ? "Kerjakan" : "Lihat Hasil"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
