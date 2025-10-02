// src/hooks/useStudentDashboard.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { classesService, submissionsService } from "../services";

export const useStudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    pendingSubmissions: 0,
    totalAssignments: 0,
    weeklyActivity: 0,
  });
  const [recentClasses, setRecentClasses] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel
      const [classesData, submissionsData] = await Promise.all([
        classesService.getClasses(),
        submissionsService.getHistory(),
      ]);

      // Calculate statistics
      const totalClasses = classesData.length;

      // Get all assignments from all classes
      const allAssignments = classesData.reduce((acc, cls) => {
        if (cls.assignments) {
          return acc.concat(
            cls.assignments.map((assignment) => ({
              ...assignment,
              className: cls.name,
            }))
          );
        }
        return acc;
      }, []);

      const totalAssignments = allAssignments.length;

      // Active assignments (deadline hasn't passed and assignment is active)
      const activeAssignments = allAssignments.filter(
        (a) => a.active && new Date(a.deadline) > new Date()
      ).length;

      // Completed and pending submissions
      const completedAssignments = submissionsData.filter(
        (s) => s.status === "SUBMITTED" || s.status === "GRADED"
      ).length;

      const pendingSubmissions = submissionsData.filter(
        (s) => s.status === "DRAFT"
      ).length;

      // Weekly activity (submissions in last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const weeklyActivity = submissionsData.filter(
        (s) => new Date(s.updatedAt) > oneWeekAgo
      ).length;

      // Upcoming deadlines (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const upcomingDeadlines = allAssignments
        .filter((a) => {
          const deadline = new Date(a.deadline);
          return deadline > new Date() && deadline <= nextWeek && a.active;
        })
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 3);

      setStats({
        totalClasses,
        activeAssignments,
        completedAssignments,
        pendingSubmissions,
        totalAssignments,
        weeklyActivity,
      });

      setRecentClasses(classesData.slice(0, 4));
      setRecentSubmissions(submissionsData.slice(0, 6));
      setUpcomingDeadlines(upcomingDeadlines);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

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
    upcomingDeadlines,
    refetch,
  };
};

export default useStudentDashboard;
