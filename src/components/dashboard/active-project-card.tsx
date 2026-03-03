"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Users, ArrowRight, Briefcase } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate, daysUntil, cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ActiveProjectCardProps {
  project: Project;
}

export function ActiveProjectCard({ project }: ActiveProjectCardProps) {
  const daysLeft = daysUntil(project.nextDeadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
      className="rounded-[var(--radius-xl)] p-6 h-full"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
            style={{
              background: "linear-gradient(135deg, #6B8F71, #5A6B4A)",
              boxShadow: "0 2px 6px rgba(90,107,74,0.25)",
            }}
          >
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C4B8AF]">
              Active Project
            </p>
            <h3 className="mt-1 font-heading text-lg font-bold text-[#1A1411]">
              {project.name}
            </h3>
            <p className="mt-0.5 text-sm text-[#9C8E84]">
              {project.clientName}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm mb-2.5">
          <span className="text-[#9C8E84]">
            Milestone {project.completedMilestones}/{project.totalMilestones}
          </span>
          <span className="font-bold text-[#1A1411] tabular-nums">
            {project.milestoneProgress}%
          </span>
        </div>
        <Progress value={project.milestoneProgress} indicatorClassName="bg-[#6B8F71]" />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <div className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1",
          daysLeft <= 3 ? "bg-[#8E4A55]/8 text-[#8E4A55]" : "bg-[#A18072]/8 text-[#A18072]"
        )}>
          <Calendar className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">
            {daysLeft > 0 ? `${daysLeft}d left` : "Overdue"} — {formatDate(project.nextDeadline)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[#9C8E84]">
          <Users className="h-3.5 w-3.5" />
          <span className="text-xs">{project.teamSize} members</span>
        </div>
        <div className="flex -space-x-2 ml-auto">
          {["Priya S", "Ravi K", "Meera P", "Arjun S"].map((n) => (
            <Avatar key={n} name={n} size="sm" className="ring-2 ring-white" />
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#1A1411]/[0.04]">
        <Link href="/workspace/tasks">
          <Button variant="outline" size="sm">
            View Tasks <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
