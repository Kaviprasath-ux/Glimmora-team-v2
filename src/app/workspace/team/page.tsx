"use client";

import { motion } from "framer-motion";
import {
  PageTransition,
  Avatar,
  Badge,
  SkillChip,
  Progress,
  Skeleton,
} from "@/components/ui";
import { useTeam } from "@/hooks/use-team";
import {
  Users,
  Calendar,
  MessageCircle,
  Briefcase,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

/* ── Animations ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardStyle = {
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "var(--shadow-warm)",
} as const;

/* ── Status → CSS variable mapping ── */
const statusConfig: Record<
  string,
  { token: string; label: string }
> = {
  active: { token: "secondary", label: "Active" },
  idle: { token: "accent-gold", label: "Idle" },
  away: { token: "neutral-400", label: "Away" },
};

/* ── Role category → color token ── */
const roleCategoryToken: Record<string, string> = {
  Leadership: "primary",
  Quality: "accent-teal",
  Development: "secondary",
};

export default function TeamPage() {
  const { data: team, isLoading } = useTeam();

  if (isLoading || !team) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-[88px] rounded-2xl" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  /* ── Group members by role category ── */
  const roleGroups = team.members.reduce(
    (acc, m) => {
      const category =
        m.role.includes("Reviewer") || m.role.includes("Lead")
          ? "Leadership"
          : m.role.includes("QA") || m.role.includes("Testing")
            ? "Quality"
            : "Development";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* ═══════════════════════════════════════
            HERO — Clean Typography
            (matches learning/skills/tasks pages)
        ═══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Team Formation
          </span>
          <h1
            className="font-heading font-bold text-neutral-950 leading-tight mt-1"
            style={{ fontSize: 28, letterSpacing: "-0.025em" }}
          >
            My Team
          </h1>
          <p className="mt-2 text-[13px] text-neutral-500 leading-relaxed max-w-2xl">
            Your current team assignment and members.
          </p>
        </motion.div>

        {/* ═══════════════════════════════════════
            TEAM INFO CARD — "Team Lineup" layout
            Avatars in bottom strip with name+role
        ═══════════════════════════════════════ */}
        <motion.div
          className="rounded-2xl bg-white p-6"
          style={cardStyle}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Top section: team info */}
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-secondary) 12%, transparent)",
              }}
            >
              <Briefcase
                className="h-5 w-5"
                style={{ color: "var(--color-secondary)" }}
              />
            </div>
            <div>
              <h2
                className="text-[18px] font-bold text-neutral-900"
                style={{ letterSpacing: "-0.01em" }}
              >
                {team.name}
              </h2>
              <p className="text-[12px] text-neutral-500">
                {team.projectName}
              </p>
            </div>
          </div>

          <p className="mt-3 text-[13px] text-neutral-500 leading-relaxed max-w-xl">
            {team.charter}
          </p>

          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-neutral-400">
            <Calendar className="h-3 w-3" />
            Formed {formatDate(team.formedAt)}
          </div>

          {/* Divider */}
          <div
            className="mt-5 mb-5"
            style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}
          />

          {/* Avatar strip — full width, each member with name + role */}
          <motion.div
            className="flex flex-wrap gap-5 justify-center"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            {team.members.map((m) => (
              <motion.div
                key={m.id}
                variants={fadeUp}
                className="flex flex-col items-center gap-1"
              >
                <Avatar
                  name={m.name}
                  size="lg"
                  className="ring-[2.5px] ring-white"
                />
                <p className="text-[11px] font-semibold text-neutral-800 mt-1 text-center leading-tight">
                  {m.name.split(" ")[0]}
                </p>
                <p className="text-[9px] text-neutral-400 text-center leading-tight max-w-[80px]">
                  {m.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ═══════════════════════════════════════
            ROLE COVERAGE — Simple white tiles
            Count + label only, colored numbers
            No icons, no wrapper, no summary row
        ═══════════════════════════════════════ */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {Object.entries(roleGroups).map(([role, count]) => {
            const token = roleCategoryToken[role] || "primary";
            return (
              <div
                key={role}
                className="rounded-xl bg-white p-4 text-center"
                style={cardStyle}
              >
                <p
                  className="text-[22px] font-bold tabular-nums leading-none"
                  style={{ color: `var(--color-${token})` }}
                >
                  {count}
                </p>
                <p
                  className="text-[9px] font-semibold uppercase text-neutral-400 mt-1.5"
                  style={{ letterSpacing: "0.1em" }}
                >
                  {role}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* ═══════════════════════════════════════
            MEMBER CARDS — Clean white cards with
            status dot, skills, reliability bar.
            No top stripe, no gradient backgrounds.
        ═══════════════════════════════════════ */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {team.members.map((member) => {
            const status = statusConfig[member.status];

            return (
              <motion.div
                key={member.id}
                variants={fadeUp}
                className="rounded-2xl bg-white p-5 hover-lift transition-all flex flex-col"
                style={cardStyle}
              >
                {/* Avatar + info */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <Avatar name={member.name} size="lg" />
                    {/* Status dot */}
                    <span
                      className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white"
                      style={{
                        backgroundColor: `var(--color-${status.token})`,
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-neutral-900 leading-snug">
                      {member.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {member.role}
                    </p>
                    <span
                      className="inline-block mt-1.5 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{
                        letterSpacing: "0.08em",
                        background: `color-mix(in srgb, var(--color-${status.token}) 10%, transparent)`,
                        color: `var(--color-${status.token})`,
                      }}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-4 flex flex-wrap gap-1">
                  {member.skills.map((s) => (
                    <SkillChip key={s} skill={s} />
                  ))}
                </div>

                {/* Reliability bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-neutral-400 font-medium">
                      Reliability
                    </span>
                    <span className="font-bold text-neutral-900 tabular-nums">
                      {member.reliabilityScore}%
                    </span>
                  </div>
                  <Progress
                    value={member.reliabilityScore}
                    className="h-1.5"
                    indicatorClassName={
                      member.reliabilityScore >= 90
                        ? "bg-secondary"
                        : member.reliabilityScore >= 70
                          ? "bg-accent-gold"
                          : "bg-primary"
                    }
                  />
                </div>

                {/* Tasks completed */}
                <div
                  className="mt-3.5 pt-3.5 flex items-center justify-between"
                  style={{
                    borderTop: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <span className="text-[11px] text-neutral-400">
                    Tasks completed
                  </span>
                  <span className="text-[13px] font-bold text-neutral-900 tabular-nums">
                    {member.tasksCompleted}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ═══════════════════════════════════════
            TEAM CHAT — Clean card, Coming Soon
        ═══════════════════════════════════════ */}
        <motion.div
          className="rounded-2xl bg-white p-6"
          style={cardStyle}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.18,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 10%, transparent)",
              }}
            >
              <MessageCircle
                className="h-5 w-5"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <div>
              <h3
                className="text-[15px] font-bold text-neutral-900"
                style={{ letterSpacing: "-0.01em" }}
              >
                Team Chat
              </h3>
              <p className="mt-1 text-[13px] text-neutral-500 leading-relaxed max-w-lg">
                Real-time team communication with task context, code sharing,
                and quick check-ins.
              </p>
              <Badge variant="warning" className="mt-2.5">
                Coming Soon
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
