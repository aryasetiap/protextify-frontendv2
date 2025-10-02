// src/services/upload.js
import api from "./api";

const uploadService = {
  // Upload file untuk submission
  uploadSubmissionFile: async (file, submissionId, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("submissionId", submissionId);

      const response = await api.post("/storage/upload/submission", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (file, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await api.post("/storage/upload/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload file dokumen assignment
  uploadAssignmentDocument: async (file, assignmentId, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("assignmentId", assignmentId);

      const response = await api.post("/storage/upload/assignment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get file info dengan pre-signed URL
  getFileInfo: async (fileId) => {
    try {
      const response = await api.get(`/storage/files/${fileId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Refresh pre-signed URL
  refreshFileUrl: async (cloudKey, filename, expires = 3600) => {
    try {
      const response = await api.get(`/storage/refresh-url/${cloudKey}`, {
        params: { filename, expires },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Download file dengan pre-signed URL
  downloadFile: async (fileId, filename) => {
    try {
      const response = await api.get(`/storage/download/${fileId}`, {
        params: { filename },
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete file
  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/storage/files/${fileId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Validate file before upload
  validateFile: (file, maxSize = 10 * 1024 * 1024, allowedTypes = []) => {
    const errors = [];

    // Check file size (default 10MB)
    if (file.size > maxSize) {
      errors.push(`File terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB`);
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(
        `Tipe file tidak didukung. Hanya: ${allowedTypes.join(", ")}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Get upload progress
  getUploadProgress: (loaded, total) => {
    return Math.round((loaded * 100) / total);
  },
};

export default uploadService;
