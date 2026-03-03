"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AccentColor = "warm" | "teal" | "gold" | "olive" | "terracotta";

const accentStyles: Record<AccentColor, {
  iconBg: string;
  iconColor: string;
  accentDot: string;
}> = {
  warm: {
    iconBg: "bg-gradient-to-br from-[#A18072]/15 to-[#A18072]/5",
    iconColor: "text-[#A18072]",
    accentDot: "#A18072",
  },
  teal: {
    iconBg: "bg-gradient-to-br from-[#5B9EAD]/15 to-[#5B9EAD]/5",
    iconColor: "text-[#5B9EAD]",
    accentDot: "#5B9EAD",
  },
  gold: {
    iconBg: "bg-gradient-to-br from-[#B8A060]/15 to-[#B8A060]/5",
    iconColor: "text-[#B8A060]",
    accentDot: "#B8A060",
  },
  olive: {
    iconBg: "bg-gradient-to-br from-[#6B8F71]/15 to-[#6B8F71]/5",
    iconColor: "text-[#6B8F71]",
    accentDot: "#6B8F71",
  },
  terracotta: {
    iconBg: "bg-gradient-to-br from-[#C4785A]/15 to-[#C4785A]/5",
    iconColor: "text-[#C4785A]",
    accentDot: "#C4785A",
  },
};

interface MetricTileProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  accent?: AccentColor;
  className?: string;
  delay?: number;
}

function MetricTile({
  label,
  value,
  icon: Icon,
  trend,
  accent = "warm",
  className,
  delay = 0,
}: MetricTileProps) {
  const styles = accentStyles[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.33, 1, 0.68, 1] as const }}
      className={cn(
        "group relative flex flex-col rounded-2xl bg-white p-5 overflow-hidden hover-lift",
        "border border-primary-200/30",
        "shadow-warm",
        className,
      )}
    >
      {/* Subtle accent blob */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.04] pointer-events-none -translate-y-1/3 translate-x-1/3"
        style={{ background: styles.accentDot }}
      />

      <div className="flex items-center justify-between mb-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", styles.iconBg)}>
          <Icon className={cn("h-5 w-5", styles.iconColor)} />
        </div>
        {trend && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-[11px] font-semibold tabular-nums rounded-full px-2 py-0.5",
              trend.value >= 0
                ? "text-[#6B8F71] bg-[#6B8F71]/[0.06]"
                : "text-[#8E4A55] bg-[#8E4A55]/[0.06]",
            )}
          >
            {trend.value >= 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend.value >= 0 ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>

      <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-text-deep">{value}</p>
      {trend && (
        <p className="mt-1 text-[11px] text-text-muted">{trend.label}</p>
      )}
    </motion.div>
  );
}

export { MetricTile };
