import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-gradient-to-r from-primary/12 to-primary/6 text-primary",
  secondary: "bg-gradient-to-r from-secondary/12 to-secondary/6 text-secondary",
  success: "bg-gradient-to-r from-success/12 to-success/6 text-success",
  warning: "bg-gradient-to-r from-warning/12 to-warning/6 text-warning",
  error: "bg-gradient-to-r from-error/12 to-error/6 text-error",
  info: "bg-gradient-to-r from-primary/12 to-primary/6 text-primary",
  outline: "border border-primary/30 text-primary",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
