import { useQuery } from "@tanstack/react-query";
import { mockPoDLRecords } from "@/mocks/data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function usePoDLRecords() {
  return useQuery({
    queryKey: ["podl"],
    queryFn: async () => {
      await delay(300);
      return mockPoDLRecords;
    },
  });
}

export function usePoDLStats() {
  return useQuery({
    queryKey: ["podl", "stats"],
    queryFn: async () => {
      await delay(200);
      const records = mockPoDLRecords;
      return {
        totalRecords: records.length,
        totalEarnings: records.reduce((sum, r) => sum + r.payout, 0),
        exemplaryCount: records.filter((r) => r.verdict === "exemplary").length,
        uniqueSkills: [...new Set(records.flatMap((r) => r.skills))].length,
      };
    },
  });
}
