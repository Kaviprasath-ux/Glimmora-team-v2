"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AIReadinessGaugeProps {
  score: number;
  size?: number;
}

export function AIReadinessGauge({ score, size = 80 }: AIReadinessGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = size > 100 ? 8 : 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 200);
    return () => clearTimeout(timer);
  }, [score]);

  const gradientId = `gauge-gradient-${size}`;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90 relative">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9943A" />
            <stop offset="100%" stopColor="#F5C97A" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-heading font-bold text-white tabular-nums"
          style={{ fontSize: size > 100 ? 24 : 18 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {animatedScore}
        </motion.span>
        <span
          className="text-white/40 uppercase font-semibold"
          style={{
            fontSize: size > 100 ? 9 : 7,
            letterSpacing: "0.15em",
            marginTop: 1,
          }}
        >
          AI Ready
        </span>
      </div>
    </div>
  );
}
