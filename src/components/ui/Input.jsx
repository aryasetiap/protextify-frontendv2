import { forwardRef, useState } from "react";
import { cn } from "@/utils";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    {
      className,
      type = "text",
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      showPasswordToggle = false,
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [currentType, setCurrentType] = useState(type);

    const handlePasswordToggle = () => {
      setShowPassword(!showPassword);
      setCurrentType(showPassword ? "password" : "text");
    };

    const inputClasses = cn(
      "flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200",
      "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
      error
        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:border-[#23407a] focus:ring-[#23407a]",
      leftElement && "pl-10",
      (rightElement || showPasswordToggle) && "pr-10",
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
          {leftElement && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftElement}
            </div>
          )}

          <input
            type={showPasswordToggle ? currentType : type}
            className={inputClasses}
            ref={ref}
            disabled={disabled}
            {...props}
          />

          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              onClick={handlePasswordToggle}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}

          {rightElement && !showPasswordToggle && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
