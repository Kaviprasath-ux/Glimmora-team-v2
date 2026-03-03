"use client";

import { useState, useCallback, useRef } from "react";
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
  Checkbox,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui";
import { Upload, FileText, X } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { useSubmitWork } from "@/hooks/use-tasks";
import { notify } from "@/components/ui/toast";
import type { Task } from "@/types";

const defaultChecks = [
  { id: "sc-code", label: "Code compiles/runs without errors" },
  { id: "sc-tests", label: "All tests pass locally" },
  { id: "sc-criteria", label: "I've reviewed all acceptance criteria" },
  { id: "sc-evidence", label: "Required evidence is included" },
];

interface SubmitWorkSheetProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubmitWorkSheet({ task, open, onOpenChange }: SubmitWorkSheetProps) {
  const submitWork = useSubmitWork();
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selfChecks, setSelfChecks] = useState<Record<string, boolean>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setNotes("");
    setFiles([]);
    setSelfChecks({});
  };

  const handleSubmit = async () => {
    try {
      const selfCheckItems = defaultChecks.map((check) => ({
        id: check.id,
        label: check.label,
        checked: selfChecks[check.id] || false,
      }));
      await submitWork.mutateAsync({ taskId: task.id, notes, files, selfCheckItems });
      notify({
        type: "success",
        title: "Work submitted",
        description: "Your submission is now under review.",
      });
      setShowConfirm(false);
      onOpenChange(false);
      resetForm();
    } catch {
      notify({
        type: "error",
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
      });
      setShowConfirm(false);
    }
  };

  const checksCompleted = Object.values(selfChecks).filter(Boolean).length;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetHeader>
          <SheetTitle>Submit Work</SheetTitle>
          <SheetDescription>
            {task.title} &middot; Payout {formatCurrency(task.payout)}
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-5">
          {/* File Upload */}
          <div>
            <h3 className="text-sm font-medium text-text-deep mb-2">
              Upload Deliverables
            </h3>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => {
                const selected = Array.from(e.target.files || []);
                setFiles((prev) => [...prev, ...selected]);
                e.target.value = "";
              }}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "rounded-[var(--radius-md)] border-2 border-dashed p-6 text-center transition-colors cursor-pointer",
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-primary/15",
              )}
            >
              <Upload className="h-6 w-6 text-text-muted mx-auto" />
              <p className="mt-1.5 text-sm text-text-secondary">
                Drag & drop or click to browse
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                PDF, ZIP, images up to 50MB
              </p>
            </div>

            {files.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-[var(--radius)] bg-primary/3 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm text-text-deep truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-text-muted shrink-0">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="p-1 text-text-muted transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <Textarea
            label="Submission Notes"
            placeholder="Describe what you've done, any decisions made, known limitations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />

          {/* Self-Check */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-deep">
                Self-Check
              </h3>
              <span className="text-xs text-text-muted tabular-nums">
                {checksCompleted}/{defaultChecks.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {defaultChecks.map((check) => (
                <Checkbox
                  key={check.id}
                  label={check.label}
                  checked={selfChecks[check.id] || false}
                  onCheckedChange={(checked) =>
                    setSelfChecks((prev) => ({
                      ...prev,
                      [check.id]: checked as boolean,
                    }))
                  }
                />
              ))}
            </div>
          </div>
        </SheetBody>

        <SheetFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => setShowConfirm(true)}
            disabled={files.length === 0}
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Submit for Review
          </Button>
        </SheetFooter>
      </Sheet>

      {/* Confirmation Dialog — renders on top of sheet */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              This will move the task to &ldquo;In Review&rdquo; status.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 space-y-2 text-sm text-text-secondary">
            <p>
              <strong>Files:</strong> {files.length} file(s)
            </p>
            <p>
              <strong>Self-checks passed:</strong>{" "}
              {checksCompleted}/{defaultChecks.length}
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={submitWork.isPending}
            >
              {submitWork.isPending ? "Submitting..." : "Confirm Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
