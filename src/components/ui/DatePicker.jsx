// src/components/ui/DatePicker.jsx
import { forwardRef } from "react";
import { Calendar } from "lucide-react";

const DatePicker = forwardRef(
  (
    {
      value,
      onChange,
      placeholder = "Select date",
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const handleChange = (e) => {
      const dateValue = e.target.value ? new Date(e.target.value) : null;
      onChange?.(dateValue);
    };

    const formatDateForInput = (date) => {
      if (!date) return "";
      if (typeof date === "string") return date.split("T")[0];
      return date.toISOString().split("T")[0];
    };

    return (
      <div className="relative">
        <input
          ref={ref}
          type="date"
          value={formatDateForInput(value)}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${className}
        `}
          {...props}
        />
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
