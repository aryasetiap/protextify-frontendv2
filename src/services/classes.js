// src/services/classes.js
import api from "./api";

const classesService = {
  // Get all classes for current user
  getClasses: async () => {
    try {
      const response = await api.get("/classes");
      return response;
    } catch (error) {
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
