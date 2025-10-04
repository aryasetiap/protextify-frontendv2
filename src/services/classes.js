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
  },

  // Create new class (instructor only)
  createClass: async (classData) => {
    const response = await api.post("/classes", classData);
    return response;
  },

  // Join class using token (student only)
  joinClass: async (classToken) => {
    try {
      const response = await api.post("/classes/join", { classToken });
      return response;
    } catch (error) {
      // Add specific error handling
      if (error.response?.status === 404) {
        const err404 = new Error(
          "Token kelas tidak ditemukan. Periksa kembali token yang dimasukkan."
        );
        err404.status = 404;
        err404.original = error;
        throw err404;
      } else if (error.response?.status === 409) {
        const err409 = new Error("Anda sudah bergabung di kelas ini.");
        err409.status = 409;
        err409.original = error;
        throw err409;
      } else if (error.response?.status === 400) {
        const err400 = new Error(
          "Format token tidak valid. Token harus 8 karakter."
        );
        err400.status = 400;
        err400.original = error;
        throw err400;
      }
      throw error;
    }
  },

  // Get assignments for a class
  getClassAssignments: async (classId) => {
    const response = await api.get(`/classes/${classId}/assignments`);
    return response;
  },

  // Get class history (instructor only)
  getClassHistory: async (classId) => {
    const response = await api.get(`/classes/${classId}/history`);
    return response;
  },
};

export default classesService;
