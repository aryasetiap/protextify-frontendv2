// src/components/ui/Badge.jsx
import { forwardRef } from "react";
import { cn } from "@/utils";

const Badge = forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[#23407a] text-white",
      outline: "border border-[#23407a] text-[#23407a] bg-transparent",
      glass: "bg-white/10 backdrop-blur-sm border border-white/20 text-white",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
export default Badge;
