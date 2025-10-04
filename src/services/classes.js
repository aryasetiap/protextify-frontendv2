// src/services/classes.js
import api from "./api";

const classesService = {
  // Get all classes for current user
  getClasses: async () => {
    try {
      const response = await api.get("/classes");

      // Backend returns direct array, no enrollment wrapper needed
      const data = Array.isArray(response) ? response : [];

      return data.map((classItem) => ({
        id: classItem.id,
        name: classItem.name,
        description: classItem.description,
        instructorId: classItem.instructorId,
        classToken: classItem.classToken,
        createdAt: classItem.createdAt,
        updatedAt: classItem.updatedAt,
        // Backend provides instructor data in class detail, set placeholder for list
        instructor: classItem.instructor || { fullName: "Loading..." },
        // Backend provides assignments data, use it if available
        assignments: classItem.assignments || [],
        // Backend provides enrollments data, use it if available
        enrollments: classItem.enrollments || [],
        // Add count helper for UI components
        _count: {
          assignments: (classItem.assignments || []).length,
          enrollments: (classItem.enrollments || []).length,
        },
      }));
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  },

  // Get class detail by ID
  getClassById: async (id) => {
    try {
      const response = await api.get(`/classes/${id}`);

      // Backend provides full instructor and enrollments data
      return {
        ...response,
        instructor: response.instructor || { fullName: "Unknown" },
        enrollments: response.enrollments || [],
        assignments: response.assignments || [],
        // Add count helpers for UI components
        _count: {
          assignments: (response.assignments || []).length,
          enrollments: (response.enrollments || []).length,
        },
      };
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
