// src/services/submissions.js
import api from "./api";

const submissionsService = {
  // Create submission for assignment (student only)
  createSubmission: async (assignmentId, submissionData) => {
    try {
      const response = await api.post(
        `/assignments/${assignmentId}/submissions`,
        submissionData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get submission detail by ID
  getSubmissionById: async (submissionId) => {
    try {
      const response = await api.get(`/submissions/${submissionId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update submission content (auto-save)
  updateSubmissionContent: async (submissionId, content) => {
    try {
      const response = await api.patch(`/submissions/${submissionId}/content`, {
        content,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit final submission (student only)
  submitSubmission: async (submissionId) => {
    try {
      const response = await api.post(`/submissions/${submissionId}/submit`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Grade submission (instructor only)
  gradeSubmission: async (submissionId, gradeData) => {
    try {
      const response = await api.patch(
        `/submissions/${submissionId}/grade`,
        gradeData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get submission history for student
  getHistory: async () => {
    try {
      const response = await api.get("/submissions/history");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Download submission file
  downloadSubmission: async (submissionId, format = "pdf") => {
    try {
      const response = await api.get(`/submissions/${submissionId}/download`, {
        params: { format },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default submissionsService;
