"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { useUnreadCount } from "@/hooks/use-notifications";
import { useTaskStatusCounts } from "@/hooks/use-tasks";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  ListTodo,
  Dna,
  BookOpen,
  Users,
  Wallet,
  ScrollText,
  Settings,
  LogOut,
  X,
  ChevronsUpDown,
  User,
  Bell,
} from "lucide-react";

/* ─── Navigation ─── */
const navGroups = [
  {
    id: "main",
    items: [
      { href: "/workspace", label: "Dashboard", icon: LayoutDashboard, countKey: undefined },
    ],
  },
  {
    id: "work",
    label: "Work",
    items: [
      { href: "/workspace/tasks", label: "My Tasks", icon: ListTodo, countKey: "in_progress" as const },
      { href: "/workspace/skills", label: "Skill Genome", icon: Dna, countKey: undefined },
      { href: "/workspace/learning", label: "Learning", icon: BookOpen, countKey: undefined },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    items: [
      { href: "/workspace/team", label: "My Team", icon: Users, countKey: undefined },
      { href: "/workspace/earnings", label: "Earnings", icon: Wallet, countKey: undefined },
      { href: "/workspace/podl", label: "PoDL Transcript", icon: ScrollText, countKey: undefined },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen } = useUIStore();
  const { user, logout } = useAuthStore();
  const { data: unreadCount } = useUnreadCount();
  const { data: taskCounts } = useTaskStatusCounts();

  if (!user) return null;

  const checkActive = (href: string) =>
    pathname === href ||
    (href !== "/workspace" && pathname.startsWith(href));

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "fixed z-50 flex flex-col overflow-hidden",
          "inset-y-0 left-0",
          "lg:relative lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        style={{
          background: "var(--color-surface-sidebar)",
          borderRight: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* ── Logo ── */}
        <div
          className={cn(
            "shrink-0 flex items-center",
            sidebarCollapsed ? "justify-center h-[76px]" : "h-[76px] px-6",
          )}
        >
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3">
              <div
                className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] font-heading font-bold text-[14px] shrink-0"
                style={{
                  background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                  color: "var(--color-primary)",
                }}
              >
                G
              </div>
              <div className="min-w-0">
                <span className="font-heading font-bold text-[15px] tracking-[-0.01em] text-neutral-900 block leading-none">
                  Glimmora
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-400 block mt-1">
                  Team Platform
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden ml-auto p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] font-heading font-bold text-[14px]"
              style={{
                background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                color: "var(--color-primary)",
              }}
            >
              G
            </div>
          )}
        </div>

        {/* Separator */}
        <div className={cn("mx-4 shrink-0", sidebarCollapsed && "mx-3")}>
          <div
            className="h-px"
            style={{ background: "rgba(0,0,0,0.06)" }}
          />
        </div>

        {/* ═══ Navigation ═══ */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto",
            sidebarCollapsed ? "px-3 pt-4 pb-3" : "px-3 pt-4 pb-3",
          )}
        >
          {navGroups.map((group, gi) => (
            <div key={group.id} className={cn(gi > 0 && (sidebarCollapsed ? "mt-5" : "mt-6"))}>
              {/* Group label */}
              {group.label && !sidebarCollapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                  {group.label}
                </p>
              )}
              {group.label && sidebarCollapsed && (
                <div className="flex justify-center mb-2">
                  <div
                    className="h-px w-5"
                    style={{ background: "rgba(0,0,0,0.06)" }}
                  />
                </div>
              )}

              <div className={cn(sidebarCollapsed ? "space-y-1" : "space-y-0.5")}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = checkActive(item.href);
                  const count = item.countKey && taskCounts ? taskCounts[item.countKey] : undefined;

                  /* Collapsed */
                  if (sidebarCollapsed) {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "relative flex h-10 w-10 mx-auto items-center justify-center rounded-[10px] transition-all duration-150",
                          active
                            ? "text-secondary"
                            : "text-neutral-400 hover:text-neutral-600",
                        )}
                      >
                        {active && (
                          <motion.div
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-[10px]"
                            style={{
                              background: "white",
                              boxShadow: "var(--shadow-warm-sm)",
                              border: "1px solid rgba(0,0,0,0.06)",
                            }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                          />
                        )}
                        {!active && (
                          <span
                            className="absolute inset-0 rounded-[10px] opacity-0 hover:opacity-100 transition-opacity duration-150"
                            style={{ background: "rgba(0,0,0,0.03)" }}
                          />
                        )}
                        <Icon className="relative z-10 h-[18px] w-[18px]" />
                        {count !== undefined && count > 0 && (
                          <span
                            className="absolute top-0.5 right-0.5 h-[6px] w-[6px] rounded-full bg-secondary z-10 ring-2"
                            style={{ ["--tw-ring-color" as string]: "var(--color-surface-sidebar)" }}
                          />
                        )}
                      </Link>
                    );
                  }

                  /* Expanded */
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-[10px] transition-all duration-150",
                        active
                          ? "text-neutral-900"
                          : "text-neutral-600 hover:text-neutral-900",
                        "px-3 py-[10px]",
                      )}
                    >
                      {/* Active: white pill */}
                      {active && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-[10px]"
                          style={{
                            background: "white",
                            boxShadow: "var(--shadow-warm-sm)",
                            border: "1px solid rgba(0,0,0,0.06)",
                          }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                        />
                      )}
                      {/* Hover: subtle tint */}
                      {!active && (
                        <span
                          className="absolute inset-0 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                          style={{ background: "rgba(0,0,0,0.03)" }}
                        />
                      )}
                      <div
                        className={cn(
                          "relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-[8px] shrink-0 transition-colors duration-150",
                          active
                            ? "text-secondary"
                            : "text-neutral-400 group-hover:text-neutral-600",
                        )}
                        style={active ? {
                          background: "color-mix(in srgb, var(--color-secondary) 10%, transparent)",
                        } : undefined}
                      >
                        <Icon className="h-[16px] w-[16px]" />
                      </div>
                      <span className={cn(
                        "relative z-10 text-[13.5px] truncate flex-1",
                        active ? "font-semibold" : "font-medium",
                      )}>
                        {item.label}
                      </span>
                      {count !== undefined && count > 0 && (
                        <span
                          className={cn(
                            "relative z-10 text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                            active ? "text-secondary bg-secondary/[0.12]" : "text-neutral-500 bg-neutral-100",
                          )}
                        >
                          {count}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ═══ Profile (bottom) ═══ */}
        <div className={cn("shrink-0", sidebarCollapsed ? "px-3 pb-4" : "px-3 pb-4")}>
          {/* Separator */}
          <div className={cn(sidebarCollapsed ? "mx-0 mb-4" : "mx-1 mb-4")}>
            <div
              className="h-px"
              style={{ background: "rgba(0,0,0,0.06)" }}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center text-left transition-all duration-150 rounded-[12px]",
                  sidebarCollapsed
                    ? "justify-center p-2"
                    : "gap-3 px-3 py-2.5",
                )}
              >
                <div className="relative shrink-0">
                  <Avatar
                    name={user.name}
                    size="sm"
                    className="ring-2 ring-neutral-200"
                  />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-[2px]"
                    style={{ borderColor: "var(--color-surface-sidebar)" }}
                  />
                </div>
                {!sidebarCollapsed && (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-semibold text-neutral-900 truncate leading-none">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-neutral-500 truncate mt-1">
                        {user.role}
                      </p>
                    </div>
                    <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-neutral-300" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-[230px]">
              <DropdownMenuLabel>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/workspace/notifications" className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4" /> Notifications
                  </span>
                  {(unreadCount ?? 0) > 0 && (
                    <span className="text-[10px] font-bold text-white bg-error rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/workspace/profile">
                  <User className="h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/workspace/settings">
                  <Settings className="h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-error"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>
    </>
  );
}
