"use client";

import { useState, useCallback } from "react";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button, SkillChip } from "@/components/ui";
import { CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useCompleteLearning } from "@/hooks/use-learning";
import { notify } from "@/components/ui/toast";
import { TutorialContent } from "./tutorial-content";
import { ChecklistContent } from "./checklist-content";
import { ExampleContent } from "./example-content";
import type { LearningAsset, LearningAssetType } from "@/types";

const typeLabels: Record<LearningAssetType, string> = {
  tutorial: "Tutorial",
  checklist: "Checklist",
  example: "Example",
  ai_tutor: "AI Tutor",
};

interface LearningAssetSheetProps {
  asset: LearningAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LearningAssetSheet({
  asset,
  open,
  onOpenChange,
}: LearningAssetSheetProps) {
  const completeMutation = useCompleteLearning();
  const [allChecklistItemsChecked, setAllChecklistItemsChecked] =
    useState(false);

  const handleAllCheckedChange = useCallback((allChecked: boolean) => {
    setAllChecklistItemsChecked(allChecked);
  }, []);

  if (!asset) return null;

  const isChecklistIncomplete =
    asset.type === "checklist" &&
    asset.checklistItems?.length &&
    !allChecklistItemsChecked;

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(asset.id);
      notify({
        type: "success",
        title: "Asset completed",
        description: `"${asset.title}" marked as complete.`,
      });
      onOpenChange(false);
    } catch {
      notify({
        type: "error",
        title: "Failed to complete",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetHeader>
        <SheetTitle>{asset.title}</SheetTitle>
        <SheetDescription>
          {typeLabels[asset.type]} &middot; {asset.category} &middot;{" "}
          {asset.duration}
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="space-y-5">
        {/* Full description */}
        <p className="text-sm text-text-secondary leading-relaxed">
          {asset.description}
        </p>

        {/* Type-specific content */}
        {asset.type === "tutorial" && asset.videoUrl && (
          <TutorialContent title={asset.title} videoUrl={asset.videoUrl} />
        )}
        {asset.type === "checklist" && asset.checklistItems?.length && (
          <ChecklistContent
            items={asset.checklistItems}
            disabled={asset.completed}
            onAllCheckedChange={handleAllCheckedChange}
          />
        )}
        {asset.type === "example" && asset.codeBlocks?.length && (
          <ExampleContent codeBlocks={asset.codeBlocks} />
        )}

        {/* Objectives */}
        {asset.objectives && asset.objectives.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-text-deep mb-2">
              What You&apos;ll Learn
            </h3>
            <ol className="space-y-1.5 list-decimal list-inside">
              {asset.objectives.map((obj, i) => (
                <li
                  key={i}
                  className="text-sm text-text-secondary leading-relaxed"
                >
                  {obj}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Related Skills */}
        <div>
          <h3 className="text-sm font-medium text-text-deep mb-2">
            Related Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {asset.relatedSkills.map((s) => (
              <SkillChip key={s} skill={s} />
            ))}
          </div>
        </div>

        {/* Completed state */}
        {asset.completed && asset.completedAt && (
          <div className="flex items-center gap-2 rounded-[var(--radius)] bg-success/10 p-3">
            <CheckCircle className="h-4 w-4 text-success shrink-0" />
            <span className="text-sm text-success font-medium">
              Completed on {formatDate(asset.completedAt)}
            </span>
          </div>
        )}
      </SheetBody>

      <SheetFooter>
        {asset.completed ? (
          <>
            <span className="text-sm text-success font-medium mr-auto">
              Completed
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={handleComplete}
              disabled={completeMutation.isPending || !!isChecklistIncomplete}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              {completeMutation.isPending
                ? "Completing..."
                : "Mark as Complete"}
            </Button>
          </>
        )}
      </SheetFooter>
    </Sheet>
  );
}
