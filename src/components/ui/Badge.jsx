// src/components/ui/Badge.jsx
import { forwardRef } from "react";
import { cn } from "../../utils/helpers";

const Badge = forwardRef(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref
  ) => {
    const variants = {
      default: "bg-gray-100 text-gray-800",
      primary: "bg-[#23407a] text-white",
      secondary: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800",
    };

    const sizes = {
      default: "px-2.5 py-0.5 text-xs",
      sm: "px-2 py-0.5 text-xs",
      lg: "px-3 py-1 text-sm",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
