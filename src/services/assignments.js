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
      throw error;
    }
  },

  // Get assignments for a class
  getAssignments: async (classId) => {
    try {
      const response = await api.get(`/classes/${classId}/assignments`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get assignment detail by ID
  getAssignmentById: async (assignmentId) => {
    try {
      const response = await api.get(`/assignments/${assignmentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get submissions for assignment (instructor only)
  getAssignmentSubmissions: async (classId, assignmentId) => {
    try {
      const response = await api.get(
        `/classes/${classId}/assignments/${assignmentId}/submissions`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update assignment (instructor only)
  updateAssignment: async (assignmentId, updateData) => {
    try {
      const response = await api.patch(
        `/assignments/${assignmentId}`,
        updateData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete assignment (instructor only)
  deleteAssignment: async (assignmentId) => {
    try {
      const response = await api.delete(`/assignments/${assignmentId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default assignmentsService;
