// src/services/payments.js
import api from "./api";

const paymentsService = {
  // Create payment transaction with enhanced features
  createTransaction: async (transactionData, assignmentId) => {
    // Support both new object format dan legacy parameters
    const payload =
      typeof transactionData === "object" && transactionData.amount
        ? transactionData
        : {
            amount: transactionData, // legacy: amount parameter
            assignmentId, // legacy: assignmentId parameter
          };

    const response = await api.post("/payments/create-transaction", {
      ...payload,
      // Add client metadata
      clientInfo: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        platform: "web",
      },
    });
    return response;
  },

  // Legacy method signature support
  createTransactionLegacy: async (amount, assignmentId) => {
    return await paymentsService.createTransaction({
      amount,
      assignmentId,
    });
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

      // Backend sekarang mengembalikan format:
      // { data: [...], page: 1, limit: 10, total: 50, totalPages: 5 }
      return response;
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      throw error;
    }
  },

  // Legacy method name alias
  getTransactions: async (params = {}) => {
    return await paymentsService.getTransactionHistory(params);
  },
};

export default paymentsService;
