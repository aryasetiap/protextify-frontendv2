// src/components/ui/Checkbox.jsx
import { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "../../utils/helpers";

const Checkbox = forwardRef(
  ({ className, checked, onChange, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => !disabled && onChange?.(!checked)}
        disabled={disabled}
        className={cn(
          "inline-flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white text-white transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[#23407a] focus:ring-offset-2",
          checked && "bg-[#23407a] border-[#23407a]",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {checked && <Check className="h-3 w-3" />}
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
