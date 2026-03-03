"use client";

import { WorkspaceLayout } from "@/components/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WorkspaceLayout>{children}</WorkspaceLayout>;
}
