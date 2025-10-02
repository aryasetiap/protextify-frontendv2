// src/utils/touch.js
// filepath: src/utils/touch.js

/**
 * Touch gesture utilities for mobile optimization
 */

export class TouchHandler {
  constructor() {
    this.startX = 0;
    this.startY = 0;
    this.threshold = 50; // Minimum distance for swipe
    this.allowedTime = 300; // Maximum time for swipe
    this.startTime = 0;
  }

  handleTouchStart = (e) => {
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = new Date().getTime();
  };

  handleTouchEnd = (e, callbacks = {}) => {
    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const elapsedTime = new Date().getTime() - this.startTime;

    // Check if gesture is within time limit
    if (elapsedTime <= this.allowedTime) {
      const deltaX = endX - this.startX;
      const deltaY = endY - this.startY;

      // Check if movement is significant enough
      if (
        Math.abs(deltaX) >= this.threshold ||
        Math.abs(deltaY) >= this.threshold
      ) {
        // Determine direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe
          if (deltaX > 0) {
            callbacks.onSwipeRight?.(deltaX);
          } else {
            callbacks.onSwipeLeft?.(Math.abs(deltaX));
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            callbacks.onSwipeDown?.(deltaY);
          } else {
            callbacks.onSwipeUp?.(Math.abs(deltaY));
          }
        }
      }
    }
  };
}

/**
 * Custom hook for touch gestures
 */
import { useRef, useCallback } from "react";

export const useSwipeGesture = (callbacks = {}) => {
  const touchHandler = useRef(new TouchHandler());

  const onTouchStart = useCallback((e) => {
    touchHandler.current.handleTouchStart(e);
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      touchHandler.current.handleTouchEnd(e, callbacks);
    },
    [callbacks]
  );

  return {
    onTouchStart,
    onTouchEnd,
  };
};

/**
 * Touch feedback utility
 */
export const addTouchFeedback = (element) => {
  if (!element) return;

  const createRipple = (e) => {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: rgba(35, 64, 122, 0.1);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.3s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;

    // Add ripple animation keyframes if not already added
    if (!document.getElementById("ripple-styles")) {
      const style = document.createElement("style");
      style.id = "ripple-styles";
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    element.style.position = "relative";
    element.style.overflow = "hidden";
    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 300);
  };

  element.addEventListener("touchstart", createRipple);

  return () => {
    element.removeEventListener("touchstart", createRipple);
  };
};

/**
 * Optimize scrolling performance
 */
export const optimizeScrolling = (element) => {
  if (!element) return;

  // Add momentum scrolling for iOS
  element.style.webkitOverflowScrolling = "touch";

  // Add scroll snap for better UX
  element.style.scrollBehavior = "smooth";

  // Prevent rubber band effect where not needed
  element.addEventListener(
    "touchmove",
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = element;

      if (scrollTop === 0 && e.touches[0].clientY > e.touches[0].startY) {
        e.preventDefault();
      }

      if (
        scrollTop + clientHeight >= scrollHeight &&
        e.touches[0].clientY < e.touches[0].startY
      ) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
};

/**
 * Virtual keyboard utilities
 */
export const handleVirtualKeyboard = () => {
  let initialViewportHeight = window.innerHeight;

  const handleResize = () => {
    const currentHeight = window.innerHeight;
    const heightDifference = initialViewportHeight - currentHeight;

    // If height decreased significantly, virtual keyboard is likely open
    if (heightDifference > 150) {
      document.body.classList.add("keyboard-open");
      // Adjust viewport
      document.documentElement.style.setProperty(
        "--vh",
        `${currentHeight * 0.01}px`
      );
    } else {
      document.body.classList.remove("keyboard-open");
      // Reset viewport
      document.documentElement.style.setProperty(
        "--vh",
        `${initialViewportHeight * 0.01}px`
      );
    }
  };

  window.addEventListener("resize", handleResize);

  // Set initial viewport height
  document.documentElement.style.setProperty(
    "--vh",
    `${initialViewportHeight * 0.01}px`
  );

  return () => {
    window.removeEventListener("resize", handleResize);
  };
};
