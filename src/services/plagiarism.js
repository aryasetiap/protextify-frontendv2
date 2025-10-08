// src/services/plagiarism.js
import api from "./api";

/**
 * Memicu pengecekan plagiarisme pada submission (instructor only)
 * @param {string} submissionId
 * @param {object} options { excluded_sources?, language?, country? }
 * @returns {object} { jobId, status, message }
 */
const checkPlagiarism = async (submissionId, options = {}) => {
  try {
    // Kirim hanya field yang didukung BE
    const payload = {};
    if (Array.isArray(options.excluded_sources)) {
      payload.excluded_sources = options.excluded_sources;
    }
    if (options.language) {
      payload.language = options.language;
    }
    if (options.country) {
      payload.country = options.country;
    }
    const response = await api.post(
      `/submissions/${submissionId}/check-plagiarism`,
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Mengambil hasil pengecekan plagiarisme dan URL laporan PDF
 * @param {string} submissionId
 * @returns {object} report sesuai BE
 */
const getPlagiarismReport = async (submissionId) => {
  try {
    const response = await api.get(
      `/submissions/${submissionId}/plagiarism-report`
    );
    // Response sudah sesuai BE, tidak perlu mapping
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Monitoring status antrian pengecekan plagiarisme (khusus instructor)
 * @returns {object} { waiting, active, completed, failed, total }
 */
const getQueueStats = async () => {
  try {
    const response = await api.get("/plagiarism/queue-stats");
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Membatalkan pengecekan plagiarisme (opsional, jika BE support)
 * @param {string} jobId
 * @returns {object} response BE
 */
const cancelPlagiarismCheck = async (jobId) => {
  try {
    const response = await api.delete(`/plagiarism/jobs/${jobId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat status pengecekan plagiarisme (opsional, jika BE support)
 * @param {string} submissionId
 * @returns {object} status pengecekan
 */
const getCheckStatus = async (submissionId) => {
  try {
    const response = await api.get(
      `/submissions/${submissionId}/plagiarism-status`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const plagiarismService = {
  checkPlagiarism,
  getPlagiarismReport,
  getQueueStats,
  cancelPlagiarismCheck,
  getCheckStatus,
};

export default plagiarismService;
