// src/utils/virtualKeyboard.js
// filepath: src/utils/virtualKeyboard.js
import { useEffect, useCallback } from "react";

/**
 * Handle virtual keyboard on mobile devices
 */
export const useVirtualKeyboard = () => {
  const handleKeyboardOpen = useCallback(() => {
    // Store original viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    // Add keyboard open class
    document.body.classList.add("keyboard-open");
  }, []);

  const handleKeyboardClose = useCallback(() => {
    // Reset viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    // Remove keyboard open class
    document.body.classList.remove("keyboard-open");
  }, []);

  useEffect(() => {
    let initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;

      // If height decreased significantly (more than 150px), keyboard is likely open
      if (heightDifference > 150) {
        handleKeyboardOpen();
      } else {
        handleKeyboardClose();
      }
    };

    // Set initial viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.classList.remove("keyboard-open");
    };
  }, [handleKeyboardOpen, handleKeyboardClose]);

  return {
    handleKeyboardOpen,
    handleKeyboardClose,
  };
};

/**
 * Optimize input focus for mobile
 */
export const useMobileInputFocus = () => {
  const scrollToInput = useCallback((inputElement) => {
    if (!inputElement) return;

    setTimeout(() => {
      // Scroll input into view with some offset
      const rect = inputElement.getBoundingClientRect();
      const offset = 100; // Offset from top

      if (rect.top < offset) {
        window.scrollBy({
          top: rect.top - offset,
          behavior: "smooth",
        });
      }
    }, 300); // Wait for keyboard animation
  }, []);

  return { scrollToInput };
};
