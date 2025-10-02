// src/components/ui/Tooltip.jsx
import { useState } from "react";
import { cn } from "../../utils/helpers";

export default function Tooltip({ children, content, side = "top" }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap",
            side === "top" && "bottom-full left-1/2 transform -translate-x-1/2 mb-1",
            side === "bottom" && "top-full left-1/2 transform -translate-x-1/2 mt-1",
            side === "left" && "right-full top-1/2 transform -translate-y-1/2 mr-1",
            side === "right" && "left-full top-1/2 transform -translate-y-1/2 ml-1"
          )}
        >
          {content}
          <div
            className={cn(
              "absolute w-0 h-0 border-2 border-transparent border-t-gray-900",
              side === "top" && "top-full left-1/2 transform -translate-x-1/2",
              side === "bottom" && "bottom-full left-1/2 transform -translate-x-1/2 border-t-transparent border-b-gray-900",
              side === "left" && "left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 border-t-transparent",
              side === "right" && "right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 border-t-transparent"
            )}
          />
        </div>
      )}
    </div>
  );
}