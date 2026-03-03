"use client";

import { useState, useMemo, useEffect } from "react";
import {
  PageTransition,
  Skeleton,
  EmptyState,
  Pagination,
} from "@/components/ui";
import { TaskCard, TaskFilters } from "@/components/tasks";
import { useTasks, useTaskStatusCounts } from "@/hooks/use-tasks";
import { Inbox, ArrowRight, Calendar, Coins } from "lucide-react";
import { formatCurrency, daysUntil, cn } from "@/lib/utils";
import Link from "next/link";
import type { TaskStatus } from "@/types";

const ITEMS_PER_PAGE = 12;

const statusPills = [
  { value: "all", label: "All" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "rework", label: "Rework" },
  { value: "accepted", label: "Accepted" },
];

export default function TasksPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const statusFilter =
    activeFilter === "all" ? undefined : (activeFilter as TaskStatus);
  const { data: tasks, isLoading } = useTasks({
    status: statusFilter,
    search: search || undefined,
  });
  const { data: counts } = useTaskStatusCounts();

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    let result = tasks;
    if (projectFilter !== "all") {
      result = result.filter((t) => t.projectName === projectFilter);
    }
    if (priorityFilter !== "all") {
      result = result.filter((t) => t.priority === priorityFilter);
    }
    return result;
  }, [tasks, projectFilter, priorityFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, search, projectFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Featured task: first in_progress or most urgent
  const featuredTask = useMemo(() => {
    if (!filteredTasks.length) return null;
    const inProgress = filteredTasks.find((t) => t.status === "in_progress");
    if (inProgress) return inProgress;
    return filteredTasks[0];
  }, [filteredTasks]);

  const remainingTasks = useMemo(() => {
    if (!featuredTask) return paginatedTasks;
    return paginatedTasks.filter((t) => t.id !== featuredTask.id);
  }, [paginatedTasks, featuredTask]);

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header with filter pills */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-gradient-warm">My Tasks</h1>
          <p className="mt-1 text-text-secondary">
            Manage your assigned tasks across all projects.
          </p>
        </div>

        {/* Horizontal filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statusPills.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setActiveFilter(pill.value)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeFilter === pill.value
                  ? "bg-[#A18072] text-white shadow-warm-md"
                  : "bg-white border border-black/[0.06] text-text-secondary hover:border-[#A18072]/30 hover:text-text-deep",
              )}
            >
              {pill.label}
              {counts && (
                <span className={cn(
                  "ml-1.5 text-[11px] tabular-nums",
                  activeFilter === pill.value ? "text-white/70" : "text-text-muted"
                )}>
                  ({counts[pill.value] || 0})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="rounded-[var(--radius-lg)] bg-white/60 backdrop-blur-sm border border-black/[0.04] p-3">
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            project={projectFilter}
            onProjectChange={setProjectFilter}
            priority={priorityFilter}
            onPriorityChange={setPriorityFilter}
          />
        </div>

        {isLoading ? (
          <div className="space-y-5">
            <div className="grid lg:grid-cols-12 gap-5">
              <Skeleton className="lg:col-span-8 h-52 rounded-[var(--radius-xl)]" />
              <Skeleton className="lg:col-span-4 h-52 rounded-[var(--radius-xl)]" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-[var(--radius-xl)]" />
              ))}
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={`No ${activeFilter === "all" ? "" : statusPills.find(p => p.value === activeFilter)?.label.toLowerCase() + " "}tasks`}
            description={
              search
                ? "Try adjusting your search or filters."
                : `You don't have any ${activeFilter === "all" ? "" : statusPills.find(p => p.value === activeFilter)?.label.toLowerCase() + " "}tasks right now.`
            }
          />
        ) : (
          <>
            {/* Featured Task (8) + Quick Stats Sidebar (4) */}
            {featuredTask && (
              <div className="grid lg:grid-cols-12 gap-5">
                {/* Featured task — large card */}
                <Link
                  href={`/workspace/tasks/${featuredTask.id}`}
                  className="lg:col-span-8 rounded-[var(--radius-xl)] bg-white border border-black/[0.04] p-6 shadow-warm-md hover-lift transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#A18072] to-[#BFA094]" />
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[10px] font-semibold text-[#A18072] uppercase tracking-[0.12em]">Featured Task</span>
                    <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-[#A18072] transition-colors" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-text-deep group-hover:text-[#A18072] transition-colors">
                    {featuredTask.title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">{featuredTask.projectName}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <span className={cn(
                      "flex items-center gap-1.5 font-medium",
                      daysUntil(featuredTask.deadline) <= 3 ? "text-[#8E4A55]" : "text-text-secondary"
                    )}>
                      <Calendar className="h-3.5 w-3.5" />
                      {daysUntil(featuredTask.deadline) > 0
                        ? `${daysUntil(featuredTask.deadline)} days left`
                        : "Overdue"}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-[#6B8F71]">
                      <Coins className="h-3.5 w-3.5" />
                      {formatCurrency(featuredTask.payout)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="h-1.5 rounded-full bg-black/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#A18072] to-[#BFA094] transition-all"
                        style={{ width: featuredTask.status === "in_progress" ? "50%" : featuredTask.status === "in_review" ? "80%" : "20%" }}
                      />
                    </div>
                  </div>
                </Link>

                {/* Quick Stats Sidebar — stacked numbers, NOT MetricTiles */}
                <div className="lg:col-span-4 rounded-[var(--radius-xl)] bg-white border border-black/[0.04] shadow-warm p-5 flex flex-col justify-between">
                  <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.1em] mb-4">Quick Stats</h4>
                  <div className="space-y-4 flex-1">
                    {[
                      { label: "Active", value: counts?.in_progress || 0, color: "text-[#B8A060]" },
                      { label: "Pending Review", value: counts?.in_review || 0, color: "text-[#A18072]" },
                      { label: "Completed", value: counts?.accepted || 0, color: "text-[#6B8F71]" },
                      { label: "Total Earned", value: formatCurrency(filteredTasks.reduce((sum, t) => sum + (t.status === "accepted" ? t.payout : 0), 0)), color: "text-[#6B8F71]" },
                    ].map((stat, i) => (
                      <div key={stat.label}>
                        <p className="text-[11px] text-text-muted font-medium">{stat.label}</p>
                        <p className={cn("text-xl font-heading font-bold mt-0.5", stat.color)}>
                          {stat.value}
                        </p>
                        {i < 3 && <div className="mt-3 h-px bg-gradient-to-r from-black/[0.04] via-black/[0.06] to-transparent" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4-column compact task cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {remainingTasks.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i} compact />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredTasks.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </>
        )}
      </div>
    </PageTransition>
  );
}
