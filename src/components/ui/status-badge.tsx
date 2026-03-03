import * as React from "react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { color: string; bg: string; dot: string; animated?: boolean }> =
  {
    assigned: {
      color: "text-primary",
      bg: "bg-gradient-to-r from-primary/12 to-primary/6",
      dot: "bg-primary",
    },
    in_progress: {
      color: "text-accent-gold",
      bg: "bg-gradient-to-r from-accent-gold/12 to-accent-gold/6",
      dot: "bg-accent-gold",
      animated: true,
    },
    in_review: {
      color: "text-primary",
      bg: "bg-gradient-to-r from-primary/12 to-primary/6",
      dot: "bg-primary",
      animated: true,
    },
    rework: {
      color: "text-error",
      bg: "bg-gradient-to-r from-error/12 to-error/6",
      dot: "bg-error",
    },
    accepted: {
      color: "text-success",
      bg: "bg-gradient-to-r from-success/12 to-success/6",
      dot: "bg-success",
    },
    rejected: {
      color: "text-error",
      bg: "bg-gradient-to-r from-error/12 to-error/6",
      dot: "bg-error",
    },
    pending: {
      color: "text-text-muted",
      bg: "bg-gradient-to-r from-text-muted/12 to-text-muted/6",
      dot: "bg-text-muted",
    },
    completed: {
      color: "text-success",
      bg: "bg-gradient-to-r from-success/12 to-success/6",
      dot: "bg-success",
    },
    paid: {
      color: "text-success",
      bg: "bg-gradient-to-r from-success/12 to-success/6",
      dot: "bg-success",
    },
    processing: {
      color: "text-accent-gold",
      bg: "bg-gradient-to-r from-accent-gold/12 to-accent-gold/6",
      dot: "bg-accent-gold",
      animated: true,
    },
  };

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: string;
}

function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.pending;
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-full)] px-2.5 py-1 text-xs font-medium capitalize",
        config.bg,
        config.color,
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          config.dot,
          config.animated && "animate-[pulse-soft_2s_ease_infinite]",
        )}
      />
      {label}
    </span>
  );
}

export { StatusBadge };
