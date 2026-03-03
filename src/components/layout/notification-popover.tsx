"use client";

import { useState } from "react";
import Link from "next/link";
import * as Popover from "@radix-ui/react-popover";
import { Bell, ListTodo, Wallet, Award, Users, Info, ArrowRight, CheckCheck } from "lucide-react";
import { useNotifications, useUnreadCount, useMarkRead, useMarkAllRead } from "@/hooks/use-notifications";
import { timeAgo, cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const typeIcons: Record<NotificationType, React.ElementType> = {
  task: ListTodo,
  payment: Wallet,
  badge: Award,
  team: Users,
  system: Info,
};

const typeColors: Record<NotificationType, string> = {
  task: "text-info bg-info/10",
  payment: "text-success bg-success/10",
  badge: "text-accent-gold bg-accent-gold/10",
  team: "text-secondary bg-secondary/10",
  system: "text-text-muted bg-primary/5",
};

export function NotificationPopover() {
  const [open, setOpen] = useState(false);
  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const recent = notifications?.slice(0, 5) ?? [];
  const hasUnread = (unreadCount ?? 0) > 0;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="relative p-2 rounded-[var(--radius)] text-text-muted transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error ring-2 ring-surface-card" />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 w-[380px] rounded-[var(--radius-lg)] border border-primary/8 bg-surface-card shadow-warm-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=open]:slide-in-from-top-1",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98]",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-primary/6">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-semibold text-text-deep">Notifications</h3>
              {hasUnread && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-error/10 text-error text-[11px] font-medium">
                  {unreadCount}
                </span>
              )}
            </div>
            {hasUnread && (
              <button
                onClick={() => markAllRead.mutate()}
                className="flex items-center gap-1 text-[11px] text-text-muted transition-colors"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto">
            {recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Bell className="h-8 w-8 text-text-muted/40 mb-2" />
                <p className="text-sm text-text-muted">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-primary/4">
                {recent.map((notif) => {
                  const Icon = typeIcons[notif.type];
                  return (
                    <Link
                      key={notif.id}
                      href={notif.actionUrl || "/workspace/notifications"}
                      onClick={() => {
                        if (!notif.read) markRead.mutate(notif.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 transition-colors",
                        !notif.read && "bg-primary/[0.03]",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5",
                          typeColors[notif.type],
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-[13px] leading-snug",
                            notif.read
                              ? "text-text-secondary"
                              : "text-text-deep font-medium",
                          )}
                        >
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">
                          {notif.message}
                        </p>
                        <p className="text-[11px] text-text-muted/70 mt-1">
                          {timeAgo(notif.createdAt)}
                        </p>
                      </div>
                      {!notif.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary mt-2" />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-primary/6 px-4 py-2.5">
            <Link
              href="/workspace/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 text-[13px] font-medium text-primary transition-colors"
            >
              View All Notifications
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
