"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated) {
      router.replace(isAuthenticated ? "/workspace" : "/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center" style={{ background: "var(--color-surface-warm)" }}>
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl font-heading font-bold text-lg animate-pulse"
        style={{
          background: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
          color: "var(--color-primary)",
        }}
      >
        G
      </div>
    </div>
  );
}
