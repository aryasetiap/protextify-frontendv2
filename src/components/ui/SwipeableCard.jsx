// src/components/ui/SwipeableCard.jsx
// filepath: src/components/ui/SwipeableCard.jsx
import { useState, useRef } from "react";
import { cn } from "../../utils/helpers";
import { useSwipeGesture } from "../../utils/touch";

export default function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className,
  ...props
}) {
  const [translateX, setTranslateX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef(null);

  const swipeGesture = useSwipeGesture({
    onSwipeLeft: (distance) => {
      if (onSwipeLeft && distance > 100) {
        setIsAnimating(true);
        setTranslateX(-100);
        setTimeout(() => {
          onSwipeLeft();
          resetPosition();
        }, 200);
      } else {
        resetPosition();
      }
    },
    onSwipeRight: (distance) => {
      if (onSwipeRight && distance > 100) {
        setIsAnimating(true);
        setTranslateX(100);
        setTimeout(() => {
          onSwipeRight();
          resetPosition();
        }, 200);
      } else {
        resetPosition();
      }
    },
  });

  const resetPosition = () => {
    setTranslateX(0);
    setIsAnimating(false);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Actions */}
      {leftAction && (
        <div className="absolute inset-y-0 left-0 flex items-center justify-start pl-4 bg-green-500 text-white w-20">
          {leftAction}
        </div>
      )}
      {rightAction && (
        <div className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 bg-red-500 text-white w-20">
          {rightAction}
        </div>
      )}

      {/* Main Card */}
      <div
        ref={cardRef}
        className={cn(
          "relative bg-white transform transition-transform duration-200 ease-out",
          isAnimating && "duration-200",
          className
        )}
        style={{
          transform: `translateX(${translateX}%)`,
        }}
        {...swipeGesture}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
