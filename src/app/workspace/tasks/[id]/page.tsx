"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  PageTransition,
  StatusBadge,
  Badge,
  SkillChip,
  Progress,
  Skeleton,
  Card,
  Avatar,
  Button,
} from "@/components/ui";
import { TimelineStepper } from "@/components/ui/timeline-stepper";
import { useTask } from "@/hooks/use-tasks";
import { SubmitWorkSheet } from "@/components/tasks/submit-work-sheet";
import { ReviewFeedbackSheet } from "@/components/tasks/review-feedback-sheet";
import {
  Coins,
  RotateCcw,
  ArrowLeft,
  Upload,
  Clock,
  CheckCircle,
  ArrowRight,
  FileText,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  daysUntil,
  cn,
} from "@/lib/utils";

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: task, isLoading } = useTask(id);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showReview, setShowReview] = useState(false);

  if (isLoading || !task) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-96" />
          <div className="grid lg:grid-cols-3 gap-6">
            <Skeleton className="h-[480px] lg:col-span-2" />
            <Skeleton className="h-[480px]" />
          </div>
        </div>
      </PageTransition>
    );
  }

  const days = daysUntil(task.deadline);
  const criteriaMetCount = task.acceptanceCriteria.filter((c) => c.met).length;
  const criteriaProgress =
    (criteriaMetCount / task.acceptanceCriteria.length) * 100;

  const timelineSteps = [
    {
      id: "assigned",
      title: "Task Assigned",
      description: `Assigned on ${formatDate(task.assignedAt)}`,
      date: formatDate(task.assignedAt),
      status: "completed" as const,
    },
    ...task.submissions.map((sub, i) => ({
      id: sub.id,
      title: `Submission #${i + 1}`,
      description: sub.review
        ? `${sub.review.verdict === "approved" ? "Approved" : sub.review.verdict === "rework" ? "Rework requested" : "Rejected"} by ${sub.review.reviewerName}`
        : "Awaiting review",
      date: formatDateTime(sub.submittedAt),
      status: sub.review
        ? ("completed" as const)
        : ("current" as const),
    })),
    ...(task.status !== "accepted"
      ? [
          {
            id: "pending-accept",
            title: "Accepted",
            status: "upcoming" as const,
          },
        ]
      : []),
  ];

  const canSubmit =
    task.status === "assigned" ||
    task.status === "in_progress" ||
    task.status === "rework";

  const latestReview =
    task.submissions.length > 0
      ? task.submissions[task.submissions.length - 1].review
      : null;

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative rounded-[var(--radius-2xl)] bg-gradient-to-br from-[#FAF7F4] via-white to-[#F0EDE8] p-6 sm:p-8 border border-black/[0.04] overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#A18072]/[0.03] blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-[30%] w-32 h-32 rounded-full bg-[#B8A060]/[0.03] blur-3xl pointer-events-none" />

          <Link
            href="/workspace/tasks"
            className="inline-flex items-center gap-1 text-[13px] text-text-muted mb-4 hover:text-text-deep transition-colors relative z-10"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Tasks
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={task.status} />
                <span className="text-[10px] uppercase tracking-[0.1em] text-text-muted font-semibold">
                  {task.projectName}
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-text-deep">
                {task.title}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {latestReview && (
                <Button variant="outline" size="sm" onClick={() => setShowReview(true)}>
                  View Review
                </Button>
              )}
              {canSubmit && (
                <Button
                  size="sm"
                  onClick={() => setShowSubmit(true)}
                  className="bg-gradient-to-r from-[#A18072] to-[#846358] hover:from-[#846358] hover:to-[#A18072] text-white shadow-[0_4px_16px_rgba(139,117,101,0.25)]"
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Submit Work
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Left Column — Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card variant="default">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-5 rounded-full bg-gradient-to-r from-[#A18072] to-[#BFA094]" />
                <h3 className="text-base font-bold text-text-deep">Description</h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {task.description}
              </p>
            </Card>

            {/* Acceptance Criteria */}
            <Card variant="default">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-5 rounded-full bg-gradient-to-r from-[#5A6B4A] to-[#7A8F66]" />
                  <h3 className="text-base font-bold text-text-deep">Acceptance Criteria</h3>
                </div>
                <span className="text-xs tabular-nums text-text-muted font-medium bg-black/[0.03] px-2 py-0.5 rounded-full">
                  {criteriaMetCount}/{task.acceptanceCriteria.length} met
                </span>
              </div>
              <Progress
                value={criteriaProgress}
                className="mb-4"
                indicatorClassName="bg-gradient-to-r from-[#5A6B4A] to-[#7A8F66]"
              />
              <ul className="space-y-2">
                {task.acceptanceCriteria.map((criterion) => (
                  <li
                    key={criterion.id}
                    className={cn(
                      "flex items-start gap-2.5 rounded-[var(--radius)] px-3 py-2",
                      criterion.met ? "bg-[#6B8F71]/[0.04]" : "bg-transparent",
                    )}
                  >
                    <CheckCircle
                      className={cn(
                        "h-4 w-4 mt-0.5 shrink-0",
                        criterion.met ? "text-[#6B8F71]" : "text-black/[0.1]",
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm",
                        criterion.met ? "text-text-deep font-medium" : "text-text-secondary",
                      )}
                    >
                      {criterion.description}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Evidence Required */}
            <Card variant="default">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-5 rounded-full bg-gradient-to-r from-[#B8A060] to-[#C9B85C]" />
                <h3 className="text-base font-bold text-text-deep">Evidence Required</h3>
              </div>
              <ul className="space-y-2">
                {task.evidenceRequired.map((item, i) => (
                  <li
                    key={i}
                    className="text-sm text-text-secondary flex items-center gap-2.5 py-1"
                  >
                    <FileText className="h-3.5 w-3.5 text-text-muted shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Submission History */}
            <Card variant="default">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-5 rounded-full bg-gradient-to-r from-[#BFA094] to-[#D2BAB0]" />
                <h3 className="text-base font-bold text-text-deep">Submission History</h3>
              </div>
              {task.submissions.length === 0 ? (
                <p className="text-sm text-text-muted py-2">
                  No submissions yet. Upload your work to get started.
                </p>
              ) : (
                <TimelineStepper steps={timelineSteps} />
              )}
            </Card>
          </div>

          {/* Right Column — Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            {/* Key Details Card */}
            <div className="rounded-[var(--radius-xl)] bg-gradient-to-br from-[#FAF7F4] to-white border border-black/[0.04] p-5 shadow-warm">
              <h4 className="text-[10px] uppercase tracking-[0.12em] text-text-muted font-semibold mb-4">
                Details
              </h4>
              <div className="space-y-4">
                {/* Deadline */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)]",
                      days <= 3
                        ? "bg-gradient-to-br from-[#8E4A55]/15 to-[#8E4A55]/5"
                        : "bg-gradient-to-br from-[#A18072]/15 to-[#A18072]/5",
                    )}
                  >
                    <Clock
                      className={cn(
                        "h-4.5 w-4.5",
                        days <= 3 ? "text-[#8E4A55]" : "text-[#A18072]",
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Deadline</p>
                    <p className="text-sm font-semibold text-text-deep">
                      {formatDate(task.deadline)}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

                {/* Payout */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br from-[#6B8F71]/15 to-[#6B8F71]/5">
                    <Coins className="h-4.5 w-4.5 text-[#6B8F71]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Payout</p>
                    <p className="text-sm font-bold text-[#6B8F71]">
                      {formatCurrency(task.payout)}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

                {/* Reviewer */}
                <div className="flex items-center gap-3">
                  <Avatar name={task.reviewerName} size="sm" />
                  <div>
                    <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Reviewer</p>
                    <p className="text-sm font-semibold text-text-deep">
                      {task.reviewerName}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

                {/* Iterations */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br from-[#A18072]/12 to-[#A18072]/4">
                    <RotateCcw className="h-4.5 w-4.5 text-[#A18072]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Iterations</p>
                    <p className="text-sm font-semibold text-text-deep tabular-nums">
                      {task.iterationCount} / {task.maxIterations}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <Card variant="gradient-border">
              <h4 className="text-[10px] uppercase tracking-[0.12em] text-text-muted font-semibold mb-3">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {task.skills.map((skill) => (
                  <SkillChip key={skill} skill={skill} />
                ))}
              </div>
            </Card>

            {/* Learning Assets */}
            {task.relatedLearningAssets.length > 0 && (
              <Card variant="gradient-border">
                <h4 className="text-[10px] uppercase tracking-[0.12em] text-text-muted font-semibold mb-3">
                  Related Learning
                </h4>
                <Link href="/workspace/learning">
                  <Button variant="ghost" size="sm" className="w-full">
                    View Learning Assets
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Side Drawer Sheets */}
      <SubmitWorkSheet
        task={task}
        open={showSubmit}
        onOpenChange={setShowSubmit}
      />
      {latestReview && (
        <ReviewFeedbackSheet
          task={task}
          open={showReview}
          onOpenChange={setShowReview}
          onResubmit={() => setShowSubmit(true)}
        />
      )}
    </PageTransition>
  );
}
