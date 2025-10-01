import React, { forwardRef } from "react";
import { cn } from "@/utils";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      className,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[#23407a] hover:bg-[#1a2f5c] active:bg-[#162849] text-white focus:ring-[#23407a] shadow-sm",
      secondary:
        "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 focus:ring-gray-500 shadow-sm",
      outline:
        "border-2 border-[#23407a] text-[#23407a] hover:bg-[#23407a] hover:text-white active:bg-[#1a2f5c] focus:ring-[#23407a]",
      ghost:
        "text-[#23407a] hover:bg-[#23407a]/10 active:bg-[#23407a]/20 focus:ring-[#23407a]",
      danger:
        "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus:ring-red-500 shadow-sm",
      success:
        "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white focus:ring-green-500 shadow-sm",
      warning:
        "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white focus:ring-yellow-500 shadow-sm",
    };

    const sizes = {
      xs: "px-2 py-1 text-xs h-7",
      sm: "px-3 py-1.5 text-sm h-8",
      md: "px-4 py-2 text-base h-10",
      lg: "px-6 py-3 text-lg h-12",
      xl: "px-8 py-4 text-xl h-14",
      icon: "h-10 w-10 p-0",
    };

    if (asChild) {
      return React.cloneElement(children, {
        className: cn(baseClasses, variants[variant], sizes[size], className),
        ref,
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
