// src/components/plagiarism/PlagiarismProgress.jsx
import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Loader, AlertCircle } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { plagiarismService } from "../../services";
import { useWebSocket } from "../../contexts/WebSocketContext";

export default function PlagiarismProgress({
  submissionId,
  jobId,
  onComplete,
}) {
  const [status, setStatus] = useState("queued"); // queued, active, completed, failed
  const [progress, setProgress] = useState(0);
  const [queueStats, setQueueStats] = useState(null);
  const [error, setError] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket || !jobId) return;

    // Listen for plagiarism check updates
    socket.on("plagiarismProgress", handleProgressUpdate);
    socket.on("plagiarismComplete", handleCheckComplete);
    socket.on("plagiarismFailed", handleCheckFailed);

    // Fetch initial queue stats
    fetchQueueStats();

    const interval = setInterval(fetchQueueStats, 5000); // Update every 5 seconds

    return () => {
      socket.off("plagiarismProgress", handleProgressUpdate);
      socket.off("plagiarismComplete", handleCheckComplete);
      socket.off("plagiarismFailed", handleCheckFailed);
      clearInterval(interval);
    };
  }, [socket, jobId]);

  const handleProgressUpdate = (data) => {
    if (data.jobId === jobId) {
      setStatus(data.status);
      setProgress(data.progress || 0);
      setEstimatedTime(data.estimatedTime);
    }
  };

  const handleCheckComplete = (data) => {
    if (data.submissionId === submissionId) {
      setStatus("completed");
      setProgress(100);
      onComplete?.(data);
    }
  };

  const handleCheckFailed = (data) => {
    if (data.jobId === jobId) {
      setStatus("failed");
      setError(data.error);
    }
  };

  const fetchQueueStats = async () => {
    try {
      const stats = await plagiarismService.getQueueStats();
      setQueueStats(stats);
    } catch (error) {
      console.error("Error fetching queue stats:", error);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "queued":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "active":
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "queued":
        return "Menunggu antrian...";
      case "active":
        return "Sedang memproses...";
      case "completed":
        return "Selesai!";
      case "failed":
        return "Gagal";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "queued":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium text-gray-900">
                Pengecekan Plagiarisme
              </h3>
              <p className="text-sm text-gray-600">Job ID: {jobId}</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#23407a] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Estimated Time */}
        {estimatedTime && status === "active" && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Perkiraan waktu: {estimatedTime}</span>
          </div>
        )}

        {/* Error Message */}
        {error && status === "failed" && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Error:</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Queue Statistics */}
        {queueStats && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Status Antrian
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-gray-900">
                  {queueStats.waiting}
                </div>
                <div className="text-gray-500">Menunggu</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-blue-600">
                  {queueStats.active}
                </div>
                <div className="text-gray-500">Aktif</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-600">
                  {queueStats.completed}
                </div>
                <div className="text-gray-500">Selesai</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-red-600">
                  {queueStats.failed}
                </div>
                <div className="text-gray-500">Gagal</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
