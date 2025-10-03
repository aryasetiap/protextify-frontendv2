// src/hooks/useWebSocket.js
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

export const useWebSocket = () => {
  const { isAuthenticated, token } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor browser online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update connection state berdasarkan kombinasi auth + online status
  const [connectionState, setConnectionState] = useState({
    isConnected: isAuthenticated && isOnline,
    isConnecting: false,
    lastConnected: isAuthenticated ? new Date() : null,
    error: null,
  });

  // Update connection state when auth or online status changes
  useEffect(() => {
    setConnectionState((prev) => ({
      ...prev,
      isConnected: isAuthenticated && isOnline,
      lastConnected:
        isAuthenticated && isOnline ? new Date() : prev.lastConnected,
    }));
  }, [isAuthenticated, isOnline]);

  // Mock implementation untuk sementara jika websocketService belum tersedia
  const mockWebSocketService = {
    connect: async () => Promise.resolve(),
    disconnect: () => {},
    isSocketConnected: () => false,
    on: (event, callback) => {
      console.log(`WebSocket mock: Registered listener for ${event}`);
    },
    off: (event, callback) => {
      console.log(`WebSocket mock: Removed listener for ${event}`);
    },
    emit: (event, data) => {
      console.log(`WebSocket mock: Emitted ${event}`, data);
    },
    joinRoom: (type, id) => {
      console.log(`WebSocket mock: Joined room ${type}:${id}`);
    },
    leaveRoom: (type, id) => {
      console.log(`WebSocket mock: Left room ${type}:${id}`);
    },
    updateContent: (submissionId, content, options) => {
      console.log(`WebSocket mock: Updated content for ${submissionId}`);
    },
    onConnectionChange: (callback) => () => {},
    waitForConnection: () => Promise.resolve(),
    getConnectionStats: () => ({}),
  };

  // Gunakan mock untuk sementara
  const websocketService = mockWebSocketService;

  const connect = useCallback(async () => {
    if (!isAuthenticated || !token) {
      console.warn("Cannot connect: Not authenticated");
      return;
    }

    try {
      setConnectionState((prev) => ({
        ...prev,
        isConnecting: true,
        error: null,
      }));

      await websocketService.connect(token);

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
  }, [isAuthenticated, token, websocketService]);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setConnectionState({
      isConnected: false,
      isConnecting: false,
      lastConnected: null,
      error: null,
    });
  }, [websocketService]);

  // Event handlers yang aman - SELALU return functions
  const on = useCallback(
    (event, callback) => {
      if (websocketService && typeof websocketService.on === "function") {
        websocketService.on(event, callback);
      }
    },
    [websocketService]
  );

  const off = useCallback(
    (event, callback) => {
      if (websocketService && typeof websocketService.off === "function") {
        websocketService.off(event, callback);
      }
    },
    [websocketService]
  );

  return {
    // Connection state
    ...connectionState,
    isConnected: isAuthenticated && isOnline, // ✅ KOMBINASI AUTH + ONLINE STATUS

    // Connection methods
    connect,
    disconnect,
    isSocketConnected: () => websocketService.isSocketConnected(),

    // Event methods - pastikan selalu return function
    on,
    off,

    // Other methods dengan safe defaults
    updateContent: useCallback(
      (submissionId, content, options = {}) => {
        if (
          websocketService &&
          typeof websocketService.updateContent === "function"
        ) {
          websocketService.updateContent(submissionId, content, options);
        }
      },
      [websocketService]
    ),

    joinMonitoring: useCallback(
      (assignmentId) => {
        if (
          websocketService &&
          typeof websocketService.joinRoom === "function"
        ) {
          websocketService.joinRoom("monitoring", assignmentId);
        }
      },
      [websocketService]
    ),

    leaveMonitoring: useCallback(
      (assignmentId) => {
        if (
          websocketService &&
          typeof websocketService.leaveRoom === "function"
        ) {
          websocketService.leaveRoom("monitoring", assignmentId);
        }
      },
      [websocketService]
    ),

    emit: useCallback(
      (event, data) => {
        if (websocketService && typeof websocketService.emit === "function") {
          websocketService.emit(event, data);
        }
      },
      [websocketService]
    ),
  };
};

export default useWebSocket;
