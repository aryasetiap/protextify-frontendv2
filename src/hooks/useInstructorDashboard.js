// src/hooks/useInstructorDashboard.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { analyticsService } from "../services";

export const useInstructorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {
      totalClasses: 0,
      totalStudents: 0,
      activeAssignments: 0,
      pendingGrading: 0,
      completionRate: 0,
      averageGrade: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
    },
    recentClasses: [],
    recentSubmissions: [],
    recentTransactions: [],
    analyticsData: {
      classActivity: [],
      submissionTrends: [],
      gradingTrends: [],
    },
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await analyticsService.getInstructorDashboardData();
      setData(response);
    } catch (err) {
      const formattedError = {
        statusCode: err?.response?.data?.statusCode || 500,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Gagal memuat data dashboard",
      };
      setError(formattedError);
      toast.error(formattedError.message);
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
    data,
    refetch,
  };
};

export default useInstructorDashboard;
