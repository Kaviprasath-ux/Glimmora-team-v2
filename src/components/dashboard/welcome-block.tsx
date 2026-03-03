"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface WelcomeBlockProps {
  name: string;
  role: string;
  aiReadinessScore: number;
  activeTasks: number;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* AI Score Ring */
function AIScoreRing({ score }: { score: number }) {
  const size = 50;
  const sw = 3.5;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="wr" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A18072" />
            <stop offset="100%" stopColor="#6B8F71" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={sw}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#wr)"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: off }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-bold tabular-nums text-[#1A1411]">
          {score}
        </span>
        <span
          className="text-[6px] font-bold uppercase text-[#9C8E84]"
          style={{ letterSpacing: "0.14em", marginTop: 1 }}
        >
          AI
        </span>
      </div>
    </div>
  );
}

export function WelcomeBlock({
  name,
  role,
  aiReadinessScore,
  activeTasks,
}: WelcomeBlockProps) {
  const firstName = name.split(" ")[0];
  const greeting = getGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl"
      style={{
        background:
          "linear-gradient(135deg, #FDFBF9 0%, #F8F3EE 50%, #F5EDE6 100%)",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
      }}
    >
      <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <AIScoreRing score={aiReadinessScore} />
          <div>
            <p
              className="text-[11px] font-semibold uppercase mb-0.5"
              style={{ color: "#C4B8AF", letterSpacing: "0.1em" }}
            >
              {greeting}
            </p>
            <h1
              className="font-heading font-bold"
              style={{
                fontSize: 21,
                letterSpacing: "-0.02em",
                color: "#1A1411",
              }}
            >
              Welcome back,{" "}
              <span style={{ color: "#A18072" }}>{firstName}</span>
            </h1>
            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-full px-2.5 py-0.5"
                style={{ background: "rgba(107,143,113,0.1)", color: "#4A7B52" }}
              >
                <Sparkles style={{ width: 10, height: 10 }} />
                {activeTasks} active tasks
              </span>
              <span
                className="text-[11px] font-medium rounded-full px-2.5 py-0.5"
                style={{ background: "rgba(0,0,0,0.03)", color: "#9C8E84" }}
              >
                {role}
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/workspace/tasks"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold text-white transition-all group shrink-0"
          style={{
            background: "linear-gradient(135deg, #43302B, #846358)",
            boxShadow:
              "0 2px 8px rgba(67,48,43,0.2), 0 4px 12px rgba(67,48,43,0.1)",
          }}
        >
          View Tasks
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}
