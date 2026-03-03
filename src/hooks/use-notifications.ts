import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockNotifications } from "@/mocks/data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let notifications = [...mockNotifications];

export function useNotifications(filters?: { type?: string }) {
  return useQuery({
    queryKey: ["notifications", filters],
    queryFn: async () => {
      await delay(200);
      let result = [...notifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      if (filters?.type) {
        result = result.filter((n) => n.type === filters.type);
      }
      return result;
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: async () => {
      await delay(100);
      return notifications.filter((n) => !n.read).length;
    },
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(200);
      const notif = notifications.find((n) => n.id === id);
      if (notif) notif.read = true;
      return notif;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await delay(300);
      notifications.forEach((n) => (n.read = true));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
