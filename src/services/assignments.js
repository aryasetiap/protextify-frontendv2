// src/services/assignments.js
import api from "./api";

const assignmentsService = {
  // Create assignment in class (instructor only)
  createAssignment: async (classId, assignmentData) => {
    try {
      const response = await api.post(
        `/classes/${classId}/assignments`,
        assignmentData
      );
      return response;
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 422) {
        const err = new Error(
          "Data assignment tidak valid. Periksa kembali form Anda."
        );
        err.name = error.name;
        err.response = error.response;
        throw err;
      } else if (error.response?.status === 403) {
        const err = new Error(
          "Anda tidak memiliki akses untuk membuat assignment di kelas ini."
        );
        err.name = error.name;
        err.response = error.response;
        throw err;
      } else if (error.response?.status === 404) {
        const err = new Error("Kelas tidak ditemukan.");
        err.name = error.name;
        err.response = error.response;
        throw err;
      }
      throw error;
    }
  },

  // Get assignments for a specific class
  getClassAssignments: async (classId) => {
    try {
      const response = await api.get(`/classes/${classId}/assignments`);
      return response;
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 404) {
        const err = new Error(
          "Kelas tidak ditemukan atau Anda tidak memiliki akses."
        );
        err.name = error.name;
        err.response = error.response;
        throw err;
      } else if (error.response?.status === 403) {
        const err = new Error(
          "Anda tidak memiliki akses untuk melihat tugas di kelas ini."
        );
        err.name = error.name;
        err.response = error.response;
        throw err;
      }
      throw error;
    }
  },
};

export default assignmentsService;
