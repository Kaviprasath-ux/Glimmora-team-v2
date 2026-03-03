"use client";

import {
  PageTransition,
  Card,
  Avatar,
  Badge,
  SkillChip,
  Progress,
  Skeleton,
} from "@/components/ui";
import { useTeam } from "@/hooks/use-team";
import { Users, Calendar, MessageCircle, Briefcase } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

const statusColors = {
  active: "bg-[#6B8F71]",
  idle: "bg-[#B8A060]",
  away: "bg-[#9C8E84]",
};

const statusCardStyles = {
  active: "hover:shadow-[0_4px_20px_rgba(74,122,62,0.1)]",
  idle: "hover:shadow-[0_4px_20px_rgba(184,164,76,0.1)]",
  away: "hover:shadow-warm-md",
};

export default function TeamPage() {
  const { data: team, isLoading } = useTeam();

  if (isLoading || !team) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 rounded-[var(--radius-xl)]" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-[var(--radius-xl)]" />
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  const roleGroups = team.members.reduce(
    (acc, m) => {
      const category = m.role.includes("Reviewer") || m.role.includes("Lead")
        ? "Leadership"
        : m.role.includes("QA") || m.role.includes("Testing")
          ? "Quality"
          : "Development";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const roleAccents: Record<string, { bg: string; text: string; border: string }> = {
    Leadership: { bg: "from-[#BFA094]/12 to-[#BFA094]/4", text: "text-[#BFA094]", border: "border-[#BFA094]/15" },
    Quality: { bg: "from-[#A18072]/12 to-[#A18072]/4", text: "text-[#A18072]", border: "border-[#A18072]/15" },
    Development: { bg: "from-[#5A6B4A]/12 to-[#5A6B4A]/4", text: "text-[#5A6B4A]", border: "border-[#5A6B4A]/15" },
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-gradient-warm">My Team</h1>
          <p className="mt-1 text-text-secondary">
            Your current team assignment and members.
          </p>
        </div>

        {/* Team Info Card */}
        <div className="rounded-[var(--radius-xl)] bg-white border border-black/[0.04] p-6 shadow-warm-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br from-[#5A6B4A] to-[#7A8F66] shadow-sm">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold text-text-deep">
                    {team.name}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {team.projectName}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-xl">
                {team.charter}
              </p>
              <p className="mt-2 text-[11px] text-text-muted flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Formed {formatDate(team.formedAt)}
              </p>
            </div>
            <div className="flex -space-x-3">
              {team.members.map((m) => (
                <Avatar key={m.id} name={m.name} size="lg" className="ring-[3px] ring-white" />
              ))}
            </div>
          </div>
        </div>

        {/* Role Coverage */}
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(roleGroups).map(([role, count]) => {
            const accent = roleAccents[role] || { bg: "from-[#A18072]/8 to-[#A18072]/3", text: "text-[#A18072]", border: "border-[#A18072]/15" };
            return (
              <div
                key={role}
                className={cn(
                  "rounded-[var(--radius-lg)] border p-5 text-center bg-gradient-to-br transition-all hover:shadow-warm-sm",
                  accent.bg,
                  accent.border,
                )}
              >
                <p className={cn("text-3xl font-heading font-bold", accent.text)}>{count}</p>
                <p className="text-xs text-text-secondary mt-1 font-medium">{role}</p>
              </div>
            );
          })}
        </div>

        {/* Member Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {team.members.map((member) => (
            <div
              key={member.id}
              className={cn(
                "rounded-[var(--radius-xl)] bg-white border border-black/[0.04] p-5 shadow-warm transition-all duration-300 hover-lift overflow-hidden relative",
                statusCardStyles[member.status],
              )}
            >
              {/* Status top bar */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-[3px]",
                member.status === "active" && "bg-gradient-to-r from-[#6B8F71] to-[#7A8F66]",
                member.status === "idle" && "bg-gradient-to-r from-[#B8A060] to-[#C9B85C]",
                member.status === "away" && "bg-gradient-to-r from-[#9C8E84] to-[#B5A89E]",
              )} />

              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar name={member.name} size="lg" />
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white",
                      statusColors[member.status],
                      member.status === "active" && "animate-[pulse-soft_2s_ease_infinite]",
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-deep">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-text-secondary">{member.role}</p>
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {member.status}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap gap-1">
                  {member.skills.map((s) => (
                    <SkillChip key={s} skill={s} />
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-text-muted font-medium">Reliability</span>
                    <span className="font-bold text-text-deep tabular-nums">
                      {member.reliabilityScore}%
                    </span>
                  </div>
                  <Progress
                    value={member.reliabilityScore}
                    indicatorClassName={
                      member.reliabilityScore >= 90
                        ? "bg-gradient-to-r from-[#6B8F71] to-[#7A8F66]"
                        : member.reliabilityScore >= 70
                          ? "bg-gradient-to-r from-[#B8A060] to-[#C9B85C]"
                          : "bg-gradient-to-r from-[#8E4A55] to-[#D4705F]"
                    }
                  />
                </div>

                <p className="text-[11px] text-text-muted tabular-nums">
                  {member.tasksCompleted} tasks completed
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Team Chat Placeholder */}
        <div className="rounded-[var(--radius-xl)] bg-gradient-to-br from-[#FAF7F4] to-white border border-black/[0.04] p-6 shadow-warm relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#A18072]/[0.04] blur-3xl pointer-events-none" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#A18072] to-[#BFA094] shadow-sm">
              <MessageCircle className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-text-deep">Team Chat</h3>
              <p className="mt-1 text-sm text-text-secondary">
                Real-time team communication with task context, code sharing,
                and quick check-ins.
              </p>
              <Badge variant="warning" className="mt-2">
                Coming Soon
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
