// src/hooks/useWebSocket.js
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import websocketService from "../services/websocket";

export const useWebSocket = () => {
  const { isAuthenticated, token } = useAuth();
  const [connectionState, setConnectionState] = useState({
    isConnected: false,
    isConnecting: false,
    lastConnected: null,
    error: null,
  });
  const isConnectedRef = useRef(false);

  // Enhanced connection management
  const connect = useCallback(async () => {
    if (!isAuthenticated || !token) {
      console.warn("Cannot connect: Not authenticated");
      return;
    }

    if (isConnectedRef.current) {
      console.log("Already connected");
      return;
    }

    try {
      setConnectionState((prev) => ({
        ...prev,
        isConnecting: true,
        error: null,
      }));
      await websocketService.connect(token);
      isConnectedRef.current = true;
      setConnectionState({
        isConnected: true,
        isConnecting: false,
        lastConnected: new Date(),
        error: null,
      });
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      setConnectionState({
        isConnected: false,
        isConnecting: false,
        lastConnected: null,
        error: error.message,
      });
    }
  }, [isAuthenticated, token]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    isConnectedRef.current = false;
    setConnectionState({
      isConnected: false,
      isConnecting: false,
      lastConnected: null,
      error: null,
    });
  }, []);

  // Monitor connection status
  useEffect(() => {
    const unsubscribe = websocketService.onConnectionChange((isConnected) => {
      setConnectionState((prev) => ({
        ...prev,
        isConnected,
        isConnecting: false,
        lastConnected: isConnected ? new Date() : prev.lastConnected,
        error: isConnected ? null : prev.error,
      }));
    });

    return unsubscribe;
  }, []);

  // Auto-connect when authenticated
  useEffect(() => {
    if (isAuthenticated && token && !isConnectedRef.current) {
      connect();
    }

    return () => {
      if (isConnectedRef.current) {
        disconnect();
      }
    };
  }, [isAuthenticated, token, connect, disconnect]);

  // Auto-reconnect when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (isAuthenticated && token && !websocketService.isSocketConnected()) {
        console.log("Browser back online, attempting to reconnect...");
        setTimeout(connect, 1000);
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [isAuthenticated, token, connect]);

  // Auto-save content
  const updateContent = useCallback((submissionId, content, options = {}) => {
    if (!websocketService.isSocketConnected()) {
      throw new Error("Tidak dapat menyimpan: koneksi terputus");
    }
    websocketService.updateContent(submissionId, content, options);
  }, []);

  // Enhanced monitoring functions
  const joinMonitoring = useCallback((assignmentId) => {
    websocketService.joinRoom("monitoring", assignmentId);
  }, []);

  const leaveMonitoring = useCallback((assignmentId) => {
    websocketService.leaveRoom("monitoring", assignmentId);
  }, []);

  // Join submission room for student
  const joinSubmission = useCallback((submissionId) => {
    websocketService.joinRoom("submission", submissionId);
  }, []);

  const leaveSubmission = useCallback((submissionId) => {
    websocketService.leaveRoom("submission", submissionId);
  }, []);

  // Subscribe to events
  const subscribe = useCallback((event, callback) => {
    websocketService.on(event, callback);
    return () => websocketService.off(event, callback);
  }, []);

  // Check connection status
  const isSocketConnected = useCallback(() => {
    return websocketService.isSocketConnected();
  }, []);

  const getConnectionStats = useCallback(() => {
    return {
      ...websocketService.getConnectionStats(),
      ...connectionState,
    };
  }, [connectionState]);

  return {
    // Connection state
    ...connectionState,

    // Connection methods
    connect,
    disconnect,
    isSocketConnected,
    getConnectionStats,

    // Communication methods
    updateContent,
    joinMonitoring,
    leaveMonitoring,
    joinSubmission,
    leaveSubmission,
    subscribe,

    // Utilities
    waitForConnection:
      websocketService.waitForConnection.bind(websocketService),
    emit: websocketService.emit.bind(websocketService),
  };
};

export default useWebSocket;
