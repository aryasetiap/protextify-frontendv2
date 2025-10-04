// src/services/plagiarism.js
import api from "./api";

export const plagiarismService = {
  // Check plagiarism for submission (instructor only)
  checkPlagiarism: async (submissionId, options = {}) => {
    return await api.post(
      `/submissions/${submissionId}/check-plagiarism`,
      options
    );
  },

  // Get plagiarism report
  getPlagiarismReport: async (submissionId) => {
    return await api.get(`/submissions/${submissionId}/plagiarism-report`);
  },

  // Get queue statistics
  getQueueStats: async () => {
    return await api.get("/plagiarism/queue-stats");
  },
};

export default plagiarismService;
