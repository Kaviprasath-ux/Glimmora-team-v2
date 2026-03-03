import { useQuery } from "@tanstack/react-query";
import { mockSkillGenome, mockBadges } from "@/mocks/data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useSkillGenome() {
  return useQuery({
    queryKey: ["skill-genome"],
    queryFn: async () => {
      await delay(300);
      return mockSkillGenome;
    },
  });
}

export function useBadges() {
  return useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      await delay(200);
      return mockBadges;
    },
  });
}
