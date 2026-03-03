"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Coins, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { SkillChip } from "@/components/ui/skill-chip";
import { formatCurrency, daysUntil, cn } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  index?: number;
  compact?: boolean;
}

const priorityVariants = {
  low: "default",
  medium: "info",
  high: "warning",
  critical: "error",
} as const;

const statusDotColors: Record<string, string> = {
  assigned: "bg-[#A18072]",
  in_progress: "bg-[#B8A060]",
  in_review: "bg-[#A18072]",
  rework: "bg-[#8E4A55]",
  accepted: "bg-[#6B8F71]",
  rejected: "bg-[#8E4A55]",
  pending: "bg-[#9C8E84]",
  completed: "bg-[#6B8F71]",
};

const statusBorderColors: Record<string, string> = {
  assigned: "border-l-[#A18072]",
  in_progress: "border-l-[#B8A060]",
  in_review: "border-l-[#A18072]",
  rework: "border-l-[#8E4A55]",
  accepted: "border-l-[#6B8F71]",
  rejected: "border-l-[#8E4A55]",
  pending: "border-l-[#9C8E84]",
  completed: "border-l-[#6B8F71]",
};

export function TaskCard({ task, index = 0, compact = false }: TaskCardProps) {
  const days = daysUntil(task.deadline);
  const isUrgent = task.priority === "critical" || task.priority === "high";

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.04, ease: [0.33, 1, 0.68, 1] }}
      >
        <Link
          href={`/workspace/tasks/${task.id}`}
          className={cn(
            "block rounded-[var(--radius-lg)] border border-black/[0.04] bg-white p-3.5 shadow-warm group hover-lift transition-all",
            isUrgent && "shadow-[0_0_16px_rgba(196,107,90,0.06)]",
          )}
        >
          {/* Status dot + priority */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", statusDotColors[task.status] || "bg-[#9C8E84]")} />
              <span className="text-[10px] text-text-muted font-medium capitalize">
                {task.status.replace("_", " ")}
              </span>
            </div>
            <Badge variant={priorityVariants[task.priority]} className="text-[9px] px-1.5 py-0">
              {task.priority}
            </Badge>
          </div>

          <h3 className="text-[13px] font-semibold text-text-deep line-clamp-2 group-hover:text-[#A18072] transition-colors leading-snug">
            {task.title}
          </h3>
          <p className="mt-1 text-[10px] text-text-muted truncate">{task.projectName}</p>

          <div className="mt-3 pt-2.5 border-t border-black/[0.04] flex items-center justify-between text-[11px]">
            <span className={cn(
              "font-medium",
              days <= 3 && days > 0 ? "text-[#8E4A55]" : days <= 0 ? "text-[#8E4A55] font-bold" : "text-text-muted"
            )}>
              {days > 0 ? `${days}d` : days === 0 ? "Today" : "Late"}
            </span>
            <span className="font-bold text-[#6B8F71] tabular-nums">
              {formatCurrency(task.payout)}
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.33, 1, 0.68, 1] }}
    >
      <Link
        href={`/workspace/tasks/${task.id}`}
        className={cn(
          "block rounded-[var(--radius-xl)] border border-black/[0.04] border-l-[4px] bg-white p-5 shadow-warm group hover-lift",
          statusBorderColors[task.status] || "border-l-[#A18072]",
          isUrgent && "shadow-[0_0_20px_rgba(196,107,90,0.08)]",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-text-deep line-clamp-2 group-hover:text-[#A18072] transition-colors">
              {task.title}
            </h3>
            <p className="mt-1 text-[11px] text-text-muted">{task.projectName}</p>
          </div>
          <StatusBadge status={task.status} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {task.skills.slice(0, 3).map((skill) => (
            <SkillChip key={skill} skill={skill} />
          ))}
          {task.skills.length > 3 && (
            <span className="text-[11px] text-text-muted self-center">
              +{task.skills.length - 3}
            </span>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center gap-3">
            <span className={cn(
              "flex items-center gap-1 font-medium",
              days <= 3 && days > 0 ? "text-[#8E4A55]" : days <= 0 ? "text-[#8E4A55] font-bold" : "text-text-secondary"
            )}>
              <Calendar className="h-3.5 w-3.5" />
              {days > 0 ? `${days}d left` : days === 0 ? "Today" : "Overdue"}
            </span>
            <Badge variant={priorityVariants[task.priority]}>
              {task.priority}
            </Badge>
          </div>
          <span className="flex items-center gap-1 font-bold text-[#6B8F71] tabular-nums">
            <Coins className="h-3.5 w-3.5" />
            {formatCurrency(task.payout)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
