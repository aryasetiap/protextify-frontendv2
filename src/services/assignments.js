// src/services/assignments.js
import api from "./api";

const assignmentsService = {
  // Get all assignments (for admin or instructor)
  getAssignments: async () => {
    try {
      const response = await api.get("/assignments");
      return response;
    } catch (error) {
      throw error;
    }
  },

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
        throw {
          ...error,
          message: "Data assignment tidak valid. Periksa kembali form Anda.",
        };
      } else if (error.response?.status === 403) {
        throw {
          ...error,
          message:
            "Anda tidak memiliki akses untuk membuat assignment di kelas ini.",
        };
      } else if (error.response?.status === 404) {
        throw {
          ...error,
          message: "Kelas tidak ditemukan.",
        };
      }
      throw error;
    }
  },

  // Get assignment detail by ID
  getAssignmentById: async (id) => {
    try {
      const response = await api.get(`/assignments/${id}`);
      return response;
    } catch (error) {
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
        throw {
          ...error,
          message: "Kelas tidak ditemukan atau Anda tidak memiliki akses.",
        };
      } else if (error.response?.status === 403) {
        throw {
          ...error,
          message:
            "Anda tidak memiliki akses untuk melihat tugas di kelas ini.",
        };
      }
      throw error;
    }
  },
};

export default assignmentsService;
