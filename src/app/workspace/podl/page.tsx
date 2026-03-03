"use client";

import { useState, useMemo } from "react";
import {
  PageTransition,
  Card,
  MetricTile,
  Skeleton,
  Badge,
  StatusBadge,
  SkillChip,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui";
import { usePoDLRecords, usePoDLStats } from "@/hooks/use-podl";
import {
  ScrollText,
  Trophy,
  Star,
  Layers,
  Download,
  LayoutGrid,
  LayoutList,
  ArrowUpDown,
  FileText,
  Hash,
} from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

type SortKey = "completedAt" | "payout" | "taskTitle";
type SortDir = "asc" | "desc";

export default function PoDLPage() {
  const { data: records, isLoading: recordsLoading } = usePoDLRecords();
  const { data: stats, isLoading: statsLoading } = usePoDLStats();
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [sortKey, setSortKey] = useState<SortKey>("completedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [projectFilter, setProjectFilter] = useState("all");
  const [showExport, setShowExport] = useState(false);

  const sorted = useMemo(() => {
    if (!records) return [];
    let filtered =
      projectFilter === "all"
        ? [...records]
        : records.filter((r) => r.projectName === projectFilter);
    filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return filtered;
  }, [records, sortKey, sortDir, projectFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  if (recordsLoading || statsLoading || !records || !stats) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-[var(--radius-xl)]" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-[var(--radius-xl)]" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gradient-warm">
              PoDL Transcript
            </h1>
            <p className="mt-1 text-text-secondary">
              Your verified Proof-of-Delivery Ledger.
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowExport(true)}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricTile
            label="Total Records"
            value={stats.totalRecords}
            icon={ScrollText}
            accent="warm"
            delay={0}
          />
          <MetricTile
            label="Total Earned"
            value={formatCurrency(stats.totalEarnings)}
            icon={Trophy}
            accent="olive"
            delay={0.1}
          />
          <MetricTile
            label="Exemplary"
            value={stats.exemplaryCount}
            icon={Star}
            accent="gold"
            delay={0.2}
          />
          <MetricTile
            label="Skills Proven"
            value={stats.uniqueSkills}
            icon={Layers}
            accent="terracotta"
            delay={0.3}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="h-9 rounded-[var(--radius)] border border-black/[0.08] bg-white px-3 text-sm text-text-deep focus:ring-2 focus:ring-[#A18072]/30 focus:border-[#A18072] transition-all"
            >
              <option value="all">All Projects</option>
              <option value="FinTech Dashboard API">FinTech Dashboard</option>
              <option value="EduConnect Platform">EduConnect</option>
            </select>
          </div>
          <div className="flex items-center gap-1 bg-black/[0.03] rounded-[var(--radius)] p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-2 rounded-[var(--radius-sm)] transition-all duration-200",
                viewMode === "table"
                  ? "bg-white text-text-deep shadow-warm-sm"
                  : "text-text-muted hover:text-text-deep",
              )}
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={cn(
                "p-2 rounded-[var(--radius-sm)] transition-all duration-200",
                viewMode === "card"
                  ? "bg-white text-text-deep shadow-warm-sm"
                  : "text-text-muted hover:text-text-deep",
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" ? (
          <div className="rounded-[var(--radius-xl)] bg-white border border-black/[0.04] shadow-warm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-premium w-full text-sm">
                <thead>
                  <tr>
                    <th
                      className="px-6 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide cursor-pointer hover:text-text-deep"
                      onClick={() => toggleSort("taskTitle")}
                    >
                      <span className="inline-flex items-center gap-1">
                        Task <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                      Project
                    </th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                      Skills
                    </th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                      Verdict
                    </th>
                    <th
                      className="px-4 py-3.5 text-right text-[11px] font-semibold text-text-muted uppercase tracking-wide cursor-pointer hover:text-text-deep"
                      onClick={() => toggleSort("payout")}
                    >
                      <span className="inline-flex items-center gap-1">
                        Payout <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th
                      className="px-6 py-3.5 text-right text-[11px] font-semibold text-text-muted uppercase tracking-wide cursor-pointer hover:text-text-deep"
                      onClick={() => toggleSort("completedAt")}
                    >
                      <span className="inline-flex items-center gap-1">
                        Date <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-text-deep">
                          {record.taskTitle}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-text-secondary">
                        {record.projectName}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1 flex-wrap">
                          {record.skills.slice(0, 2).map((s) => (
                            <SkillChip key={s} skill={s} />
                          ))}
                          {record.skills.length > 2 && (
                            <span className="text-[11px] text-text-muted self-center">
                              +{record.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant={
                            record.verdict === "exemplary"
                              ? "warning"
                              : "success"
                          }
                        >
                          {record.verdict}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-[#6B8F71] tabular-nums">
                        {formatCurrency(record.payout)}
                      </td>
                      <td className="px-6 py-3.5 text-right text-text-muted">
                        {formatDate(record.completedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((record) => (
              <div
                key={record.id}
                className={cn(
                  "rounded-[var(--radius-xl)] bg-white border border-black/[0.04] p-5 shadow-warm hover-lift transition-all overflow-hidden relative",
                  record.verdict === "exemplary" && "shadow-[0_4px_20px_rgba(184,164,76,0.12)]",
                )}
              >
                {/* Top stripe based on verdict */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-[3px]",
                  record.verdict === "exemplary"
                    ? "bg-gradient-to-r from-[#B8A060] to-[#C9B85C]"
                    : "bg-gradient-to-r from-[#5A6B4A] to-[#7A8F66]",
                )} />

                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant={
                      record.verdict === "exemplary" ? "warning" : "success"
                    }
                  >
                    {record.verdict}
                  </Badge>
                  <span className="text-[11px] text-text-muted font-mono bg-black/[0.03] rounded-full px-2 py-0.5 flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {record.hash}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-text-deep">
                  {record.taskTitle}
                </h4>
                <p className="text-[11px] text-text-muted mt-1">
                  {record.projectName}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {record.skills.map((s) => (
                    <SkillChip key={s} skill={s} />
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-black/[0.04] flex items-center justify-between text-sm">
                  <span className="font-bold text-[#6B8F71] tabular-nums">
                    {formatCurrency(record.payout)}
                  </span>
                  <span className="text-text-muted text-[11px]">
                    {formatDate(record.completedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Export Dialog */}
        <Dialog open={showExport} onOpenChange={setShowExport}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export PoDL Transcript</DialogTitle>
              <DialogDescription>
                Download your Proof-of-Delivery Ledger in your preferred format.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 my-4">
              {[
                { label: "PDF Document", desc: "Printable transcript", icon: FileText, accent: "from-[#8E4A55]/12 to-[#8E4A55]/5" },
                { label: "JSON Data", desc: "Machine-readable format", icon: Hash, accent: "from-[#A18072]/12 to-[#A18072]/5" },
                { label: "Shareable Link", desc: "Public verification link", icon: Layers, accent: "from-[#5A6B4A]/12 to-[#5A6B4A]/5" },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setShowExport(false)}
                  className="flex items-center gap-3 w-full rounded-[var(--radius-md)] border border-black/[0.06] p-4 hover:bg-black/[0.02] hover:shadow-warm-sm transition-all text-left"
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br", opt.accent)}>
                    <opt.icon className="h-5 w-5 text-text-deep" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-deep">
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-text-muted">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
