import { forwardRef } from "react";
import { cn } from "@/utils";

const Grid = forwardRef(
  (
    {
      className,
      cols = 1,
      gap = 4,
      smCols,
      mdCols,
      lgCols,
      xlCols,
      children,
      ...props
    },
    ref
  ) => {
    const colsClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };

    const gapClasses = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          colsClasses[cols],
          smCols && `sm:${colsClasses[smCols]}`,
          mdCols && `md:${colsClasses[mdCols]}`,
          lgCols && `lg:${colsClasses[lgCols]}`,
          xlCols && `xl:${colsClasses[xlCols]}`,
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";
export default Grid;
