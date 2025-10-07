import { useState, useEffect } from "react";
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
} from "../../components";
import { assignmentsService } from "../../services";
import { formatDate } from "../../utils/helpers";

export default function StudentAssignments() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAssignments() {
      setLoading(true);
      setError(null);
      try {
        const data = await assignmentsService.getRecentAssignments(10);
        setAssignments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAssignments();
  }, []);

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

      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Loading/Error State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="error" className="mb-8">
          <p>Gagal memuat daftar tugas: {error.message}</p>
        </Alert>
      ) : (
        <div>
          {/* Tugas List */}
          {assignments.length === 0 ? (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-blue-50/30">
              <CardContent className="text-center py-16">
                <FileText className="h-12 w-12 text-[#23407a] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Belum Ada Tugas
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Tugas akan muncul di sini ketika instruktur membuat tugas baru
                  di kelas Anda.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {assignments.map((assignment) => (
                <CardTugas
                  key={assignment.id}
                  assignment={assignment}
                  onKerjakan={() =>
                    navigate(`/dashboard/assignments/${assignment.id}/write`)
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Container>
  );
}

// CardTugas Component
function CardTugas({ assignment, onKerjakan }) {
  return (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#23407a] transition-colors truncate">
              {assignment.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-1">
              Kelas: {assignment.class?.name || "-"}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Deadline: {formatDate(assignment.deadline)}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Status:{" "}
              {assignment.active ? (
                <span className="text-green-600 font-medium">Aktif</span>
              ) : (
                <span className="text-gray-500 font-medium">Tidak Aktif</span>
              )}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Jumlah Submission: {assignment._count?.submissions || 0}
            </p>
            {assignment.submissions?.length > 0 && (
              <p className="text-sm text-gray-600 mb-1">
                Grade: {assignment.submissions[0]?.grade ?? "-"}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 flex justify-end">
        {assignment.active && (
          <Button
            size="sm"
            className="bg-[#23407a] hover:bg-[#1a2f5c] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={onKerjakan}
          >
            Kerjakan
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
