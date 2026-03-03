"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui";
import type { ChecklistItem } from "@/types";

interface ChecklistContentProps {
  items: ChecklistItem[];
  disabled?: boolean;
  onAllCheckedChange: (allChecked: boolean) => void;
}

export function ChecklistContent({
  items,
  disabled,
  onAllCheckedChange,
}: ChecklistContentProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // Reset when a different asset is opened
  useEffect(() => {
    setChecked({});
  }, [items]);

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const total = items.length;
  const allChecked = checkedCount === total;

  useEffect(() => {
    onAllCheckedChange(allChecked);
  }, [allChecked, onAllCheckedChange]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text-deep">Checklist</h3>
        <span className="text-xs text-text-muted tabular-nums">
          {disabled ? total : checkedCount}/{total}
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <Checkbox
            key={item.id}
            label={item.label}
            checked={disabled ? true : checked[item.id] || false}
            disabled={disabled}
            onCheckedChange={(val) => {
              if (disabled) return;
              setChecked((prev) => ({
                ...prev,
                [item.id]: val as boolean,
              }));
            }}
          />
        ))}
      </div>

      {!disabled && allChecked && (
        <p className="mt-3 text-xs text-success font-medium">
          All items checked — you can mark this asset as complete.
        </p>
      )}
    </div>
  );
}
