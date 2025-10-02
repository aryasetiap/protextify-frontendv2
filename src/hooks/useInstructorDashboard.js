// src/hooks/useInstructorDashboard.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  classesService,
  assignmentsService,
  submissionsService,
  paymentsService,
} from "../services";
import { useWebSocket } from "./useWebSocket";

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

  const { on, off } = useWebSocket();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all necessary data in parallel
      const [classesData, transactionsData] = await Promise.all([
        classesService.getClasses(),
        paymentsService.getTransactionHistory(),
      ]);

      // Calculate comprehensive statistics
      const totalClasses = classesData.length;

      // Get all students across all classes
      const allStudents = new Set();
      let allAssignments = [];
      let allSubmissions = [];

      classesData.forEach((cls) => {
        // Count unique students
        if (cls.enrollments) {
          cls.enrollments.forEach((enrollment) => {
            allStudents.add(enrollment.student.id);
          });
        }

        // Collect assignments
        if (cls.assignments) {
          allAssignments = allAssignments.concat(
            cls.assignments.map((assignment) => ({
              ...assignment,
              className: cls.name,
              studentCount: cls.enrollments?.length || 0,
            }))
          );

          // Collect submissions from assignments
          cls.assignments.forEach((assignment) => {
            if (assignment.submissions) {
              allSubmissions = allSubmissions.concat(
                assignment.submissions.map((submission) => ({
                  ...submission,
                  assignmentTitle: assignment.title,
                  className: cls.name,
                }))
              );
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

      // Calculate revenue
      const totalRevenue = transactionsData
        .filter((t) => t.status === "SUCCESS")
        .reduce((sum, t) => sum + t.amount, 0);

      // Monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = transactionsData
        .filter((t) => {
          const transactionDate = new Date(t.createdAt);
          return (
            t.status === "SUCCESS" &&
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate completion rate
      const completedSubmissions = allSubmissions.filter(
        (s) => s.status === "SUBMITTED" || s.status === "GRADED"
      ).length;
      const completionRate =
        totalSubmissions > 0
          ? (completedSubmissions / totalSubmissions) * 100
          : 0;

      // Calculate average grade
      const gradedSubmissions = allSubmissions.filter((s) => s.grade !== null);
      const averageGrade =
        gradedSubmissions.length > 0
          ? gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) /
            gradedSubmissions.length
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
        completionRate: Math.round(completionRate),
        averageGrade: Math.round(averageGrade),
      });

      setRecentClasses(classesData.slice(0, 5));
      setRecentSubmissions(allSubmissions.slice(0, 8));
      setRecentTransactions(transactionsData.slice(0, 5));

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
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        submissions: submissions.filter((s) => {
          const submissionDate = new Date(s.createdAt);
          return submissionDate.toDateString() === date.toDateString();
        }).length,
      };
    });
    return last7Days;
  };

  const prepareGradingTrends = (submissions) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        graded: submissions.filter((s) => {
          if (!s.gradedAt) return false;
          const gradedDate = new Date(s.gradedAt);
          return gradedDate.toDateString() === date.toDateString();
        }).length,
      };
    });
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

  // WebSocket event handlers
  useEffect(() => {
    const handleSubmissionUpdate = (data) => {
      // Refresh dashboard when submissions are updated
      fetchDashboardData();
    };

    const handleNotification = (notification) => {
      if (
        notification.type === "PAYMENT_SUCCESS" ||
        notification.type === "ASSIGNMENT_ACTIVATED"
      ) {
        fetchDashboardData();
      }
    };

    on("submissionListUpdated", handleSubmissionUpdate);
    on("notification", handleNotification);

    return () => {
      off("submissionListUpdated", handleSubmissionUpdate);
      off("notification", handleNotification);
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
