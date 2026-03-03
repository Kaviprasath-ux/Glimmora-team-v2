import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-text-deep"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-[var(--radius)] border border-primary/15 bg-surface-card px-3 py-2 text-sm text-text-deep placeholder:text-text-muted transition-colors resize-y",
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
Textarea.displayName = "Textarea";

export { Textarea };
