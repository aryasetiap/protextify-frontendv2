// src/services/classes.js
import api from "./api";

const classesService = {
  // Get all classes for current user
  getClasses: async () => {
    try {
      const response = await api.get("/classes");

      // Pastikan response adalah array
      const data = Array.isArray(response) ? response : [];

      // Transform response to match frontend expectations
      // Backend returns enrollment objects with nested class data
      const transformedClasses = data.map((enrollment) => {
        // Safe handling untuk enrollment object
        const classData = enrollment?.class || {};

        return {
          ...classData,
          // Add enrollment metadata
          enrollmentId: enrollment?.id,
          enrolledAt: enrollment?.joinedAt,
          // Transform assignments if they exist (set empty array for now)
          assignments: classData.assignments || [],
          // Transform enrollments if they exist (we don't have this data yet)
          enrollments: [],
          // Add instructor info (we need to get this from backend later)
          instructor: classData.instructor || { fullName: "Instructor" },
          // Add student enrollment info for this user
          currentUserEnrollment: {
            id: enrollment?.id,
            joinedAt: enrollment?.joinedAt,
          },
        };
      });

      return transformedClasses;
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  },

  // Get class detail by ID
  getClassById: async (id) => {
    try {
      const response = await api.get(`/classes/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new class (instructor only)
  createClass: async (classData) => {
    try {
      const response = await api.post("/classes", classData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Join class using token (student only)
  joinClass: async (classToken) => {
    try {
      const response = await api.post("/classes/join", { classToken });
      return response;
    } catch (error) {
      // Add specific error handling
      if (error.response?.status === 404) {
        throw {
          ...error,
          message:
            "Token kelas tidak ditemukan. Periksa kembali token yang dimasukkan.",
        };
      } else if (error.response?.status === 409) {
        throw {
          ...error,
          message: "Anda sudah bergabung di kelas ini.",
        };
      } else if (error.response?.status === 400) {
        throw {
          ...error,
          message: "Format token tidak valid. Token harus 8 karakter.",
        };
      }
      throw error;
    }
  },

  // Preview class by token (before joining)
  previewClass: async (classToken) => {
    try {
      const response = await api.get(`/classes/preview/${classToken}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get assignments for a class
  getClassAssignments: async (classId) => {
    try {
      const response = await api.get(`/classes/${classId}/assignments`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get class history (instructor only)
  getClassHistory: async (classId) => {
    try {
      const response = await api.get(`/classes/${classId}/history`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update class (instructor only)
  updateClass: async (classId, updateData) => {
    try {
      const response = await api.patch(`/classes/${classId}`, updateData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete class (instructor only)
  deleteClass: async (classId) => {
    try {
      const response = await api.delete(`/classes/${classId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Regenerate class token (instructor only)
  regenerateClassToken: async (classId) => {
    try {
      const response = await api.post(`/classes/${classId}/regenerate-token`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default classesService;
