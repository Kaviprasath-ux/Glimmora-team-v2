import * as React from "react";
import { cn } from "@/lib/utils";

interface SkillChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  skill: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

const levelColors = {
  beginner: "bg-info/10 text-info border-info/20",
  intermediate: "bg-accent-gold/10 text-accent-gold border-accent-gold/20",
  advanced: "bg-secondary/10 text-secondary border-secondary/20",
  expert: "bg-accent-terracotta/10 text-accent-terracotta border-accent-terracotta/20",
};

function SkillChip({ skill, level, className, ...props }: SkillChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2.5 py-1 text-xs font-medium transition-transform duration-150 hover:scale-[1.03]",
        level ? levelColors[level] : "bg-primary/5 text-primary border-primary/15",
        className,
      )}
      {...props}
    >
      {skill}
    </span>
  );
}

export { SkillChip };
