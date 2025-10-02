// src/services/plagiarism.js
import api from "./api";

const plagiarismService = {
  // Check plagiarism for submission (instructor only)
  checkPlagiarism: async (submissionId, options = {}) => {
    try {
      const response = await api.post(
        `/submissions/${submissionId}/check-plagiarism`,
        options
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get plagiarism report
  getPlagiarismReport: async (submissionId) => {
    try {
      const response = await api.get(
        `/submissions/${submissionId}/plagiarism-report`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get queue statistics (debugging)
  getQueueStats: async () => {
    try {
      const response = await api.get("/plagiarism/queue-stats");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cancel plagiarism check
  cancelPlagiarismCheck: async (jobId) => {
    try {
      const response = await api.delete(`/plagiarism/jobs/${jobId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default plagiarismService;
