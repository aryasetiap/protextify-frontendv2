// src/services/websocket.js
import { io } from "socket.io-client";
import { WS_URL } from "../utils/constants";

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
  }

  // Connect to WebSocket server
  connect(token) {
    try {
      if (this.socket?.connected) {
        console.log("WebSocket already connected");
        return;
      }

      this.socket = io(WS_URL, {
        auth: {
          token: token || localStorage.getItem("token"),
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.setupEventHandlers();

      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("🔌 WebSocket connecting to:", WS_URL);
      }
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  }

  // Setup event handlers
  setupEventHandlers() {
    this.socket.on("connect", () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;

      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("✅ WebSocket connected:", this.socket.id);
      }
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;

      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("❌ WebSocket disconnected:", reason);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      this.isConnected = false;
    });

    // Auto-save submission content
    this.socket.on("updateContentResponse", (data) => {
      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("📝 Content updated:", data);
      }
    });

    // Real-time notifications
    this.socket.on("notification", (notification) => {
      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("🔔 Notification received:", notification);
      }

      // Trigger custom listeners
      this.triggerListeners("notification", notification);
    });

    // Submission updates
    this.socket.on("submissionUpdated", (data) => {
      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("📄 Submission updated:", data);
      }

      this.triggerListeners("submissionUpdated", data);
    });

    // Submission list updates (for instructor monitoring)
    this.socket.on("submissionListUpdated", (data) => {
      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("📋 Submission list updated:", data);
      }

      this.triggerListeners("submissionListUpdated", data);
    });
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();

      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("🔌 WebSocket disconnected manually");
      }
    }
  }

  // Auto-save submission content
  updateContent(submissionId, content) {
    if (this.isConnected) {
      this.socket.emit("updateContent", {
        submissionId,
        content,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // Join room for monitoring (instructor)
  joinMonitoringRoom(assignmentId) {
    if (this.isConnected) {
      this.socket.emit("joinMonitoring", { assignmentId });
    }
  }

  // Leave monitoring room
  leaveMonitoringRoom(assignmentId) {
    if (this.isConnected) {
      this.socket.emit("leaveMonitoring", { assignmentId });
    }
  }

  // Join submission room (student)
  joinSubmissionRoom(submissionId) {
    if (this.isConnected) {
      this.socket.emit("joinSubmission", { submissionId });
    }
  }

  // Leave submission room
  leaveSubmissionRoom(submissionId) {
    if (this.isConnected) {
      this.socket.emit("leaveSubmission", { submissionId });
    }
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Trigger custom listeners
  triggerListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket listener for ${event}:`, error);
        }
      });
    }
  }

  // Check connection status
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  // Get socket ID
  getSocketId() {
    return this.socket?.id || null;
  }

  // Emit custom event
  emit(event, data) {
    if (this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn("WebSocket not connected. Cannot emit event:", event);
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
