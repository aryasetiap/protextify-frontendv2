// src/hooks/useAsyncData.js
import { useState, useEffect, useCallback } from "react";

export const useAsyncData = (apiCall, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    immediate = true,
    initialData = null,
    onSuccess = null,
    onError = null,
  } = options;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiCall();
      setData(response);

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      setError(err);

      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const mutate = useCallback((newData) => {
    setData(newData);
  }, []);

  return {
    data: data || initialData,
    loading,
    error,
    refetch,
    mutate,
  };
};

export default useAsyncData;
