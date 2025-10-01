import { forwardRef } from "react";
import { cn } from "@/utils";

const Container = forwardRef(
  ({ className, size = "default", fluid = false, children, ...props }, ref) => {
    const sizes = {
      sm: "max-w-3xl",
      default: "max-w-7xl",
      lg: "max-w-screen-xl",
      xl: "max-w-screen-2xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          !fluid && sizes[size],
          fluid && "w-full max-w-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
export default Container;
