"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen } = useUIStore();
  const { user } = useAuthStore();
  const { data: unreadCount } = useUnreadCount();
  const { data: taskCounts } = useTaskStatusCounts();

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
          "bg-[#F5F0EB] border-r border-[#E8DED6]",
          "lg:relative lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
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
                className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] font-heading font-bold text-[14px] text-white shrink-0"
                style={{
                  background: "linear-gradient(145deg, #A18072, #846358)",
                  boxShadow: "0 3px 12px rgba(132,99,88,0.3)",
                }}
              >
                G
              </div>
              <div className="min-w-0">
                <span className="font-heading font-bold text-[15px] tracking-[-0.01em] text-[#43302B] block leading-none">
                  Glimmora
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#A18072]/45 block mt-1">
                  Team Platform
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden ml-auto p-1.5 rounded-lg text-[#9C8E84] hover:text-[#5C4F47] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] font-heading font-bold text-[14px] text-white"
              style={{
                background: "linear-gradient(145deg, #A18072, #846358)",
                boxShadow: "0 3px 12px rgba(132,99,88,0.3)",
              }}
            >
              G
            </div>
          )}
        </div>

        {/* ═══ Navigation ═══ */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto",
            sidebarCollapsed ? "px-3 pt-4 pb-3" : "px-4 pt-3 pb-3",
          )}
        >
          {navGroups.map((group, gi) => (
            <div key={group.id} className={cn(gi > 0 && (sidebarCollapsed ? "mt-5" : "mt-7"))}>
              {/* Group label */}
              {group.label && !sidebarCollapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A18072]/40">
                  {group.label}
                </p>
              )}
              {group.label && sidebarCollapsed && (
                <div className="flex justify-center mb-2">
                  <div className="h-px w-5 bg-[#D2BAB0]/50" />
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
                            ? "text-[#A18072]"
                            : "text-[#B5A99F] hover:text-[#846358] hover:bg-white/50",
                        )}
                      >
                        {active && (
                          <motion.div
                            layoutId="nav-pill"
                            className="absolute inset-0 rounded-[10px] bg-white"
                            style={{ boxShadow: "0 1px 6px rgba(161,128,114,0.12)" }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                          />
                        )}
                        <Icon className="relative z-10 h-[18px] w-[18px]" />
                        {count !== undefined && count > 0 && (
                          <span className="absolute top-0.5 right-0.5 h-[6px] w-[6px] rounded-full bg-[#8E4A55] z-10" />
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
                        "group relative flex items-center gap-3 px-3 py-[10px] rounded-[10px] transition-all duration-150",
                        active
                          ? "text-[#43302B]"
                          : "text-[#9C8E84] hover:text-[#5C4F47] hover:bg-white/40",
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-[10px] bg-white"
                          style={{ boxShadow: "0 1px 8px rgba(161,128,114,0.1), 0 0 0 1px rgba(161,128,114,0.04)" }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                        />
                      )}
                      <Icon
                        className={cn(
                          "relative z-10 h-[18px] w-[18px] shrink-0 transition-colors duration-150",
                          active ? "text-[#A18072]" : "text-[#B5A99F] group-hover:text-[#9C8E84]",
                        )}
                      />
                      <span className={cn(
                        "relative z-10 text-[13.5px] truncate flex-1",
                        active ? "font-semibold" : "font-medium",
                      )}>
                        {item.label}
                      </span>
                      {count !== undefined && count > 0 && (
                        <span className={cn(
                          "relative z-10 text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                          active ? "bg-[#A18072]/10 text-[#A18072]" : "bg-black/[0.04] text-[#9C8E84]",
                        )}>
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

        {/* ═══ Profile (bottom) — dropdown includes notifications ═══ */}
        <div className={cn("shrink-0", sidebarCollapsed ? "px-3 pb-4" : "px-4 pb-4")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center text-left transition-all duration-150 rounded-[12px]",
                  sidebarCollapsed
                    ? "justify-center p-2 hover:bg-white/50"
                    : "gap-3 px-3 py-3 hover:bg-white/40",
                )}
              >
                <div className="relative shrink-0">
                  <Avatar name={user.name} size="sm" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#6B8F71] border-[2px] border-[#F5F0EB]" />
                </div>
                {!sidebarCollapsed && (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-semibold text-[#43302B] truncate leading-none">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-[#9C8E84] truncate mt-1">
                        {user.role}
                      </p>
                    </div>
                    <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-[#C4B8AF]" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-[230px]">
              <DropdownMenuLabel>
                <div>
                  <p className="text-sm font-medium text-text-deep">{user.name}</p>
                  <p className="text-xs text-text-muted">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/workspace/notifications" className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4" /> Notifications
                  </span>
                  {(unreadCount ?? 0) > 0 && (
                    <span className="text-[10px] font-bold text-white bg-[#8E4A55] rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
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
              <DropdownMenuItem className="text-error">
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.aside>
    </>
  );
}
