import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockTasks } from "@/mocks/data";
import type { Task, TaskStatus } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let tasks = [...mockTasks];

export function useTasks(filters?: { status?: TaskStatus; search?: string }) {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      await delay(300);
      let result = [...tasks];
      if (filters?.status) {
        result = result.filter((t) => t.status === filters.status);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.projectName.toLowerCase().includes(q),
        );
      }
      return result;
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      await delay(200);
      const task = tasks.find((t) => t.id === id);
      if (!task) throw new Error("Task not found");
      return task;
    },
    enabled: !!id,
  });
}

export function useTaskStatusCounts() {
  return useQuery({
    queryKey: ["tasks", "counts"],
    queryFn: async () => {
      await delay(100);
      const counts: Record<string, number> = { all: tasks.length };
      for (const t of tasks) {
        counts[t.status] = (counts[t.status] || 0) + 1;
      }
      return counts;
    },
  });
}

export function useSubmitWork() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      notes,
      files,
      selfCheckItems,
    }: {
      taskId: string;
      notes: string;
      files: File[];
      selfCheckItems: { id: string; label: string; checked: boolean }[];
    }) => {
      await delay(500);
      const task = tasks.find((t) => t.id === taskId);
      if (!task) throw new Error("Task not found");
      task.status = "in_review";
      task.submissions.push({
        id: `sub-${Date.now()}`,
        taskId,
        submittedAt: new Date().toISOString(),
        notes,
        files: files.map((f) => ({
          id: `f-${Date.now()}`,
          name: f.name,
          size: f.size,
          type: f.type,
          url: "#",
        })),
        selfCheckItems,
      });
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDisputeReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      reason,
    }: {
      taskId: string;
      reason: string;
    }) => {
      await delay(500);
      const task = tasks.find((t) => t.id === taskId);
      if (!task) throw new Error("Task not found");
      task.status = "disputed" as TaskStatus;
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (update: Partial<Task> & { id: string }) => {
      await delay(300);
      const idx = tasks.findIndex((t) => t.id === update.id);
      if (idx === -1) throw new Error("Task not found");
      tasks[idx] = { ...tasks[idx], ...update };
      return tasks[idx];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
