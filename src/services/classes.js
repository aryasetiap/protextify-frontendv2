// src/services/classes.js
import api from "./api";

const classesService = {
  // Get all classes for current user
  getClasses: async () => {
    try {
      const response = await api.get("/classes");

      // Pastikan response adalah array
      const data = Array.isArray(response) ? response : [];

      // Transform response sesuai struktur baru dari BE
      const transformedClasses = data.map((classObj) => ({
        id: classObj.id,
        name: classObj.name,
        description: classObj.description,
        instructor: classObj.instructor
          ? {
              id: classObj.instructor.id,
              fullName: classObj.instructor.fullName,
            }
          : { id: "", fullName: "Instruktur" },
        assignments: Array.isArray(classObj.assignments)
          ? classObj.assignments.map((a) => ({
              id: a.id,
              title: a.title,
              deadline: a.deadline,
              active: a.active,
              // Tambahan field lain jika ada
            }))
          : [],
        enrollments: Array.isArray(classObj.enrollments)
          ? classObj.enrollments.map((e) => ({
              student: {
                id: e.student?.id,
                fullName: e.student?.fullName,
              },
            }))
          : [],
        createdAt: classObj.createdAt,
        classToken: classObj.classToken,
        currentUserEnrollment: classObj.currentUserEnrollment
          ? {
              id: classObj.currentUserEnrollment.id,
              joinedAt: classObj.currentUserEnrollment.joinedAt,
            }
          : undefined,
      }));

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
