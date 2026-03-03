"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";

interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  date?: string;
  status: "completed" | "current" | "upcoming";
}

interface TimelineStepperProps {
  steps: TimelineStep[];
  className?: string;
}

function TimelineStepper({ steps, className }: TimelineStepperProps) {
  return (
    <div className={cn("relative space-y-0", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4">
          {/* Line + Circle */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                step.status === "completed" &&
                  "border-success bg-success text-white",
                step.status === "current" &&
                  "border-primary bg-primary/10 text-primary",
                step.status === "upcoming" &&
                  "border-primary/20 bg-surface-card text-text-muted",
              )}
            >
              {step.status === "completed" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Circle className="h-3 w-3 fill-current" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-0.5 flex-1 min-h-[32px]",
                  step.status === "completed" ? "bg-success" : "bg-primary/15",
                )}
              />
            )}
          </div>
          {/* Content */}
          <div className="pb-6 pt-1">
            <p
              className={cn(
                "text-sm font-medium",
                step.status === "upcoming"
                  ? "text-text-muted"
                  : "text-text-deep",
              )}
            >
              {step.title}
            </p>
            {step.description && (
              <p className="mt-0.5 text-xs text-text-secondary">
                {step.description}
              </p>
            )}
            {step.date && (
              <p className="mt-0.5 text-xs text-text-muted">{step.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export { TimelineStepper };
export type { TimelineStep };
