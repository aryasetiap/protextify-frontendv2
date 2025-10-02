// src/services/payments.js
import api from "./api";

const paymentsService = {
  // Create payment transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post(
        "/payments/create-transaction",
        transactionData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction history
  getTransactionHistory: async () => {
    try {
      const response = await api.get("/payments/transactions");
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

  // Get payment status
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
};

export default paymentsService;
