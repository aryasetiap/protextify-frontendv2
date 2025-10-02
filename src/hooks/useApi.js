// src/hooks/useApi.js
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const {
      loadingMessage = null,
      successMessage = null,
      errorMessage = null,
      showErrorToast = true,
      showSuccessToast = false,
    } = options;

    try {
      setLoading(true);
      setError(null);

      if (loadingMessage) {
        toast.loading(loadingMessage);
      }

      const response = await apiCall();

      if (successMessage && showSuccessToast) {
        toast.success(successMessage);
      }

      return response;
    } catch (err) {
      setError(err);

      if (showErrorToast) {
        const message =
          errorMessage ||
          err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan";
        toast.error(message);
      }

      throw err;
    } finally {
      setLoading(false);
      toast.dismiss(); // Dismiss loading toast
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset,
  };
};

export default useApi;
