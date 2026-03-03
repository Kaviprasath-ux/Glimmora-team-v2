"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LearningNudge() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-[var(--radius-xl)] p-6 h-full"
          style={{
            background: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
          }}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-4 top-4 p-1.5 rounded-lg text-[#C4B8AF] hover:text-[#1A1411] hover:bg-[#FAF7F4] transition-colors z-10"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-start gap-4">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
              style={{
                background: "linear-gradient(135deg, #C4AC6E, #A69050)",
                boxShadow: "0 2px 6px rgba(184,160,96,0.25)",
              }}
            >
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#1A1411]">
                Boost your JWT skills
              </h4>
              <p className="mt-1 text-sm text-[#9C8E84] leading-relaxed">
                Based on your current task, we recommend &ldquo;JWT Authentication
                Best Practices&rdquo; — 45 min tutorial.
              </p>
              <Link href="/workspace/learning" className="inline-block mt-4">
                <Button variant="outline" size="sm">
                  Start Learning <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
