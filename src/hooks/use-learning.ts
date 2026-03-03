import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { mockLearningAssets } from "@/mocks/data";
import type { LearningAsset } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let assets = [...mockLearningAssets];

export function useLearningAssets(filters?: { type?: string; completed?: boolean; search?: string }) {
  return useQuery({
    queryKey: ["learning", filters],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      await delay(300);
      let result = [...assets];
      if (filters?.type) {
        result = result.filter((a) => a.type === filters.type);
      }
      if (filters?.completed !== undefined) {
        result = result.filter((a) => a.completed === filters.completed);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.relatedSkills.some((s) => s.toLowerCase().includes(q)),
        );
      }
      return result;
    },
  });
}

export function useLearningCounts() {
  return useQuery({
    queryKey: ["learning", "counts"],
    queryFn: async () => {
      await delay(100);
      const counts: Record<string, number> = { all: assets.length };
      for (const a of assets) {
        counts[a.type] = (counts[a.type] || 0) + 1;
      }
      return counts;
    },
  });
}

export function useCompleteLearning() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(300);
      const asset = assets.find((a) => a.id === id);
      if (!asset) throw new Error("Asset not found");
      asset.completed = true;
      asset.completedAt = new Date().toISOString();
      return asset;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning"] });
    },
  });
}
