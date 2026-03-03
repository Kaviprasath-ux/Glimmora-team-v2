"use client";

import { useState } from "react";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Button,
  Avatar,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Textarea,
} from "@/components/ui";
import { AlertTriangle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useDisputeReview } from "@/hooks/use-tasks";
import { notify } from "@/components/ui/toast";
import type { Task } from "@/types";

const verdictLabels: Record<
  string,
  { label: string; variant: "success" | "warning" | "error" | "info" }
> = {
  approved: { label: "Approved", variant: "success" },
  rework: { label: "Rework Required", variant: "warning" },
  rejected: { label: "Rejected", variant: "error" },
  pending: { label: "Pending Review", variant: "info" },
};

interface ReviewFeedbackSheetProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResubmit: () => void;
}

export function ReviewFeedbackSheet({
  task,
  open,
  onOpenChange,
  onResubmit,
}: ReviewFeedbackSheetProps) {
  const disputeReview = useDisputeReview();
  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  const latestSubmission = task.submissions[task.submissions.length - 1];
  const review = latestSubmission?.review;

  if (!review) return null;

  const verdict = verdictLabels[review.verdict] || verdictLabels.pending;

  const handleDispute = async () => {
    try {
      await disputeReview.mutateAsync({
        taskId: task.id,
        reason: disputeReason,
      });
      notify({
        type: "warning",
        title: "Dispute submitted",
        description: "A senior reviewer will re-evaluate your submission.",
      });
      setShowDispute(false);
      setDisputeReason("");
      onOpenChange(false);
    } catch {
      notify({
        type: "error",
        title: "Dispute failed",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetHeader>
          <div className="flex items-center justify-between pr-8">
            <div>
              <SheetTitle>Review Feedback</SheetTitle>
              <SheetDescription>{task.title}</SheetDescription>
            </div>
            <Badge variant={verdict.variant}>{verdict.label}</Badge>
          </div>
        </SheetHeader>

        <SheetBody className="space-y-5">
          {/* Reviewer Info */}
          <div className="flex items-center gap-3">
            <Avatar name={review.reviewerName} size="sm" />
            <div>
              <p className="text-sm font-medium text-text-deep">
                {review.reviewerName}
              </p>
              <p className="text-xs text-text-muted">
                Reviewed {formatDateTime(review.reviewedAt)}
              </p>
            </div>
          </div>

          {/* Rework Instructions */}
          {review.reworkInstructions && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <h3 className="text-sm font-medium text-text-deep">
                  Rework Instructions
                </h3>
              </div>
              <div className="rounded-[var(--radius)] bg-warning/5 border border-warning/15 p-3">
                <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                  {review.reworkInstructions}
                </p>
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <h3 className="text-sm font-medium text-text-deep mb-3">
              Review Comments
            </h3>
            <div className="space-y-3">
              {review.comments.map((comment, i) => (
                <div key={comment.id}>
                  {i > 0 && <div className="h-px bg-primary/5 mb-3" />}
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar name={comment.author} size="sm" />
                    <span className="text-sm font-medium text-text-deep">
                      {comment.author}
                    </span>
                    <Badge variant="outline">{comment.authorRole}</Badge>
                    <span className="text-xs text-text-muted ml-auto">
                      {formatDateTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed pl-10">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </SheetBody>

        <SheetFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDispute(true)}
          >
            Dispute
          </Button>
          {review.verdict === "rework" && (
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onResubmit();
              }}
            >
              Resubmit Work
            </Button>
          )}
        </SheetFooter>
      </Sheet>

      {/* Dispute Dialog — renders on top of sheet */}
      <Dialog open={showDispute} onOpenChange={setShowDispute}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispute This Review</DialogTitle>
            <DialogDescription>
              If you believe this review is unfair, provide your reasoning. A
              senior reviewer will re-evaluate.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            label="Reason for Dispute"
            placeholder="Explain why you believe this verdict should be reconsidered..."
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDispute(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDispute}
              disabled={!disputeReason.trim() || disputeReview.isPending}
            >
              {disputeReview.isPending ? "Submitting..." : "Submit Dispute"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
