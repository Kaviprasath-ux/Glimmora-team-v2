"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  PageTransition,
  Skeleton,
  StatusBadge,
  Pagination,
} from "@/components/ui";
import { useEarningsSummary, useEarningsRecords } from "@/hooks/use-earnings";
import { ArrowUpRight, Wallet } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false, loading: () => <Skeleton className="h-80" /> },
);

export default function EarningsPage() {
  const { data: summary, isLoading: summaryLoading } = useEarningsSummary();
  const { data: records, isLoading: recordsLoading } = useEarningsRecords();

  const [currentPage, setCurrentPage] = useState(1);

  const { chartData, peakMonth } = useMemo(() => {
    if (!summary)
      return { chartData: [], peakMonth: { month: "", amount: 0 } };
    let peak = { month: "", amount: 0 };
    const points = summary.monthlyData.map((d) => {
      if (d.amount > peak.amount) peak = { month: d.month, amount: d.amount };
      return { x: d.month.replace(" 20", " '"), y: d.amount };
    });
    return {
      chartData: [{ id: "earnings", data: points }],
      peakMonth: peak,
    };
  }, [summary]);

  const sortedRecords = useMemo(() => {
    if (!records) return [];
    return [...records].sort((a, b) => {
      const dateA = a.paidAt || a.createdAt;
      const dateB = b.paidAt || b.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }, [records]);

  if (summaryLoading || recordsLoading || !summary || !records) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid lg:grid-cols-12 gap-5">
            <Skeleton className="lg:col-span-8 h-96 rounded-[var(--radius-xl)]" />
            <Skeleton className="lg:col-span-4 h-96 rounded-[var(--radius-xl)]" />
          </div>
          <Skeleton className="h-80 rounded-[var(--radius-xl)]" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gradient-warm">Earnings</h1>
          <p className="mt-1 text-text-secondary">
            Track your income from outcome-based deliveries.
          </p>
        </div>

        {/* Chart-dominant layout: chart (8 cols, row-span-2) + metric sidebar (4 cols) */}
        <div className="grid lg:grid-cols-12 gap-5">
          {/* Chart Hero — col-span-8, row-span-2 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="lg:col-span-8 lg:row-span-2 rounded-[var(--radius-xl)] bg-white border border-black/[0.04] shadow-warm-md relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-mesh-pattern pointer-events-none opacity-40" />
            {/* Gradient bg behind chart */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#A18072]/[0.03] to-transparent pointer-events-none" />

            <div className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-text-deep">
                    Earnings Over Time
                  </h3>
                  <p className="text-sm text-text-muted mt-0.5">
                    Monthly income from completed deliveries
                  </p>
                </div>
                {/* Best month badge overlay */}
                <div className="rounded-[var(--radius-md)] bg-[#6B8F71]/[0.06] border border-[#6B8F71]/[0.08] px-3.5 py-2.5">
                  <p className="text-[10px] text-text-muted uppercase tracking-wide font-medium">Best month</p>
                  <p className="text-sm font-semibold text-text-deep mt-0.5">
                    {peakMonth.month}
                  </p>
                  <p className="text-base font-heading font-bold text-[#6B8F71] flex items-center gap-0.5">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {formatCurrency(peakMonth.amount)}
                  </p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveLine
                  data={chartData}
                  margin={{ top: 24, right: 30, bottom: 44, left: 60 }}
                  xScale={{ type: "point" }}
                  yScale={{ type: "linear", min: 0, max: "auto" }}
                  curve="monotoneX"
                  axisBottom={{
                    tickSize: 0,
                    tickPadding: 12,
                  }}
                  axisLeft={{
                    tickSize: 0,
                    tickPadding: 8,
                    tickValues: 5,
                    format: (v) => `₹${(v as number) / 1000}k`,
                  }}
                  colors={["#A18072"]}
                  lineWidth={3}
                  pointSize={12}
                  pointColor="#FFFFFF"
                  pointBorderWidth={3}
                  pointBorderColor="#A18072"
                  enableArea={true}
                  areaBaselineValue={0}
                  areaOpacity={1}
                  enableGridX={false}
                  enableGridY={true}
                  gridYValues={5}
                  defs={[
                    {
                      id: "areaGradient",
                      type: "linearGradient",
                      colors: [
                        { offset: 0, color: "#A18072", opacity: 0.2 },
                        { offset: 100, color: "#A18072", opacity: 0.01 },
                      ],
                    },
                  ]}
                  fill={[{ match: "*", id: "areaGradient" }]}
                  enablePointLabel={false}
                  theme={{
                    text: { fill: "#9C8E84", fontSize: 12 },
                    grid: {
                      line: {
                        stroke: "rgba(0,0,0,0.04)",
                        strokeDasharray: "4 4",
                      },
                    },
                    axis: {
                      ticks: {
                        text: { fill: "#9C8E84", fontSize: 12 },
                      },
                    },
                  }}
                  useMesh={true}
                  crosshairType="bottom"
                  tooltip={({ point }) => (
                    <div className="rounded-[var(--radius)] bg-[#1A1411] text-white px-3 py-2 text-xs shadow-warm-lg">
                      <p className="font-semibold">{point.data.xFormatted}</p>
                      <p className="text-white/70 mt-0.5">
                        {formatCurrency(point.data.y as number)}
                      </p>
                    </div>
                  )}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar — stacked metrics with dividers, NOT cards */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
            className="lg:col-span-4 lg:row-span-2 rounded-[var(--radius-xl)] bg-white border border-black/[0.04] shadow-warm p-6 flex flex-col justify-between"
          >
            {[
              { label: "Total Earned", value: formatCurrency(summary.totalEarnings), icon: Wallet, color: "text-text-deep" },
              { label: "Pending", value: formatCurrency(summary.pendingAmount), color: "text-[#B8A060]" },
              { label: "This Month", value: formatCurrency(summary.thisMonthEarnings), color: "text-[#6B8F71]" },
              { label: "Avg Per Task", value: formatCurrency(summary.averagePerTask), color: "text-[#A18072]" },
            ].map((metric, i) => (
              <div key={metric.label} className="flex-1 flex flex-col justify-center">
                <p className="text-[11px] text-text-muted font-medium uppercase tracking-wide">
                  {metric.label}
                </p>
                <p className={`text-2xl lg:text-3xl font-heading font-bold mt-1 ${metric.color}`}>
                  {metric.value}
                </p>
                {i < 3 && (
                  <div className="mt-4 h-px bg-gradient-to-r from-[#A18072]/10 via-[#A18072]/20 to-transparent" />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Payout History Table — full width */}
        <div className="rounded-[var(--radius-xl)] bg-white border border-black/[0.04] shadow-warm overflow-hidden">
          <div className="px-6 py-5 border-b border-black/[0.04]">
            <h3 className="font-heading text-lg font-bold text-text-deep">
              Payout History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table-premium w-full text-sm">
              <thead>
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    Task
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    Project
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    Split
                  </th>
                  <th className="px-4 py-3.5 text-right text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRecords
                  .slice(
                    (currentPage - 1) * ITEMS_PER_PAGE,
                    currentPage * ITEMS_PER_PAGE,
                  )
                  .map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-3.5 font-medium text-text-deep max-w-[200px] truncate">
                        {record.taskTitle}
                      </td>
                      <td className="px-4 py-3.5 text-text-secondary">
                        {record.projectName}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] text-text-muted tabular-nums">
                          {record.revenueSplit.contributor}% /{" "}
                          {record.revenueSplit.platform}% /{" "}
                          {record.revenueSplit.university}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-[#6B8F71] tabular-nums">
                        {formatCurrency(record.amount)}
                      </td>
                      <td className="px-6 py-3.5 text-right text-text-muted">
                        {record.paidAt
                          ? formatDate(record.paidAt)
                          : formatDate(record.createdAt)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-black/[0.04]">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(sortedRecords.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
              totalItems={sortedRecords.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
