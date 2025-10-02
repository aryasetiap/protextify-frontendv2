// src/contexts/WebSocketContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { WS_URL } from "../utils/constants";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io(WS_URL, {
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      newSocket.on("connect", () => {
        setConnected(true);
        console.log("WebSocket connected");
      });

      newSocket.on("disconnect", () => {
        setConnected(false);
        console.log("WebSocket disconnected");
      });

      // Plagiarism-specific listeners
      newSocket.on("plagiarismProgress", (data) => {
        console.log("Plagiarism progress:", data);
        // Handle progress updates in components
      });

      newSocket.on("plagiarismComplete", (data) => {
        console.log("Plagiarism check complete:", data);
        // Trigger UI updates when check completes
      });

      newSocket.on("plagiarismFailed", (data) => {
        console.error("Plagiarism check failed:", data);
        // Handle failure notifications
      });

      // General notification listener
      newSocket.on("notification", (data) => {
        console.log("Notification received:", data);
        // Handle real-time notifications
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  const value = {
    socket,
    connected,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within WebSocketProvider");
  }
  return context;
};

export default WebSocketContext;
