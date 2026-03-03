import { useQuery } from "@tanstack/react-query";
import { mockEarningsSummary, mockEarningsRecords } from "@/mocks/data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useEarningsSummary() {
  return useQuery({
    queryKey: ["earnings", "summary"],
    queryFn: async () => {
      await delay(300);
      return mockEarningsSummary;
    },
  });
}

export function useEarningsRecords() {
  return useQuery({
    queryKey: ["earnings", "records"],
    queryFn: async () => {
      await delay(300);
      return mockEarningsRecords;
    },
  });
}
