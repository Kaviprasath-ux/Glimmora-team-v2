"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Search, Command, ChevronRight } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";

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

export function Header() {
  const pathname = usePathname();
  const { toggleSidebar } = useUIStore();

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

  /* Current page title — last breadcrumb */
  const pageTitle = breadcrumbs.length > 0
    ? breadcrumbs[breadcrumbs.length - 1].label
    : "Workspace";

  return (
    <header
      className="sticky top-0 z-30 flex h-[56px] items-center justify-between px-5 lg:px-7"
      style={{
        background: "rgba(250,247,244,0.85)",
        backdropFilter: "blur(16px) saturate(1.4)",
        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
        borderBottom: "1px solid rgba(161,128,114,0.06)",
      }}
    >
      {/* Left: Hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 -ml-2 rounded-[10px] text-[#9C8E84] hover:text-[#5C4F47] hover:bg-black/[0.03] transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="h-3 w-3 text-[#C4B8AF]" />
              )}
              {crumb.isLast ? (
                <span className="font-semibold text-[#43302B] text-[13.5px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-[#9C8E84] text-[13px] transition-colors hover:text-[#5C4F47]"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Right: Search pill */}
      <div className="flex items-center">
        <button
          className="flex items-center gap-2.5 rounded-[10px] px-3.5 py-[7px] text-sm transition-all duration-150 hover:bg-white/80"
          style={{
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(161,128,114,0.08)",
            boxShadow: "0 1px 3px rgba(67,48,43,0.03)",
          }}
        >
          <Search className="h-3.5 w-3.5 text-[#B5A99F]" />
          <span className="hidden sm:inline text-[12.5px] text-[#9C8E84]">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-[6px] px-1.5 py-[2px] text-[10px] font-medium text-[#B5A99F] bg-[#F5F0EB] border border-[#E8DED6]">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>
      </div>
    </header>
  );
}
