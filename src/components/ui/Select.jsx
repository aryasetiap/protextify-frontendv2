import { forwardRef } from "react";
import { cn } from "@/utils";
import { ChevronDown } from "lucide-react";

const Select = forwardRef(
  (
    {
      className,
      children,
      label,
      error,
      helperText,
      disabled = false,
      required = false,
      placeholder,
      ...props
    },
    ref
  ) => {
    const selectClasses = cn(
      "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
      "appearance-none",
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

        <div className="relative">
          <select
            className={selectClasses}
            ref={ref}
            disabled={disabled}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>

          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
