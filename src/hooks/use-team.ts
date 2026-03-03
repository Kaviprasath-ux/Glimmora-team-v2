import { useQuery } from "@tanstack/react-query";
import { mockTeam } from "@/mocks/data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      await delay(300);
      return mockTeam;
    },
  });
}
