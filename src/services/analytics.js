import api from "./api";

/**
 * Mengambil data statistik dan agregat untuk dasbor analitik instruktur.
 * @param {string} range - Rentang waktu ('7d', '30d', '90d').
 * @returns {Promise<object>} Data analytics dari backend.
 */
const getInstructorAnalytics = async (range = "7d") => {
  try {
    const response = await api.get("/instructor/analytics", {
      params: { range },
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch instructor analytics:", error);
    throw error;
  }
};

const analyticsService = {
  getInstructorAnalytics,
};

export default analyticsService;
