"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PageTransition,
  Button,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
} from "@/components/ui";
import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
} from "@/hooks/use-notifications";
import {
  ListTodo,
  Wallet,
  Award,
  Users,
  Info,
  CheckCheck,
  Bell,
  ArrowRight,
} from "lucide-react";
import { timeAgo, cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const typeIcons: Record<NotificationType, React.ElementType> = {
  task: ListTodo,
  payment: Wallet,
  badge: Award,
  team: Users,
  system: Info,
};

const typeStyles: Record<NotificationType, { bg: string; text: string }> = {
  task: { bg: "bg-gradient-to-br from-[#A18072]/15 to-[#A18072]/5", text: "text-[#A18072]" },
  payment: { bg: "bg-gradient-to-br from-[#6B8F71]/15 to-[#6B8F71]/5", text: "text-[#6B8F71]" },
  badge: { bg: "bg-gradient-to-br from-[#B8A060]/15 to-[#B8A060]/5", text: "text-[#B8A060]" },
  team: { bg: "bg-gradient-to-br from-[#BFA094]/15 to-[#BFA094]/5", text: "text-[#BFA094]" },
  system: { bg: "bg-gradient-to-br from-[#A18072]/10 to-[#A18072]/4", text: "text-[#A18072]" },
};

const typeStripeColors: Record<NotificationType, string> = {
  task: "border-l-[#A18072]",
  payment: "border-l-[#6B8F71]",
  badge: "border-l-[#B8A060]",
  team: "border-l-[#BFA094]",
  system: "border-l-[#A18072]",
};

const tabs = [
  { value: "all", label: "All" },
  { value: "task", label: "Tasks" },
  { value: "payment", label: "Payments" },
  { value: "badge", label: "Badges" },
  { value: "team", label: "Team" },
  { value: "system", label: "System" },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const typeFilter = activeTab === "all" ? undefined : activeTab;
  const { data: notifications, isLoading } = useNotifications(
    typeFilter ? { type: typeFilter } : undefined,
  );
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  if (isLoading || !notifications) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-[var(--radius)]" />
          ))}
        </div>
      </PageTransition>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gradient-warm">
              Notifications
            </h1>
            <p className="mt-1 text-text-secondary">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllRead.mutate()}
            >
              <CheckCheck className="h-4 w-4 mr-1" /> Mark all read
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {notifications.length === 0 ? (
                <EmptyState
                  icon={Bell}
                  title="No notifications"
                  description={`No ${tab.value === "all" ? "" : tab.label.toLowerCase() + " "}notifications yet.`}
                  className="mt-4"
                />
              ) : (
                <div className="space-y-1 mt-4">
                  {notifications.map((notif, i) => {
                    const Icon = typeIcons[notif.type];
                    const style = typeStyles[notif.type];
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.02, ease: [0.33, 1, 0.68, 1] }}
                      >
                        <Link
                          href={notif.actionUrl || "#"}
                          onClick={() => {
                            if (!notif.read)
                              markRead.mutate(notif.id);
                          }}
                          className={cn(
                            "flex items-start gap-3 rounded-[var(--radius-md)] border-l-[3px] p-4 transition-all group",
                            typeStripeColors[notif.type],
                            notif.read
                              ? "hover:bg-black/[0.02] border-l-transparent"
                              : "bg-gradient-to-r from-[#A18072]/[0.04] to-transparent hover:from-[#A18072]/[0.06]",
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius)]",
                              style.bg,
                            )}
                          >
                            <Icon className={cn("h-4 w-4", style.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={cn(
                                  "text-sm",
                                  notif.read
                                    ? "text-text-secondary"
                                    : "text-text-deep font-semibold",
                                )}
                              >
                                {notif.title}
                              </p>
                              <span className="text-[11px] text-text-muted shrink-0">
                                {timeAgo(notif.createdAt)}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">
                              {notif.message}
                            </p>
                            {notif.actionLabel && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#A18072] font-medium mt-1 group-hover:underline">
                                {notif.actionLabel}
                                <ArrowRight className="h-3 w-3" />
                              </span>
                            )}
                          </div>
                          {!notif.read && (
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#A18072] mt-2 animate-[pulse-soft_2s_ease_infinite]" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PageTransition>
  );
}
