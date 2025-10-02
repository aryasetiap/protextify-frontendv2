// src/hooks/useWebSocket.js
import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import websocketService from "../services/websocket";

export const useWebSocket = () => {
  const { isAuthenticated, token } = useAuth();
  const isConnectedRef = useRef(false);

  // Connect WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated && token && !isConnectedRef.current) {
      websocketService.connect(token);
      isConnectedRef.current = true;
    }

    return () => {
      if (isConnectedRef.current) {
        websocketService.disconnect();
        isConnectedRef.current = false;
      }
    };
  }, [isAuthenticated, token]);

  // Auto-save content
  const updateContent = useCallback((submissionId, content) => {
    websocketService.updateContent(submissionId, content);
  }, []);

  // Enhanced monitoring functions
  const joinMonitoring = useCallback((assignmentId) => {
    websocketService.joinMonitoringRoom(assignmentId);
  }, []);

  const leaveMonitoring = useCallback((assignmentId) => {
    websocketService.leaveMonitoringRoom(assignmentId);
  }, []);

  // Join submission room for student
  const joinSubmission = useCallback((submissionId) => {
    websocketService.joinSubmissionRoom(submissionId);
  }, []);

  const leaveSubmission = useCallback((submissionId) => {
    websocketService.leaveSubmissionRoom(submissionId);
  }, []);

  // Subscribe to events
  const subscribe = useCallback((event, callback) => {
    websocketService.on(event, callback);

    // Return unsubscribe function
    return () => {
      websocketService.off(event, callback);
    };
  }, []);

  // Check connection status
  const isSocketConnected = useCallback(() => {
    return websocketService.isSocketConnected();
  }, []);

  return {
    updateContent,
    joinMonitoring,
    leaveMonitoring,
    joinSubmission,
    leaveSubmission,
    subscribe,
    isSocketConnected,
  };
};

export default useWebSocket;
