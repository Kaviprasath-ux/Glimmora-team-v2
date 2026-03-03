"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-warm flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-error/10">
          <AlertTriangle className="h-8 w-8 text-error" />
        </div>
        <h1 className="mt-4 font-heading text-2xl text-text-deep">
          Something went wrong
        </h1>
        <p className="mt-2 text-text-secondary">
          An unexpected error occurred. Please try again or contact support if
          the issue persists.
        </p>
        <div className="mt-6">
          <Button onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
