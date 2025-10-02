// filepath: src/components/ui/LoadingSpinner.jsx
import { forwardRef } from "react";
import { cn } from "@/utils";

const LoadingSpinner = forwardRef(
  ({ className, size = "md", color = "primary", ...props }, ref) => {
    const sizes = {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    };

    const colors = {
      primary: "text-[#23407a]",
      white: "text-white",
      gray: "text-gray-500",
      success: "text-green-500",
      warning: "text-yellow-500",
      error: "text-red-500",
    };

    return (
      <svg
        ref={ref}
        className={cn("animate-spin", sizes[size], colors[color], className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
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
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

// Skeleton components
const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
};

const SkeletonText = ({ lines = 3, className, ...props }) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? "w-3/4" : "w-full" // Last line shorter
          )}
        />
      ))}
    </div>
  );
};

const SkeletonCard = ({ className, ...props }) => {
  return (
    <div
      className={cn("rounded-lg border border-gray-200 p-6", className)}
      {...props}
    >
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <SkeletonText lines={3} />
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
};

// Named exports
export { LoadingSpinner, Skeleton, SkeletonText, SkeletonCard };

// ✅ Add default export
export default LoadingSpinner;
