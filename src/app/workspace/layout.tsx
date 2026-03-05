"use client";

import { WorkspaceLayout } from "@/components/layout";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <WorkspaceLayout>{children}</WorkspaceLayout>
    </AuthGuard>
  );
}
