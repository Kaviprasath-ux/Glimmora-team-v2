"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Search, Command, ChevronRight, Bell, ArrowRight, ListTodo, Wallet, Award, Users, Info } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { useNotifications, useUnreadCount, useMarkRead } from "@/hooks/use-notifications";
import { timeAgo, cn } from "@/lib/utils";
import type { NotificationType } from "@/types";

const breadcrumbLabels: Record<string, string> = {
  workspace: "Workspace",
  tasks: "My Tasks",
  skills: "Skill Genome",
  learning: "Learning Hub",
  team: "My Team",
  earnings: "Earnings",
  podl: "PoDL Transcript",
  notifications: "Notifications",
  profile: "Profile",
  settings: "Settings",
  submit: "Submit Work",
  review: "Review Feedback",
};

const dynamicParents: Record<string, string> = {
  tasks: "Task Details",
};

const typeIcons: Record<NotificationType, React.ElementType> = {
  task: ListTodo,
  payment: Wallet,
  badge: Award,
  team: Users,
  system: Info,
};

const typeColors: Record<NotificationType, string> = {
  task: "var(--color-primary)",
  payment: "var(--color-accent-sage)",
  badge: "var(--color-accent-gold)",
  team: "var(--color-secondary)",
  system: "var(--color-accent-terracotta)",
};

export function Header() {
  const pathname = usePathname();
  const { toggleSidebar } = useUIStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount } = useUnreadCount();
  const { data: notifications } = useNotifications();
  const markRead = useMarkRead();

  const recent = (notifications ?? []).slice(0, 5);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [showDropdown]);

  // Close dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
  }, [pathname]);

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => {
    const prev = i > 0 ? segments[i - 1] : null;
    const label =
      breadcrumbLabels[seg] ||
      (prev && dynamicParents[prev]) ||
      seg;
    return {
      label,
      href: "/" + segments.slice(0, i + 1).join("/"),
      isLast: i === segments.length - 1,
    };
  });

  return (
    <header
      className="sticky top-0 z-30 flex h-[56px] items-center justify-between px-5 lg:px-7"
      style={{
        background: "white",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Left: Hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-[10px] text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="h-3 w-3 text-neutral-300" />
              )}
              {crumb.isLast ? (
                <span className="font-semibold text-neutral-900 text-[13.5px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-neutral-400 text-[13px] transition-colors hover:text-neutral-600"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right: Notifications + Search */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className="relative flex items-center justify-center h-9 w-9 rounded-[10px] text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {(unreadCount ?? 0) > 0 && (
              <span
                className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full"
                style={{ background: "var(--color-primary)" }}
              />
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div
              className="absolute right-0 top-full mt-2 w-[360px] rounded-2xl bg-white overflow-hidden"
              style={{
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}
              >
                <p className="text-[13px] font-semibold text-neutral-900">
                  Notifications
                </p>
                {(unreadCount ?? 0) > 0 && (
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                      color: "var(--color-primary)",
                    }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>

              {/* Notification items */}
              <div className="max-h-[320px] overflow-y-auto">
                {recent.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="h-5 w-5 text-neutral-300 mx-auto mb-2" />
                    <p className="text-[12px] text-neutral-400">No notifications</p>
                  </div>
                ) : (
                  recent.map((notif, i) => {
                    const Icon = typeIcons[notif.type];
                    const color = typeColors[notif.type];
                    const isLast = i === recent.length - 1;
                    return (
                      <Link
                        key={notif.id}
                        href={notif.actionUrl || "/workspace/notifications"}
                        onClick={() => {
                          if (!notif.read) markRead.mutate(notif.id);
                          setShowDropdown(false);
                        }}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 transition-colors",
                          notif.read
                            ? "hover:bg-neutral-50"
                            : "bg-primary/[0.02] hover:bg-primary/[0.04]",
                        )}
                        style={
                          !isLast
                            ? { borderBottom: "1px solid rgba(0,0,0,0.04)" }
                            : undefined
                        }
                      >
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5"
                          style={{
                            background: `color-mix(in srgb, ${color} 10%, transparent)`,
                          }}
                        >
                          <Icon
                            className="h-3.5 w-3.5"
                            style={{ color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-[12.5px] leading-snug",
                              notif.read
                                ? "text-neutral-500"
                                : "text-neutral-900 font-semibold",
                            )}
                          >
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-neutral-300 mt-1 block">
                            {timeAgo(notif.createdAt)}
                          </span>
                        </div>
                        {!notif.read && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full mt-1.5"
                            style={{ background: "var(--color-primary)" }}
                          />
                        )}
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <Link
                href="/workspace/notifications"
                onClick={() => setShowDropdown(false)}
                className="flex items-center justify-center gap-1.5 px-4 py-3 text-[12px] font-semibold transition-colors hover:bg-neutral-50"
                style={{
                  color: "var(--color-primary)",
                  borderTop: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                View all notifications
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Search pill */}
        <button
          className="flex items-center gap-2.5 rounded-[10px] px-3.5 py-[7px] text-sm transition-all duration-150 hover:bg-neutral-50"
          style={{
            background: "white",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Search className="h-3.5 w-3.5 text-neutral-300" />
          <span className="hidden sm:inline text-[12.5px] text-neutral-500">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-[6px] px-1.5 py-[2px] text-[10px] font-medium text-neutral-400 bg-neutral-100 border border-neutral-200">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>
      </div>
    </header>
  );
}
