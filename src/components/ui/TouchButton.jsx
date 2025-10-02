// src/components/ui/TouchButton.jsx
// filepath: src/components/ui/TouchButton.jsx
import { forwardRef, useRef, useEffect } from "react";
import { cn } from "../../utils/helpers";
import { addTouchFeedback } from "../../utils/touch";

const TouchButton = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      className,
      ripple = true,
      ...props
    },
    ref
  ) => {
    const buttonRef = useRef(null);
    const finalRef = ref || buttonRef;

    useEffect(() => {
      if (ripple && finalRef.current && !disabled) {
        const cleanup = addTouchFeedback(finalRef.current);
        return cleanup;
      }
    }, [ripple, disabled]);

    const baseClasses = cn(
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "touch-manipulation", // Improve touch response
      "select-none", // Prevent text selection on touch
      "active:scale-95", // Subtle scale feedback
      // Ensure minimum touch target size
      "min-h-[44px] min-w-[44px]"
    );

    const variants = {
      primary: cn(
        "bg-[#23407a] hover:bg-[#1a2f5c] text-white",
        "focus:ring-[#23407a]",
        "active:bg-[#152844]"
      ),
      secondary: cn(
        "bg-gray-200 hover:bg-gray-300 text-gray-900",
        "focus:ring-gray-500",
        "active:bg-gray-400"
      ),
      outline: cn(
        "border-2 border-[#23407a] text-[#23407a] hover:bg-[#23407a] hover:text-white",
        "focus:ring-[#23407a]",
        "active:bg-[#1a2f5c] active:border-[#1a2f5c]"
      ),
      ghost: cn(
        "text-[#23407a] hover:bg-[#23407a]/10",
        "focus:ring-[#23407a]",
        "active:bg-[#23407a]/20"
      ),
      danger: cn(
        "bg-red-600 hover:bg-red-700 text-white",
        "focus:ring-red-500",
        "active:bg-red-800"
      ),
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-6 py-4 text-lg",
    };

    return (
      <button
        ref={finalRef}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

TouchButton.displayName = "TouchButton";

export default TouchButton;
