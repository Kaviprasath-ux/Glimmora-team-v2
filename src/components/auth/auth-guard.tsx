"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center" style={{ background: "var(--color-surface-warm)" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl font-heading font-bold text-lg animate-pulse"
            style={{
              background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
              color: "var(--color-primary)",
            }}
          >
            G
          </div>
          <div
            className="h-1 w-16 rounded-full overflow-hidden"
            style={{ background: "color-mix(in srgb, var(--color-primary) 8%, transparent)" }}
          >
            <div
              className="h-full w-1/2 rounded-full animate-[shimmer_1s_ease-in-out_infinite_alternate]"
              style={{ background: "var(--color-primary)" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
