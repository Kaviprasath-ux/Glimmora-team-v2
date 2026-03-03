"use client";

import { motion } from "framer-motion";
import { PageTransition, Skeleton } from "@/components/ui";
import {
  ActiveProjectCard,
  RecentTasks,
  RecentNotifications,
  LearningNudge,
} from "@/components/dashboard";
import { useDashboard } from "@/hooks/use-dashboard";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowRight,
  ListChecks,
  Wallet,
  Sparkles,
  Shield,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

/* ── Animations ── */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ── AI Score Ring ── */
function AIScoreRing({ score }: { score: number }) {
  const size = 60;
  const sw = 4;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ai-ring" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A18072" />
            <stop offset="100%" stopColor="#6B8F71" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(0,0,0,0.04)"
          strokeWidth={sw}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ai-ring)"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[16px] font-bold tabular-nums text-[#1A1411]">
          {score}
        </span>
        <span
          className="text-[7px] font-bold uppercase text-[#9C8E84]"
          style={{ letterSpacing: "0.12em" }}
        >
          AI Score
        </span>
      </div>
    </div>
  );
}

/* ── Area Chart ── */
function AreaChart({ data, height = 180 }: { data: number[]; height?: number }) {
  const w = 420;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 8;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / range) * (height - pad * 2),
  }));
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, "");
  const fill = `${d} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6B8F71" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#6B8F71" stopOpacity={0.01} />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#chart-fill)" />
      <path
        d={d}
        fill="none"
        stroke="#6B8F71"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r={5}
        fill="#6B8F71"
      />
      <circle
        cx={pts[pts.length - 1].x}
        cy={pts[pts.length - 1].y}
        r={10}
        fill="#6B8F71"
        fillOpacity={0.12}
      />
    </svg>
  );
}

/* ── Mini Sparkline ── */
function MiniSpark({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const w = 56;
  const h = 22;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * h * 0.8 - h * 0.1,
  }));
  const d = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cx = (prev.x + p.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
  }, "");

  return (
    <svg width={w} height={h}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Card style ── */
const cardBase = {
  background: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
};

/* ═══════════════════════════════════════════════
   DASHBOARD — Split Panel Layout
   Left: Welcome + Vertical KPI Stats
   Right: Earnings Chart Hero
   ═══════════════════════════════════════════════ */
export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <PageTransition>
        <div className="space-y-5">
          <div className="grid lg:grid-cols-12 gap-5">
            <Skeleton className="lg:col-span-5 h-[420px] rounded-2xl" />
            <Skeleton className="lg:col-span-7 h-[420px] rounded-2xl" />
          </div>
          <div className="grid lg:grid-cols-12 gap-5">
            <Skeleton className="lg:col-span-8 h-52 rounded-2xl" />
            <Skeleton className="lg:col-span-4 h-52 rounded-2xl" />
          </div>
        </div>
      </PageTransition>
    );
  }

  const firstName = data.user.name.split(" ")[0];
  const greeting = getGreeting();

  const kpiList = [
    {
      key: "earnings",
      icon: Wallet,
      label: "This Month",
      value: formatCurrency(data.thisMonthEarnings),
      trend: "+18%",
      color: "#6B8F71",
      colorBg: "rgba(107,143,113,0.07)",
      spark: [12, 18, 15, 22, 20, 24, 24.5],
      featured: true,
    },
    {
      key: "tasks",
      icon: ListChecks,
      label: "Active Tasks",
      value: String(data.activeTasks),
      trend: "+1.2%",
      color: "#A18072",
      colorBg: "rgba(161,128,114,0.07)",
      spark: [3, 4, 3, 5, 4, 6, 6],
      featured: false,
    },
    {
      key: "skill",
      icon: Sparkles,
      label: "Skill Level",
      value: data.skillLevel,
      trend: null,
      color: "#5B9EAD",
      colorBg: "rgba(91,158,173,0.07)",
      spark: null,
      featured: false,
    },
    {
      key: "podl",
      icon: Shield,
      label: "PoDL Records",
      value: String(data.podlRecords),
      trend: "+3",
      color: "#B8A060",
      colorBg: "rgba(184,160,96,0.07)",
      spark: [8, 9, 10, 10, 12, 13, 15],
      featured: false,
    },
  ];

  return (
    <PageTransition>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        {/* ═══ HERO: Split Panel ═══ */}
        <div className="grid lg:grid-cols-12 gap-5">
          {/* ── LEFT: Welcome + Stats ── */}
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <div
              className="rounded-2xl h-full"
              style={{
                background:
                  "linear-gradient(160deg, #FDFBF9 0%, #F8F2EC 50%, #F3EBE3 100%)",
                border: "1px solid rgba(0,0,0,0.04)",
                boxShadow:
                  "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
              }}
            >
              <div className="p-7 flex flex-col h-full">
                {/* Greeting + AI Ring */}
                <div className="flex items-start justify-between mb-7">
                  <div>
                    <p
                      className="text-[11px] font-semibold uppercase text-[#C4B8AF]"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      {greeting}
                    </p>
                    <h1
                      className="font-heading font-bold mt-1"
                      style={{
                        fontSize: 22,
                        letterSpacing: "-0.02em",
                        color: "#1A1411",
                      }}
                    >
                      Welcome back,{" "}
                      <span style={{ color: "#A18072" }}>{firstName}</span>
                    </h1>
                  </div>
                  <AIScoreRing score={data.aiReadinessScore} />
                </div>

                {/* KPI Stats — Vertical List */}
                <div className="flex-1 space-y-1">
                  {kpiList.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                      <div
                        key={kpi.key}
                        className={`flex items-center justify-between py-3 ${
                          kpi.featured
                            ? "border-b border-black/[0.04] pb-4 mb-1"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg"
                            style={{ background: kpi.colorBg }}
                          >
                            <Icon
                              style={{
                                width: 15,
                                height: 15,
                                color: kpi.color,
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-[10px] font-medium text-[#9C8E84]">
                              {kpi.label}
                            </p>
                            <p
                              className="font-heading font-bold text-[#1A1411] tabular-nums"
                              style={{
                                fontSize: kpi.featured ? 22 : 17,
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {kpi.value}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {kpi.spark && (
                            <MiniSpark data={kpi.spark} color={kpi.color} />
                          )}
                          {kpi.trend && (
                            <span
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                              style={{
                                background: "rgba(107,143,113,0.1)",
                                color: "#4A7B52",
                              }}
                            >
                              <TrendingUp style={{ width: 9, height: 9 }} />
                              {kpi.trend}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="mt-5 pt-4 border-t border-black/[0.04]">
                  <Link
                    href="/workspace/tasks"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold text-white group"
                    style={{
                      background: "linear-gradient(135deg, #43302B, #846358)",
                      boxShadow: "0 2px 8px rgba(67,48,43,0.18)",
                    }}
                  >
                    View All Tasks
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Earnings Chart ── */}
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <div className="rounded-2xl h-full" style={cardBase}>
              <div className="p-7 flex flex-col h-full">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h2
                      className="font-heading font-bold text-[#1A1411]"
                      style={{ fontSize: 16 }}
                    >
                      Earnings Overview
                    </h2>
                    <p className="text-[12px] text-[#9C8E84] mt-0.5">
                      Monthly earnings trend
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#C4B8AF]">
                    <span className="h-2 w-2 rounded-full bg-[#6B8F71]" />
                    Earnings
                  </span>
                </div>

                <div className="flex-1 flex items-end mt-6">
                  <AreaChart
                    data={[8200, 14500, 11800, 19200, 16800, 22100, 24500]}
                    height={200}
                  />
                </div>

                <div className="flex justify-between mt-3 text-[10px] font-medium text-[#C4B8AF] px-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map(
                    (m) => (
                      <span key={m}>{m}</span>
                    )
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══ ACTIVE PROJECT + LEARNING ═══ */}
        <motion.div variants={fadeUp} className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8">
            <ActiveProjectCard project={data.activeProject} />
          </div>
          <div className="lg:col-span-4">
            <LearningNudge />
          </div>
        </motion.div>

        {/* ═══ TASKS + NOTIFICATIONS ═══ */}
        <motion.div variants={fadeUp} className="grid lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7">
            <RecentTasks tasks={data.recentTasks} />
          </div>
          <div className="lg:col-span-5">
            <RecentNotifications notifications={data.recentNotifications} />
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
