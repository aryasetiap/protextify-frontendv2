// src/hooks/usePaymentTracker.js
import { useState, useEffect, useRef } from "react";
import { paymentsService } from "../services";
import { PAYMENT_CONFIG, PAYMENT_STATUS } from "../utils/constants";

export const usePaymentTracker = (orderId, options = {}) => {
  const [status, setStatus] = useState(PAYMENT_STATUS.PENDING);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const {
    pollingInterval = PAYMENT_CONFIG.POLLING_INTERVAL,
    maxAttempts = PAYMENT_CONFIG.MAX_POLLING_ATTEMPTS,
    timeout = PAYMENT_CONFIG.PAYMENT_TIMEOUT,
    onStatusChange,
    onSuccess,
    onFailure,
    onTimeout,
  } = options;

  // Check payment status
  const checkStatus = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const response = await paymentsService.getPaymentStatus(orderId);

      const newStatus = response.status;

      if (newStatus !== status) {
        setStatus(newStatus);

        // Call status change callback
        if (onStatusChange) {
          onStatusChange(newStatus, response);
        }

        // Handle final states
        if (newStatus === PAYMENT_STATUS.SUCCESS) {
          stopPolling();
          if (onSuccess) onSuccess(response);
        } else if (
          [
            PAYMENT_STATUS.FAILED,
            PAYMENT_STATUS.CANCELLED,
            PAYMENT_STATUS.EXPIRED,
          ].includes(newStatus)
        ) {
          stopPolling();
          if (onFailure) onFailure(response);
        }
      }

      setAttempts((prev) => prev + 1);

      // Stop if max attempts reached
      if (attempts >= maxAttempts) {
        stopPolling();
        setError("Maksimum polling attempts reached");
      }
    } catch (err) {
      setError(err.message);
      console.error("Payment status check error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start polling
  const startPolling = () => {
    if (intervalRef.current) return; // Already polling

    // Initial check
    checkStatus();

    // Set up polling interval
    intervalRef.current = setInterval(checkStatus, pollingInterval);

    // Set up timeout
    if (timeout > 0) {
      timeoutRef.current = setTimeout(() => {
        stopPolling();
        setError("Payment timeout reached");
        if (onTimeout) onTimeout();
      }, timeout);
    }
  };

  // Stop polling
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Manual status check
  const refreshStatus = () => {
    checkStatus();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  // Auto-start polling when orderId is available
  useEffect(() => {
    if (orderId && !intervalRef.current) {
      startPolling();
    }
  }, [orderId]);

  return {
    status,
    loading,
    error,
    attempts,
    startPolling,
    stopPolling,
    refreshStatus,
    isPolling: !!intervalRef.current,
  };
};
