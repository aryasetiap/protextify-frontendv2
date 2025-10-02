// src/components/ui/PullToRefresh.jsx
// filepath: src/components/ui/PullToRefresh.jsx
import { useState, useRef, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "../../utils/helpers";

export default function PullToRefresh({
  children,
  onRefresh,
  disabled = false,
  threshold = 80,
  className,
}) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = useCallback(
    (e) => {
      if (disabled || refreshing) return;

      const container = containerRef.current;
      if (!container || container.scrollTop > 0) return;

      startY.current = e.touches[0].clientY;
    },
    [disabled, refreshing]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (disabled || refreshing) return;

      const container = containerRef.current;
      if (!container || container.scrollTop > 0) return;

      currentY.current = e.touches[0].clientY;
      const distance = Math.max(0, currentY.current - startY.current);

      if (distance > 0) {
        e.preventDefault();
        setPullDistance(distance);
        setPulling(distance > threshold);
      }
    },
    [disabled, refreshing, threshold]
  );

  const handleTouchEnd = useCallback(async () => {
    if (disabled || refreshing) return;

    if (pullDistance > threshold && pulling) {
      setRefreshing(true);
      try {
        await onRefresh?.();
      } catch (error) {
        console.error("Refresh error:", error);
      } finally {
        setRefreshing(false);
      }
    }

    setPulling(false);
    setPullDistance(0);
    startY.current = 0;
    currentY.current = 0;
  }, [disabled, refreshing, pullDistance, threshold, pulling, onRefresh]);

  const pullProgress = Math.min(pullDistance / threshold, 1);
  const shouldShowIndicator = pullDistance > 10;

  return (
    <div
      ref={containerRef}
      className={cn("pull-to-refresh relative overflow-y-auto", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <div
        className={cn(
          "pull-to-refresh-indicator",
          shouldShowIndicator && "opacity-100",
          !shouldShowIndicator && "opacity-0"
        )}
        style={{
          transform: `translateY(${Math.min(pullDistance * 0.5, 40)}px)`,
        }}
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <RefreshCw
            className={cn(
              "h-4 w-4 transition-transform",
              refreshing && "animate-spin",
              !refreshing && `rotate-${Math.floor(pullProgress * 360)}`,
              pulling && "text-[#23407a]"
            )}
          />
          <span>
            {refreshing
              ? "Refreshing..."
              : pulling
              ? "Release to refresh"
              : "Pull to refresh"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${Math.min(pullDistance * 0.3, 20)}px)`,
          transition: pulling ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
