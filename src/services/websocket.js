// src/services/websocket.js
import { io } from "socket.io-client";
import { WS_URL } from "../utils/constants";
import { toast } from "react-hot-toast";

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.connectionCallbacks = new Set();
    this.disconnectionCallbacks = new Set();
    this.heartbeatInterval = null;
  }

  // Enhanced connection with better error handling
  connect(token) {
    try {
      if (this.socket?.connected) {
        console.log("WebSocket already connected");
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        this.socket = io(WS_URL, {
          auth: {
            token: token || localStorage.getItem("token"),
          },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: this.reconnectDelay,
          timeout: 10000,
          forceNew: true,
        });

        this.socket.on("connect", () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.notifyConnectionChange(true);

          if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
            console.log("✅ WebSocket connected:", this.socket.id);
          }

          resolve();
        });

        this.socket.on("connect_error", (error) => {
          console.error("WebSocket connection error:", error);
          this.isConnected = false;
          this.notifyConnectionChange(false);
          reject(error);
        });

        this.setupEventHandlers();
      });
    } catch (error) {
      console.error("WebSocket connection error:", error);
      return Promise.reject(error);
    }
  }

  // Enhanced event handlers
  setupEventHandlers() {
    if (!this.socket) return;

    // Connection events
    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
      this.stopHeartbeat();
      this.notifyConnectionChange(false);

      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("❌ WebSocket disconnected:", reason);
      }

      // Show user-friendly message for unexpected disconnections
      if (reason === "io server disconnect" || reason === "transport close") {
        toast.error("Koneksi terputus. Mencoba menyambung kembali...");
      }
    });

    this.socket.on("reconnect", (attemptNumber) => {
      this.isConnected = true;
      this.startHeartbeat();
      this.notifyConnectionChange(true);
      toast.success("Koneksi berhasil dipulihkan!");

      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log(
          "🔄 WebSocket reconnected after",
          attemptNumber,
          "attempts"
        );
      }
    });

    this.socket.on("reconnect_error", (error) => {
      console.error("WebSocket reconnection error:", error);

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error(
          "Tidak dapat menyambung ke server. Silakan refresh halaman."
        );
      }
    });

    // Application events
    this.socket.on("notification", (notification) => {
      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("🔔 Notification received:", notification);
      }

      this.triggerListeners("notification", notification);
      this.showNotification(notification);
    });

    this.socket.on("submissionUpdated", (data) => {
      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("📄 Submission updated:", data);
      }

      this.triggerListeners("submissionUpdated", data);
    });

    this.socket.on("submissionListUpdated", (data) => {
      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("📋 Submission list updated:", data);
      }

      this.triggerListeners("submissionListUpdated", data);
    });

    // Content auto-save response
    this.socket.on("updateContentResponse", (data) => {
      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("📝 Content updated:", data);
      }

      this.triggerListeners("updateContentResponse", data);
    });

    // Plagiarism events
    this.socket.on("plagiarismProgress", (data) => {
      this.triggerListeners("plagiarismProgress", data);
    });

    this.socket.on("plagiarismComplete", (data) => {
      this.triggerListeners("plagiarismComplete", data);
      toast.success("Pengecekan plagiarisme selesai!");
    });

    this.socket.on("plagiarismFailed", (data) => {
      this.triggerListeners("plagiarismFailed", data);
      toast.error("Pengecekan plagiarisme gagal!");
    });

    // Heartbeat/ping-pong
    this.socket.on("pong", () => {
      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log("💓 Heartbeat received");
      }
    });
  }

  // Heartbeat mechanism
  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected && this.socket) {
        this.socket.emit("ping");
      }
    }, 30000); // Every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Connection status callbacks
  onConnectionChange(callback) {
    this.connectionCallbacks.add(callback);
    return () => this.connectionCallbacks.delete(callback);
  }

  notifyConnectionChange(isConnected) {
    this.connectionCallbacks.forEach((callback) => {
      try {
        callback(isConnected);
      } catch (error) {
        console.error("Error in connection callback:", error);
      }
    });
  }

  // Enhanced notification display
  showNotification(notification) {
    const { type, message, data } = notification;

    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast(message, { icon: "⚠️" });
        break;
      case "info":
        toast(message, { icon: "ℹ️" });
        break;
      default:
        toast(message);
    }
  }

  // Enhanced room management
  joinRoom(roomType, roomId) {
    if (!this.isConnected || !this.socket) {
      console.warn("Cannot join room: WebSocket not connected");
      return;
    }

    const eventMap = {
      monitoring: "joinMonitoring",
      submission: "joinSubmission",
      class: "joinClass",
    };

    const event = eventMap[roomType];
    if (event) {
      this.socket.emit(event, { [`${roomType}Id`]: roomId });

      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log(`🏠 Joined ${roomType} room:`, roomId);
      }
    }
  }

  leaveRoom(roomType, roomId) {
    if (!this.isConnected || !this.socket) {
      return;
    }

    const eventMap = {
      monitoring: "leaveMonitoring",
      submission: "leaveSubmission",
      class: "leaveClass",
    };

    const event = eventMap[roomType];
    if (event) {
      this.socket.emit(event, { [`${roomType}Id`]: roomId });

      if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
        console.log(`🚪 Left ${roomType} room:`, roomId);
      }
    }
  }

  // Batch operations
  joinMultipleRooms(rooms) {
    rooms.forEach(({ type, id }) => this.joinRoom(type, id));
  }

  leaveAllRooms() {
    if (this.socket && this.isConnected) {
      this.socket.emit("leaveAllRooms");
    }
  }

  // Enhanced content update with debouncing
  updateContent(submissionId, content, options = {}) {
    if (!this.isConnected || !this.socket) {
      console.warn("Cannot update content: WebSocket not connected");
      return;
    }

    const payload = {
      submissionId,
      content,
      updatedAt: new Date().toISOString(),
      wordCount: content.split(/\s+/).filter((word) => word.length > 0).length,
      ...options,
    };

    this.socket.emit("updateContent", payload);
  }

  // Connection utilities
  waitForConnection(timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      const timer = setTimeout(() => {
        reject(new Error("WebSocket connection timeout"));
      }, timeout);

      const unsubscribe = this.onConnectionChange((isConnected) => {
        if (isConnected) {
          clearTimeout(timer);
          unsubscribe();
          resolve();
        }
      });
    });
  }

  // Enhanced cleanup
  disconnect() {
    this.stopHeartbeat();
    this.leaveAllRooms();

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnected = false;
    this.listeners.clear();
    this.connectionCallbacks.clear();
    this.disconnectionCallbacks.clear();
    this.notifyConnectionChange(false);

    if (import.meta.env.VITE_ENABLE_ROUTER_LOGGING === "true") {
      console.log("🔌 WebSocket disconnected manually");
    }
  }

  // Existing methods remain the same...
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

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

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  getSocketId() {
    return this.socket?.id || null;
  }

  emit(event, data) {
    if (this.isConnected && this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn("WebSocket not connected. Cannot emit event:", event);
    }
  }

  // Maintenance methods
  getConnectionStats() {
    return {
      isConnected: this.isConnected,
      socketId: this.getSocketId(),
      reconnectAttempts: this.reconnectAttempts,
      listenerCount: this.listeners.size,
      rooms: this.socket?.rooms || [],
    };
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
