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
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Aktivitas Terbaru
          </CardTitle>
          <Link to="/dashboard/submissions">
            <Button variant="ghost" size="sm">
              Lihat Semua
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.length > 0 ? (
            submissions.map((submission, index) => (
              <div key={submission.id} className="flex items-start space-x-3">
                <div
                  className={`p-2 rounded-full ${getStatusColor(
                    submission.status
                  )}`}
                >
                  {getStatusIcon(submission.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {submission.assignment?.title || "Tugas"}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{getStatusText(submission.status)}</span>
                    <span className="mx-2">•</span>
                    <span>
                      {new Date(submission.updatedAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                  {submission.grade && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Nilai: {submission.grade}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Belum ada aktivitas terbaru</p>
              <Link to="/dashboard/classes">
                <Button size="sm">
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
