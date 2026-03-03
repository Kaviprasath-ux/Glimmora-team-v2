import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-deep"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-[var(--radius)] border border-primary/15 bg-surface-card px-3 py-2 text-sm text-text-deep placeholder:text-text-muted transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:shadow-[0_0_0_3px_rgba(139,117,101,0.08)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus:ring-error/40 focus:border-error",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
