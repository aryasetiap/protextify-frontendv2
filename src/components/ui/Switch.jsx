// src/components/ui/Switch.jsx
import { useState } from "react";

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  ...props
}) {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    setIsChecked(newValue);
    onCheckedChange?.(newValue);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={handleToggle}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${
          isChecked
            ? "bg-[#23407a] focus:ring-[#23407a]"
            : "bg-gray-200 focus:ring-gray-500"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        focus:outline-none focus:ring-2 focus:ring-offset-2
      `}
      {...props}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${isChecked ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}
