// src/components/dashboard/ActivityTimeline.jsx
import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle, BookOpen } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../ui";

const ActivityTimeline = ({ submissions, className = "" }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "SUBMITTED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "GRADED":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "Dikumpulkan";
      case "GRADED":
        return "Dinilai";
      default:
        return "Draft";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-green-100";
      case "GRADED":
        return "bg-blue-100";
      default:
        return "bg-yellow-100";
    }
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mr-3"></div>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-[#23407a]" />
              Aktivitas Terbaru
            </CardTitle>
          </div>
          <Link to="/dashboard/submissions">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#23407a] hover:bg-[#23407a]/10"
            >
              <span className="hidden sm:inline">Lihat Semua</span>
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.length > 0 ? (
            submissions.map((submission, index) => (
              <div
                key={submission.id || index} // Tambahkan key unik di sini
                className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`relative flex-shrink-0 p-2 rounded-full ${getStatusColor(
                    submission.status
                  )}`}
                >
                  {getStatusIcon(submission.status)}
                  {index < submissions.length - 1 && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gray-200"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#23407a] transition-colors">
                    {submission.assignment?.title || "Tugas"}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                      {getStatusText(submission.status)}
                    </span>
                    <span>•</span>
                    <span>
                      {/* Gunakan submittedAt jika ada, fallback ke updatedAt */}
                      {new Date(
                        submission.submittedAt || submission.updatedAt
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {/* Nilai */}
                  {typeof submission.grade === "number" && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Nilai: {submission.grade}
                      </span>
                    </div>
                  )}
                  {/* Plagiarism Score */}
                  {typeof submission.plagiarismScore === "number" && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Plagiarisme: {submission.plagiarismScore}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#23407a]/10 to-[#3b5fa4]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-[#23407a]" />
              </div>
              <p className="text-gray-500 mb-4">Belum ada aktivitas terbaru</p>
              <Link to="/dashboard/classes">
                <Button size="sm" className="bg-[#23407a] hover:bg-[#1a2f5c]">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Lihat Kelas
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
