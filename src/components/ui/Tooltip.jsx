// src/components/ui/Tooltip.jsx
import { useState } from "react";

export default function Tooltip({ children, content, placement = "top" }) {
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
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap ${
            placement === "top"
              ? "-top-8 left-1/2 transform -translate-x-1/2"
              : placement === "bottom"
              ? "-bottom-8 left-1/2 transform -translate-x-1/2"
              : placement === "left"
              ? "top-1/2 -left-2 transform -translate-y-1/2 -translate-x-full"
              : "top-1/2 -right-2 transform -translate-y-1/2 translate-x-full"
          }`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
