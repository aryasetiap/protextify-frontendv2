import { forwardRef } from "react";
import { cn } from "@/utils";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

const Alert = forwardRef(
  (
    {
      className,
      variant = "default",
      children,
      onClose,
      title,
      closable = false,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: {
        container: "bg-gray-50 border-gray-200 text-gray-800",
        icon: Info,
        iconColor: "text-gray-500",
      },
      success: {
        container: "bg-green-50 border-green-200 text-green-800",
        icon: CheckCircle,
        iconColor: "text-green-500",
      },
      warning: {
        container: "bg-yellow-50 border-yellow-200 text-yellow-800",
        icon: AlertTriangle,
        iconColor: "text-yellow-500",
      },
      error: {
        container: "bg-red-50 border-red-200 text-red-800",
        icon: XCircle,
        iconColor: "text-red-500",
      },
      info: {
        container: "bg-blue-50 border-blue-200 text-blue-800",
        icon: Info,
        iconColor: "text-blue-500",
      },
      destructive: {
        container: "bg-red-50 border-red-200 text-red-800",
        icon: XCircle,
        iconColor: "text-red-500",
      },
    };

    const {
      container,
      icon: Icon,
      iconColor,
    } = variants[variant] || variants.default;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4",
          container,
          className
        )}
        {...props}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>

          <div className="ml-3 flex-1">
            {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
            <div className="text-sm">{children}</div>
          </div>

          {closable && onClose && (
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className={cn(
                    "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    iconColor,
                    "hover:bg-black/5"
                  )}
                  onClick={onClose}
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

const AlertTitle = forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
