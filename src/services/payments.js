// src/services/payments.js
import api from "./api";
import { PAYMENT_CONFIG } from "../utils/constants";

const paymentsService = {
  // Create payment transaction with enhanced features
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post("/payments/create-transaction", {
        ...transactionData,
        // Add client metadata
        clientInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          platform: "web",
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction history with filters
  getTransactionHistory: async (filters = {}) => {
    try {
      const response = await api.get("/payments/transactions", {
        params: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          status: filters.status,
          startDate: filters.startDate,
          endDate: filters.endDate,
          assignmentId: filters.assignmentId,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction detail by ID
  getTransactionById: async (transactionId) => {
    try {
      const response = await api.get(`/payments/transactions/${transactionId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get payment status with polling capability
  getPaymentStatus: async (orderId) => {
    try {
      const response = await api.get(`/payments/status/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cancel payment
  cancelPayment: async (transactionId) => {
    try {
      const response = await api.patch(
        `/payments/transactions/${transactionId}/cancel`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get payment methods available
  getPaymentMethods: async () => {
    try {
      const response = await api.get("/payments/methods");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get payment statistics
  getPaymentStats: async (period = "30d") => {
    try {
      const response = await api.get("/payments/stats", {
        params: { period },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Generate payment URL for specific payment method
  generatePaymentUrl: async (transactionId, paymentMethod) => {
    try {
      const response = await api.post(
        `/payments/transactions/${transactionId}/generate-url`,
        { paymentMethod }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentsService;
