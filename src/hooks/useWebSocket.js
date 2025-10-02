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

  // Join monitoring room
  const joinMonitoring = useCallback((assignmentId) => {
    websocketService.joinMonitoringRoom(assignmentId);
  }, []);

  // Leave monitoring room
  const leaveMonitoring = useCallback((assignmentId) => {
    websocketService.leaveMonitoringRoom(assignmentId);
  }, []);

  // Join submission room
  const joinSubmission = useCallback((submissionId) => {
    websocketService.joinSubmissionRoom(submissionId);
  }, []);

  // Leave submission room
  const leaveSubmission = useCallback((submissionId) => {
    websocketService.leaveSubmissionRoom(submissionId);
  }, []);

  // Add event listener
  const on = useCallback((event, callback) => {
    websocketService.on(event, callback);
  }, []);

  // Remove event listener
  const off = useCallback((event, callback) => {
    websocketService.off(event, callback);
  }, []);

  // Get connection status
  const isConnected = useCallback(() => {
    return websocketService.isSocketConnected();
  }, []);

  return {
    updateContent,
    joinMonitoring,
    leaveMonitoring,
    joinSubmission,
    leaveSubmission,
    on,
    off,
    isConnected,
  };
};

export default useWebSocket;
