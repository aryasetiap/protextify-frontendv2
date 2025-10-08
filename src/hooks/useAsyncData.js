// src/hooks/useAsyncData.js
import { useState, useEffect, useCallback } from "react";

export const useAsyncData = (asyncFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      // Format error dari BE: { statusCode, message }
      const formattedError = {
        statusCode: err?.response?.data?.statusCode || err?.statusCode || 400,
        message:
          err?.response?.data?.message || err?.message || "Terjadi kesalahan",
      };
      setError(formattedError);
      setData(null); // Reset data on error
      console.error("Async data fetch error:", formattedError);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useAsyncData;
