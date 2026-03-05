"use client";

import { useState, useMemo } from "react";
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
  ChevronDown,
} from "lucide-react";
import { timeAgo, cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const ITEMS_PER_PAGE = 20;

/* ── Animations ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.02 } },
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

/* ── Type → icon mapping ── */
const typeIcons: Record<NotificationType, React.ElementType> = {
  task: ListTodo,
  payment: Wallet,
  badge: Award,
  team: Users,
  system: Info,
};

/* ── Type → color token mapping ── */
const typeColors: Record<NotificationType, string> = {
  task: "var(--color-primary)",
  payment: "var(--color-accent-sage)",
  badge: "var(--color-accent-gold)",
  team: "var(--color-secondary)",
  system: "var(--color-accent-terracotta)",
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
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const typeFilter = activeTab === "all" ? undefined : activeTab;
  const { data: notifications, isLoading } = useNotifications(
    typeFilter ? { type: typeFilter } : undefined,
  );
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const visibleNotifications = useMemo(
    () => (notifications ?? []).slice(0, visibleCount),
    [notifications, visibleCount],
  );
  const remaining = (notifications?.length ?? 0) - visibleCount;

  if (isLoading || !notifications) {
    return (
      <PageTransition>
        <div className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-96 rounded-xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </PageTransition>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <PageTransition>
      <motion.div
        className="space-y-5"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* ── Hero ── */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
              Updates
            </p>
            <h1
              className="font-heading font-bold text-neutral-950 leading-tight"
              style={{ fontSize: 28, letterSpacing: "-0.025em" }}
            >
              Notifications
            </h1>
            <p className="mt-1.5 text-[13px] text-neutral-500 leading-relaxed">
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
        </motion.div>

        {/* ── Tabs + List ── */}
        <motion.div variants={fadeUp}>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
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
                  <>
                    <div
                      className="rounded-2xl bg-white overflow-hidden mt-4"
                      style={cardStyle}
                    >
                      {visibleNotifications.map((notif, i) => {
                        const Icon = typeIcons[notif.type];
                        const color = typeColors[notif.type];
                        const isLast =
                          i === visibleNotifications.length - 1;

                        return (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.25,
                              delay: i * 0.02,
                              ease: [0.33, 1, 0.68, 1],
                            }}
                          >
                            <Link
                              href={notif.actionUrl || "#"}
                              onClick={() => {
                                if (!notif.read) markRead.mutate(notif.id);
                              }}
                              className={cn(
                                "flex items-start gap-3 px-5 py-4 transition-all group",
                                notif.read
                                  ? "hover:bg-neutral-50"
                                  : "bg-primary/[0.02] hover:bg-primary/[0.04]",
                              )}
                              style={
                                !isLast
                                  ? {
                                      borderBottom:
                                        "1px solid rgba(0,0,0,0.04)",
                                    }
                                  : undefined
                              }
                            >
                              <div
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                                style={{
                                  background: `color-mix(in srgb, ${color} 10%, transparent)`,
                                }}
                              >
                                <Icon
                                  className="h-4 w-4"
                                  style={{ color }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p
                                    className={cn(
                                      "text-sm",
                                      notif.read
                                        ? "text-neutral-500"
                                        : "text-neutral-900 font-semibold",
                                    )}
                                  >
                                    {notif.title}
                                  </p>
                                  <span className="text-[11px] text-neutral-400 shrink-0">
                                    {timeAgo(notif.createdAt)}
                                  </span>
                                </div>
                                <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                                  {notif.message}
                                </p>
                                {notif.actionLabel && (
                                  <span
                                    className="inline-flex items-center gap-1 text-[11px] font-medium mt-1 group-hover:underline"
                                    style={{ color: "var(--color-primary)" }}
                                  >
                                    {notif.actionLabel}
                                    <ArrowRight className="h-3 w-3" />
                                  </span>
                                )}
                              </div>
                              {!notif.read && (
                                <span
                                  className="h-2.5 w-2.5 shrink-0 rounded-full mt-2 animate-[pulse-soft_2s_ease_infinite]"
                                  style={{
                                    background: "var(--color-primary)",
                                  }}
                                />
                              )}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>

                    {remaining > 0 && (
                      <div className="flex justify-center mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setVisibleCount((c) => c + ITEMS_PER_PAGE)
                          }
                        >
                          <ChevronDown className="h-4 w-4 mr-1.5" />
                          Show more ({Math.min(remaining, ITEMS_PER_PAGE)} of{" "}
                          {remaining} remaining)
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
