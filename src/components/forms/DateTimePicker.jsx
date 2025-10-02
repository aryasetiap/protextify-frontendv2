// src/components/forms/DateTimePicker.jsx
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

export default function DateTimePicker({
  label,
  value,
  onChange,
  error,
  minDate = new Date(),
  placeholder = "Pilih tanggal dan waktu...",
}) {
  const formatDisplayValue = (value) => {
    if (!value) return "";
    try {
      const date = new Date(value);
      return date.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const handleDateTimeChange = (e) => {
    const dateTimeValue = e.target.value;
    if (dateTimeValue) {
      onChange(dateTimeValue);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="datetime-local"
          value={value ? new Date(value).toISOString().slice(0, 16) : ""}
          onChange={handleDateTimeChange}
          min={
            minDate ? new Date(minDate).toISOString().slice(0, 16) : undefined
          }
          className={`
            w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:border-transparent
            ${error ? "border-red-500" : "border-gray-300"}
          `}
          placeholder={placeholder}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <CalendarIcon className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {value && (
        <p className="mt-1 text-xs text-gray-500">
          {formatDisplayValue(value)}
        </p>
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
