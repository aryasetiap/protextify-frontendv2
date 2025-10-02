// src/components/ui/ConnectionStatus.jsx
import { useState, useEffect } from "react";
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from "lucide-react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { Button } from "./Button";
import { Card } from "./Card";

export default function ConnectionStatus({
  showDetails = false,
  position = "bottom-right", // "top-left" | "top-right" | "bottom-left" | "bottom-right"
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnect, setShowReconnect] = useState(false);
  const { isSocketConnected, connect, disconnect, getConnectionStats } =
    useWebSocket();

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

  // Show reconnect option when offline for too long
  useEffect(() => {
    if (!isSocketConnected()) {
      const timer = setTimeout(() => {
        setShowReconnect(true);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowReconnect(false);
    }
  }, [isSocketConnected]);

  const handleReconnect = async () => {
    try {
      await disconnect();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await connect();
    } catch (error) {
      console.error("Manual reconnect failed:", error);
    }
  };

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        status: "offline",
        icon: WifiOff,
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-200",
        message: "Tidak ada koneksi internet",
        description: "Periksa koneksi internet Anda",
      };
    }

    if (!isSocketConnected()) {
      return {
        status: "disconnected",
        icon: AlertTriangle,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        borderColor: "border-yellow-200",
        message: "Terputus dari server",
        description: "Mencoba menyambung kembali...",
      };
    }

    return {
      status: "connected",
      icon: Wifi,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
      message: "Terhubung",
      description: "Semua fitur aktif",
    };
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  if (!showDetails) {
    // Simple indicator
    return (
      <div className={`fixed ${positionClasses[position]} z-40`}>
        <div
          className={`p-2 rounded-full ${statusInfo.bgColor} ${statusInfo.borderColor} border`}
          title={statusInfo.message}
        >
          <Icon className={`h-4 w-4 ${statusInfo.color}`} />
        </div>
      </div>
    );
  }

  // Detailed status card
  return (
    <div className={`fixed ${positionClasses[position]} z-40 max-w-xs`}>
      <Card className={`p-3 ${statusInfo.borderColor} border-2`}>
        <div className="flex items-start gap-3">
          <Icon
            className={`h-5 w-5 ${statusInfo.color} flex-shrink-0 mt-0.5`}
          />

          <div className="flex-1 min-w-0">
            <h4 className={`font-medium ${statusInfo.color}`}>
              {statusInfo.message}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {statusInfo.description}
            </p>

            {statusInfo.status === "connected" && (
              <div className="text-xs text-gray-500 mt-2">
                ID: {getConnectionStats().socketId?.substring(0, 8)}...
              </div>
            )}

            {showReconnect && statusInfo.status === "disconnected" && (
              <Button size="sm" onClick={handleReconnect} className="mt-2">
                <RefreshCw className="h-3 w-3 mr-1" />
                Sambung Ulang
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
