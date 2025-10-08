// src/services/storage.js
import api from "./api";

/**
 * Cek status kesehatan layanan storage dan cloud provider.
 * @returns {object} { status, timestamp, service, cloudStorage, features }
 */
const getStorageHealth = async () => {
  try {
    const response = await api.get("/storage/health");
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate pre-signed URL baru untuk file di cloud storage.
 * @param {string} cloudKey
 * @param {string} filename
 * @param {number} expires (optional, default: 3600)
 * @returns {object} { url, expiresIn, expiresAt }
 */
const getPresignedUrl = async (cloudKey, filename, expires = 3600) => {
  try {
    const response = await api.get(`/storage/refresh-url/${cloudKey}`, {
      params: { filename, expires },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Upload file attachment untuk assignment atau submission.
 * @param {File} file
 * @param {object} options { assignmentId?, submissionId?, description? }
 * @returns {object} { id, filename, size, mimeType, cloudKey, uploadedAt }
 */
const uploadFile = async (file, options = {}) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (options.assignmentId)
      formData.append("assignmentId", options.assignmentId);
    if (options.submissionId)
      formData.append("submissionId", options.submissionId);
    if (options.description)
      formData.append("description", options.description);

    const response = await api.post("/storage/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const storageService = {
  getStorageHealth,
  getPresignedUrl,
  uploadFile,
};

export default storageService;
