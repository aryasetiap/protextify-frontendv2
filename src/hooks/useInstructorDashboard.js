// src/hooks/useInstructorDashboard.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useWebSocket } from "./useWebSocket";

// Import services dengan safe fallback
import classesService from "../services/classes";
import paymentsService from "../services/payments";

export const useInstructorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    activeAssignments: 0,
    totalSubmissions: 0,
    pendingGrading: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    completionRate: 0,
    averageGrade: 0,
  });
  const [recentClasses, setRecentClasses] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    submissionTrends: [],
    gradingTrends: [],
    classActivity: [],
  });

  const websocketHook = useWebSocket();

  // Safe destructuring dengan default functions
  const { on = () => {}, off = () => {} } = websocketHook || {};

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all necessary data in parallel dengan safe error handling
      const [classesData, transactionsData] = await Promise.all([
        classesService.getClasses().catch((err) => {
          console.warn("Failed to fetch classes:", err);
          return [];
        }),
        paymentsService.getTransactionHistory({ limit: 5 }).catch((err) => {
          console.warn("Failed to fetch transactions:", err);
          return { data: [], total: 0 };
        }),
      ]);

      // Calculate comprehensive statistics
      const totalClasses = classesData.length;

      // Get all students across all classes
      const allStudents = new Set();
      let allAssignments = [];
      let allSubmissions = [];

      classesData.forEach((cls) => {
        // Add students from enrollments
        if (cls.enrollments) {
          cls.enrollments.forEach((enrollment) => {
            if (enrollment.student?.id) {
              allStudents.add(enrollment.student.id);
            }
          });
        }

        // Add assignments
        if (cls.assignments) {
          allAssignments = [...allAssignments, ...cls.assignments];

          // Add submissions from assignments
          cls.assignments.forEach((assignment) => {
            if (assignment.submissions) {
              allSubmissions = [...allSubmissions, ...assignment.submissions];
            }
          });
        }
      });

      const totalStudents = allStudents.size;
      const totalAssignments = allAssignments.length;
      const activeAssignments = allAssignments.filter(
        (a) => a.active && new Date(a.deadline) > new Date()
      ).length;

      const totalSubmissions = allSubmissions.length;
      const pendingGrading = allSubmissions.filter(
        (s) => s.status === "SUBMITTED"
      ).length;

      // Calculate revenue dari response backend yang baru
      const transactionsList = transactionsData.data || [];
      const totalRevenue = transactionsList
        .filter((t) => t.status === "SUCCESS")
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      // Calculate monthly revenue (transaksi bulan ini)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = transactionsList
        .filter((t) => {
          if (t.status !== "SUCCESS") return false;
          const transactionDate = new Date(t.createdAt);
          return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      // Calculate completion rate
      const completionRate =
        totalSubmissions > 0
          ? Math.round(
              (allSubmissions.filter((s) => s.status === "SUBMITTED").length /
                totalSubmissions) *
                100
            )
          : 0;

      // Calculate average grade
      const gradedSubmissions = allSubmissions.filter((s) => s.grade != null);
      const averageGrade =
        gradedSubmissions.length > 0
          ? Math.round(
              gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) /
                gradedSubmissions.length
            )
          : 0;

      setStats({
        totalClasses,
        totalStudents,
        totalAssignments,
        activeAssignments,
        totalSubmissions,
        pendingGrading,
        totalRevenue,
        monthlyRevenue,
        completionRate,
        averageGrade,
      });

      // Set recent data
      setRecentClasses(classesData.slice(0, 5));

      // Recent submissions dari semua kelas
      const recentSubs = allSubmissions
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);
      setRecentSubmissions(recentSubs);

      // Recent transactions dari response backend
      setRecentTransactions(transactionsList.slice(0, 5));

      // Prepare analytics data
      setAnalyticsData({
        submissionTrends: prepareSubmissionTrends(allSubmissions),
        gradingTrends: prepareGradingTrends(allSubmissions),
        classActivity: prepareClassActivity(classesData),
      });
    } catch (err) {
      console.error("Error fetching instructor dashboard data:", err);
      setError(err);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper functions for analytics
  const prepareSubmissionTrends = (submissions) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split("T")[0],
        count: submissions.filter((s) => {
          const subDate = new Date(s.createdAt);
          return (
            subDate.toISOString().split("T")[0] ===
            date.toISOString().split("T")[0]
          );
        }).length,
      };
    }).reverse();
    return last7Days;
  };

  const prepareGradingTrends = (submissions) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split("T")[0],
        graded: submissions.filter((s) => {
          if (s.status !== "GRADED") return false;
          const gradedDate = new Date(s.updatedAt);
          return (
            gradedDate.toISOString().split("T")[0] ===
            date.toISOString().split("T")[0]
          );
        }).length,
      };
    }).reverse();
    return last7Days;
  };

  const prepareClassActivity = (classes) => {
    return classes.map((cls) => ({
      name: cls.name,
      students: cls.enrollments?.length || 0,
      assignments: cls.assignments?.length || 0,
      activity: (cls.enrollments?.length || 0) * (cls.assignments?.length || 0),
    }));
  };

  // WebSocket event handlers dengan safety check
  useEffect(() => {
    const handleSubmissionUpdate = (data) => {
      console.log("Submission updated:", data);
      fetchDashboardData();
    };

    const handleNotification = (notification) => {
      console.log("Received notification:", notification);
      if (
        notification.type === "PAYMENT_SUCCESS" ||
        notification.type === "ASSIGNMENT_ACTIVATED"
      ) {
        fetchDashboardData();
      }
    };

    // Safe event binding
    if (typeof on === "function") {
      on("submissionListUpdated", handleSubmissionUpdate);
      on("notification", handleNotification);
    }

    return () => {
      // Safe cleanup
      if (typeof off === "function") {
        off("submissionListUpdated", handleSubmissionUpdate);
        off("notification", handleNotification);
      }
    };
  }, [on, off, fetchDashboardData]);

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
    recentSubmissions,
    recentTransactions,
    analyticsData,
    refetch,
  };
};

export default useInstructorDashboard;
