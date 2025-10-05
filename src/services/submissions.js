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
      // Pastikan response array dan lakukan transform agar kompatibel
      if (!Array.isArray(response)) return [];

      return response.map((item) => ({
        id: item.id,
        assignmentId: item.assignmentId,
        content: item.content,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        submittedAt: item.submittedAt || null, // field baru, fallback null
        grade: typeof item.grade === "number" ? item.grade : null, // field baru, fallback null
        plagiarismScore:
          typeof item.plagiarismScore === "number"
            ? item.plagiarismScore
            : null, // field baru, fallback null
        assignment: item.assignment
          ? {
              id: item.assignment.id,
              title: item.assignment.title,
              deadline: item.assignment.deadline,
              class: item.assignment.class
                ? { name: item.assignment.class.name }
                : { name: "" }, // pastikan assignment.class.name selalu ada
            }
          : null,
        // Tambahkan field lain jika diperlukan
      }));
    } catch (error) {
      console.error("Error fetching submissions history:", error);
      return []; // Return empty array on error
    }
  },

  // Enhanced download with format options
  downloadSubmission: async (submissionId, format = "pdf", options = {}) => {
    try {
      const response = await api.get(`/submissions/${submissionId}/download`, {
        params: {
          format,
          ...options,
        },
        responseType: "blob", // Important for file downloads
      });

      // Create download link
      const filename =
        response.headers["content-disposition"]
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || `submission-${submissionId}.${format}`;

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
      throw error;
    }
  },

  // Download with custom options
  downloadSubmissionWithOptions: async (submissionId, downloadOptions = {}) => {
    const {
      format = "pdf",
      includeAttachments = true,
      watermark = null,
      quality = "high",
    } = downloadOptions;

    try {
      const response = await api.post(
        `/submissions/${submissionId}/download-custom`,
        {
          format,
          includeAttachments,
          watermark,
          quality,
        },
        {
          responseType: "blob",
        }
      );

      // Handle download response
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `submission-${submissionId}-custom.${format}`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, filename, size: response.data.size };
    } catch (error) {
      throw error;
    }
  },

  // Bulk download submissions
  downloadMultipleSubmissions: async (submissionIds, format = "zip") => {
    try {
      const response = await api.post(
        "/submissions/download-bulk",
        {
          submissionIds,
          format,
        },
        {
          responseType: "blob",
        }
      );

      const filename = `submissions-bulk-${
        new Date().toISOString().split("T")[0]
      }.${format}`;

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
      throw error;
    }
  },
};

export default submissionsService;
