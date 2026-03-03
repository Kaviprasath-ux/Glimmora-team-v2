"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ListTodo, Wallet, Award, Users, Info } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types";

const typeIcons: Record<NotificationType, React.ElementType> = {
  task: ListTodo,
  payment: Wallet,
  badge: Award,
  team: Users,
  system: Info,
};

const typeGradients: Record<NotificationType, string> = {
  task: "linear-gradient(135deg, #B0907F, #8E6D60)",
  payment: "linear-gradient(135deg, #7A9E80, #5A7E60)",
  badge: "linear-gradient(135deg, #C4AC6E, #A69050)",
  team: "linear-gradient(135deg, #6B8F71, #5A6B4A)",
  system: "linear-gradient(135deg, #9C8E84, #7A6E66)",
};

interface RecentNotificationsProps {
  notifications: Notification[];
}

export function RecentNotifications({
  notifications,
}: RecentNotificationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
      className="rounded-[var(--radius-xl)] h-full"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-base font-bold text-[#1A1411]">Notifications</h3>
          <Link
            href="/workspace/notifications"
            className="group text-xs font-medium text-[#A18072] flex items-center gap-0.5 hover:gap-1.5 transition-all"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-0.5">
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type];
            return (
              <Link
                key={notif.id}
                href={notif.actionUrl || "/workspace/notifications"}
                className="flex items-start gap-3 py-3 group rounded-lg transition-colors hover:bg-[#FAF7F4] px-3 -mx-3"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: typeGradients[notif.type] }}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#1A1411] group-hover:text-[#A18072] transition-colors font-medium">
                    {notif.title}
                  </p>
                  <p className="text-[11px] text-[#9C8E84] mt-0.5">
                    {timeAgo(notif.createdAt)}
                  </p>
                </div>
                {!notif.read && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#B8A060] mt-2" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
