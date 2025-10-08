// src/components/ui/ConnectionStatus.jsx
import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

// Tidak ada WebSocket, hanya status koneksi internet
export default function ConnectionStatus({
  showDetails = false,
  position = "bottom-right", // "top-left" | "top-right" | "bottom-left" | "bottom-right"
}) {
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

    return {
      status: "online",
      icon: Wifi,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
      message: "Online",
      description: "Koneksi internet aktif",
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
          </div>
        </div>
      </Card>
    </div>
  );
}
