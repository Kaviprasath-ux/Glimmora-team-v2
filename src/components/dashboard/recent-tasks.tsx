"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, timeAgo } from "@/lib/utils";
import type { Task } from "@/types";

interface RecentTasksProps {
  tasks: Task[];
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
      className="rounded-[var(--radius-xl)] h-full"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-base font-bold text-[#1A1411]">Recent Tasks</h3>
          <Link
            href="/workspace/tasks"
            className="group text-xs font-medium text-[#A18072] flex items-center gap-0.5 hover:gap-1.5 transition-all"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-0.5">
          {tasks.map((task, i) => (
            <Link
              key={task.id}
              href={`/workspace/tasks/${task.id}`}
              className="flex items-center justify-between gap-3 py-3 group transition-colors rounded-lg px-3 -mx-3 hover:bg-[#FAF7F4]"
            >
              <div className="min-w-0 flex-1 flex items-center gap-3">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #B0907F, #8E6D60)",
                  }}
                >
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1A1411] truncate group-hover:text-[#A18072] transition-colors">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-[#9C8E84] mt-0.5">
                    {task.projectName} · {timeAgo(task.assignedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-xs font-semibold text-[#6B8F71] hidden sm:block tabular-nums">
                  {formatCurrency(task.payout)}
                </span>
                <StatusBadge status={task.status} />
                <ChevronRight className="h-3.5 w-3.5 text-[#C4B8AF] group-hover:text-[#9C8E84] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
