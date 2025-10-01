import { forwardRef } from "react";
import { cn } from "@/utils";

const Stack = forwardRef(
  (
    {
      className,
      direction = "column",
      spacing = 4,
      align = "stretch",
      justify = "start",
      wrap = false,
      children,
      ...props
    },
    ref
  ) => {
    const directionClasses = {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    };

    const spacingClasses = {
      0: direction.includes("row") ? "space-x-0" : "space-y-0",
      1: direction.includes("row") ? "space-x-1" : "space-y-1",
      2: direction.includes("row") ? "space-x-2" : "space-y-2",
      3: direction.includes("row") ? "space-x-3" : "space-y-3",
      4: direction.includes("row") ? "space-x-4" : "space-y-4",
      5: direction.includes("row") ? "space-x-5" : "space-y-5",
      6: direction.includes("row") ? "space-x-6" : "space-y-6",
      8: direction.includes("row") ? "space-x-8" : "space-y-8",
    };

    const alignClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    };

    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionClasses[direction],
          spacingClasses[spacing],
          alignClasses[align],
          justifyClasses[justify],
          wrap && "flex-wrap",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";
export default Stack;
