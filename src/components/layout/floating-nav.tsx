"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useUnreadCount } from "@/hooks/use-notifications";
import { Avatar } from "@/components/ui/avatar";
import { NotificationPopover } from "./notification-popover";
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
  User,
  Search,
  Command,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/workspace", label: "Home", icon: LayoutDashboard },
  { href: "/workspace/tasks", label: "Tasks", icon: ListTodo },
  { href: "/workspace/skills", label: "Skills", icon: Dna },
  { href: "/workspace/learning", label: "Learn", icon: BookOpen },
  { href: "/workspace/earnings", label: "Earnings", icon: Wallet },
  { href: "/workspace/team", label: "Team", icon: Users },
  { href: "/workspace/podl", label: "PoDL", icon: ScrollText },
];

function NavItem({
  item,
  isActive,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link href={item.href} className="floating-nav-item relative">
      {isActive && (
        <motion.div
          layoutId="floating-pill"
          className="floating-nav-pill"
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        />
      )}
      <Icon className={cn("h-4 w-4 relative z-10 shrink-0", isActive && "text-white")} />
      <span className={cn("relative z-10 hidden lg:inline", isActive && "text-white font-semibold")}>
        {item.label}
      </span>
    </Link>
  );
}

function MobileNavItem({
  item,
  isActive,
  onNavigate,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all min-w-0",
        isActive
          ? "text-primary-dark"
          : "text-text-muted",
      )}
    >
      <div className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
        isActive && "bg-gradient-to-br from-primary to-primary-dark shadow-[0_2px_12px_rgba(161,128,114,0.3)]",
      )}>
        <Icon className={cn("h-[18px] w-[18px]", isActive ? "text-white" : "")} />
      </div>
      <span className={cn("text-[10px] font-medium truncate", isActive && "font-semibold")}>
        {item.label}
      </span>
    </Link>
  );
}

export function FloatingNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { data: unreadCount } = useUnreadCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const checkActive = (href: string) =>
    pathname === href ||
    (href !== "/workspace" && pathname.startsWith(href));

  return (
    <>
      {/* ─── Desktop Floating Nav ─── */}
      <nav className="floating-nav hidden md:flex items-center gap-0.5">
        {/* Logo */}
        <Link href="/workspace" className="flex items-center gap-2 pl-2 pr-3 mr-1">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg font-heading font-bold text-[11px] text-white shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
              boxShadow: "0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent)",
            }}
          >
            G
          </div>
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-primary/10 mr-1" />

        {/* Nav Items */}
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} isActive={checkActive(item.href)} />
        ))}

        {/* Divider */}
        <div className="h-5 w-px bg-primary/10 ml-1 mr-1" />

        {/* Right Side Actions */}
        <div className="flex items-center gap-0.5 pr-1">
          {/* Search */}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-text-muted hover:text-primary-dark hover:bg-primary/[0.06] transition-all text-[13px]">
            <Search className="h-4 w-4" />
            <kbd className="hidden xl:inline-flex items-center gap-0.5 rounded-md bg-black/[0.04] border border-black/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-text-muted">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>

          {/* Notifications */}
          <NotificationPopover />

          {/* User Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center rounded-full p-1 hover:bg-primary/[0.06] transition-all ml-0.5">
                <Avatar name={user.name} size="sm" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12} className="w-[220px]">
              <DropdownMenuLabel>
                <div>
                  <p className="text-sm font-medium text-text-deep">{user.name}</p>
                  <p className="text-xs text-text-muted">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
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
              <DropdownMenuItem asChild>
                <Link href="/workspace/notifications">
                  <span className="relative">
                    <Settings className="h-4 w-4" />
                  </span>
                  Notifications
                  {(unreadCount ?? 0) > 0 && (
                    <span className="ml-auto text-[10px] bg-error/10 text-error px-1.5 py-0.5 rounded-full font-medium">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-accent-terracotta">
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* ─── Mobile Top Bar ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between h-14 px-4"
        style={{
          background: "rgba(245, 240, 232, 0.85)",
          backdropFilter: "blur(20px) saturate(1.6)",
          WebkitBackdropFilter: "blur(20px) saturate(1.6)",
          borderBottom: "1px solid color-mix(in srgb, var(--color-primary) 6%, transparent)",
        }}
      >
        <Link href="/workspace" className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[10px] font-heading font-bold text-xs text-white"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
              boxShadow: "0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent)",
            }}
          >
            G
          </div>
          <span className="font-heading font-bold text-[15px] text-text-deep">Glimmora</span>
        </Link>

        <div className="flex items-center gap-1">
          <NotificationPopover />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-full">
                <Avatar name={user.name} size="sm" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-[200px]">
              <DropdownMenuLabel>
                <p className="text-sm font-medium text-text-deep">{user.name}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/workspace/profile"><User className="h-4 w-4" /> Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/workspace/settings"><Settings className="h-4 w-4" /> Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-accent-terracotta">
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ─── Mobile Bottom Tab Bar ─── */}
      <div className="mobile-nav-drawer md:hidden">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => (
            <MobileNavItem
              key={item.href}
              item={item}
              isActive={checkActive(item.href)}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          ))}
          {/* More button for remaining items */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all",
              mobileMenuOpen ? "text-primary-dark" : "text-text-muted",
            )}
          >
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
              mobileMenuOpen && "bg-primary/10",
            )}>
              {mobileMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </div>
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </div>

      {/* ─── Mobile More Menu ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-90 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
              className="fixed bottom-[72px] left-4 right-4 z-[95] rounded-2xl p-3 md:hidden"
              style={{
                background: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid color-mix(in srgb, var(--color-primary) 8%, transparent)",
                boxShadow: "0 -4px 24px rgba(45, 35, 25, 0.08)",
              }}
            >
              <div className="grid grid-cols-2 gap-1">
                {navItems.slice(5).map((item) => {
                  const Icon = item.icon;
                  const isActive = checkActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                        isActive
                          ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_2px_12px_rgba(161,128,114,0.3)]"
                          : "text-primary-dark hover:bg-primary/[0.06]",
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
