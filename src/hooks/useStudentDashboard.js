// src/hooks/useStudentDashboard.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useWebSocket } from "./useWebSocket";

// Import services dengan safe fallback
import classesService from "../services/classes";
import submissionsService from "../services/submissions";

export const useStudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    pendingSubmissions: 0,
  });
  const [recentClasses, setRecentClasses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);

  // WebSocket for real-time updates
  const { socket, isConnected } = useWebSocket();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch classes and submissions in parallel dengan error handling
      const [classesData, submissionsData] = await Promise.allSettled([
        classesService.getClasses(),
        submissionsService.getHistory?.() || Promise.resolve([]),
      ]);

      // Safe handling untuk classesData dengan struktur baru
      const safeClassesData =
        classesData.status === "fulfilled" && Array.isArray(classesData.value)
          ? classesData.value
          : [];

      // Safe handling untuk submissionsData
      const safeSubmissionsData =
        submissionsData.status === "fulfilled" &&
        Array.isArray(submissionsData.value)
          ? submissionsData.value
          : [];

      // Calculate statistics from transformed data
      const totalClasses = safeClassesData.length;

      // Since assignments data is not yet available from backend, set to 0
      const activeAssignments = 0;
      const completedAssignments = safeSubmissionsData.filter(
        (s) => s?.status === "SUBMITTED"
      ).length;
      const pendingSubmissions = safeSubmissionsData.filter(
        (s) => s?.status === "DRAFT"
      ).length;

      setStats({
        totalClasses,
        activeAssignments,
        completedAssignments,
        pendingSubmissions,
      });

      setRecentClasses(safeClassesData.slice(0, 3));
      setRecentAssignments([]); // Empty until assignments endpoint is ready

      // Create activity timeline
      const timeline = [
        ...safeClassesData.map((cls) => ({
          type: "class_joined",
          title: `Bergabung ke kelas ${cls?.name || "Unknown"}`,
          time: cls?.enrolledAt || cls?.createdAt || new Date().toISOString(),
          icon: "class",
        })),
        ...safeSubmissionsData
          .filter((submission) => submission && submission.assignment)
          .map((submission) => ({
            type: "submission",
            title: `${
              submission.status === "SUBMITTED" ? "Mengumpulkan" : "Mengerjakan"
            } ${submission.assignment?.title || "Unknown Assignment"}`,
            time: submission.updatedAt || new Date().toISOString(),
            icon: "assignment",
          })),
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 10);

      setActivityTimeline(timeline);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  // Setup WebSocket listeners
  useEffect(() => {
    if (socket && isConnected) {
      socket.on("notification", (data) => {
        if (data.type === "new_assignment" || data.type === "class_update") {
          fetchDashboardData();
        }
      });

      socket.on("submissionUpdated", () => {
        fetchDashboardData();
      });

      return () => {
        socket.off("notification");
        socket.off("submissionUpdated");
      };
    }
  }, [socket, isConnected, fetchDashboardData]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    loading,
    error,
    stats,
    recentClasses,
    recentAssignments,
    activityTimeline,
    refetch,
    isConnected,
  };
};

export default useStudentDashboard;
