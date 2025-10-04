// src/services/submissions.js
import api from "./api";
import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";

const submissionsService = {
  // Create submission for assignment (student only)
  createSubmission: async (assignmentId, submissionData) => {
    return await api.post(
      `/assignments/${assignmentId}/submissions`,
      submissionData
    );
  },

  // Get submission detail by ID
  getSubmissionById: async (submissionId) => {
    return await api.get(`/submissions/${submissionId}`);
  },

  // Update submission content (auto-save)
  updateContent: async (submissionId, content) => {
    return await api.patch(`/submissions/${submissionId}/content`, {
      content,
    });
  },

  // Submit final submission (student only)
  submitAssignment: async (submissionId) => {
    return await api.post(`/submissions/${submissionId}/submit`);
  },

  // Grade submission (instructor only)
  gradeSubmission: async (submissionId, gradeData) => {
    return await api.patch(`/submissions/${submissionId}/grade`, gradeData);
  },

  // Get submission history for student
  getHistory: async () => {
    try {
      const response = await api.get("/submissions/history");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Error fetching submissions history:", error);
      return []; // Return empty array on error for UI stability
    }
  },

  // Enhanced download with format options
  downloadSubmission: async (submissionId, format = "pdf", options = {}) => {
    try {
      // GANTI - Gunakan axios langsung untuk download karena api instance sudah return response.data
      const response = await axios.get(
        `${API_BASE_URL}/submissions/${submissionId}/download`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            format,
            ...options,
          },
          responseType: "blob", // Important for file downloads
        }
      );

      // Handle the blob response properly
      const contentDisposition = response.headers?.["content-disposition"];
      const filename =
        contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
        `submission-${submissionId}.${format}`;

      // Create download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(
          "Submission tidak ditemukan atau belum ada konten untuk didownload."
        );
      }
      throw error;
    }
  },

  // Get submissions for assignment (instructor only)
  getAssignmentSubmissions: async (classId, assignmentId) => {
    return await api.get(
      `/classes/${classId}/assignments/${assignmentId}/submissions`
    );
  },

  // Get submission versions
  getSubmissionVersions: async (submissionId) => {
    const response = await api.get(`/submissions/${submissionId}/versions`);
    return response;
  },

  // Get specific version
  getSubmissionVersion: async (submissionId, version) => {
    return await api.get(`/submissions/${submissionId}/versions/${version}`);
  },

  // Get class history (instructor only)
  getClassHistory: async (classId) => {
    try {
      const response = await api.get(`/classes/${classId}/history`);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Error fetching class history:", error);
      return [];
    }
  },
};

export default submissionsService;
