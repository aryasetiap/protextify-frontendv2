// src/services/upload.js
import api from "./api";

const uploadService = {
  // Upload file menggunakan endpoint umum dari dokumentasi
  uploadFile: async (file, options = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    if (options.assignmentId)
      formData.append("assignmentId", options.assignmentId);
    if (options.submissionId)
      formData.append("submissionId", options.submissionId);
    if (options.description)
      formData.append("description", options.description);

    const response = await api.post("/storage/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: options.onProgress,
    });

    return response;
  },

  // Health check sesuai dokumentasi
  getStorageHealth: async () => {
    return api.get("/storage/health");
  },

  // Refresh URL sesuai dokumentasi
  refreshFileUrl: async (cloudKey, filename, expires = 3600) => {
    return api.get(`/storage/refresh-url/${cloudKey}`, {
      params: { filename, expires },
    });
  },

  // Validasi file (utility function - tetap berguna)
  validateFile: (file, maxSize = 10 * 1024 * 1024, allowedTypes = []) => {
    const errors = [];

    if (file.size > maxSize) {
      errors.push(`File terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB`);
    }

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
};

export default uploadService;
