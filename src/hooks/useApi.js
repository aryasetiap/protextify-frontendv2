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

    let toastId;
    try {
      setLoading(true);
      setError(null);

      if (loadingMessage) {
        toastId = toast.loading(loadingMessage, { id: "api-loading" });
      }

      const response = await apiCall();

      if (successMessage && showSuccessToast) {
        toast.success(successMessage);
      }

      return response;
    } catch (err) {
      // Format error dari BE: { statusCode, message }
      const message =
        errorMessage ||
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan";

      setError({
        statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
        message,
      });

      if (showErrorToast) {
        toast.error(message);
      }

      throw err;
    } finally {
      setLoading(false);
      if (loadingMessage && toastId) toast.dismiss(toastId);
      else toast.dismiss();
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
