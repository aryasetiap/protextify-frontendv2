import { forwardRef } from "react";
import { cn } from "@/utils";

const Textarea = forwardRef(
  (
    {
      className,
      label,
      error,
      helperText,
      disabled = false,
      required = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaClasses = cn(
      "flex min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200",
      "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
      "resize-vertical",
      error
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:border-[#23407a] focus:ring-[#23407a]",
      className
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          className={textareaClasses}
          ref={ref}
          disabled={disabled}
          rows={rows}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
