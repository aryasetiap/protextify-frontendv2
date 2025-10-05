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

  // Get recent assignments for student dashboard
  // Response structure: [{ id, title, deadline, class: { name }, active }]
  getRecentAssignments: async (limit = 3) => {
    try {
      const response = await api.get("/assignments/recent", {
        params: { limit },
      });

      // Pastikan response array dan transform sesuai ekspektasi FE
      if (!Array.isArray(response)) return [];

      return response.map((item) => ({
        id: item.id,
        title: item.title,
        deadline: item.deadline,
        class: item.class ? { name: item.class.name } : { name: "" },
        active: !!item.active,
      }));
    } catch (error) {
      console.error("Error fetching recent assignments:", error);
      return [];
    }
  },

  // Get assignments for specific class
  getClassAssignments: async (classId) => {
    try {
      const response = await api.get(`/classes/${classId}/assignments`);

      // Ensure response is array and transform if needed
      if (!Array.isArray(response)) return [];

      return response.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        instructions: assignment.instructions,
        deadline: assignment.deadline,
        classId: assignment.classId,
        active: !!assignment.active,
        expectedStudentCount: assignment.expectedStudentCount,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
        _count: assignment._count || { submissions: 0 },
      }));
    } catch (error) {
      console.error("Error fetching class assignments:", error);
      throw error;
    }
  },
};

export default assignmentsService;
