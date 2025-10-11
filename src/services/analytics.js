import api from "./api";

/**
 * Mengambil data agregat untuk dasbor instruktur.
 * @returns {Promise<object>} Data dashboard dari backend.
 */
const getInstructorDashboardData = async () => {
  try {
    const response = await api.get("/instructor/dashboard");
    return response;
  } catch (error) {
    console.error("Failed to fetch instructor dashboard data:", error);
    throw error;
  }
};

const analyticsService = {
  getInstructorDashboardData,
};

export default analyticsService;
