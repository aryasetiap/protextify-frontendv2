// src/components/ui/DropdownMenu.jsx
import { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/helpers";

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {children({ isOpen, setIsOpen })}
    </div>
  );
}

export function DropdownMenuTrigger({ children, asChild, ...props }) {
  return children;
}

export function DropdownMenuContent({
  children,
  align = "start",
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "absolute z-50 min-w-32 overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg",
        align === "end" && "right-0",
        align === "start" && "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onClick,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
