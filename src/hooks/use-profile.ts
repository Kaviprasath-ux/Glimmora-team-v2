import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockUser } from "@/mocks/data";
import type { User } from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let user = { ...mockUser };

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      await delay(200);
      return { ...user };
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (update: Partial<User>) => {
      await delay(400);
      user = { ...user, ...update };
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
