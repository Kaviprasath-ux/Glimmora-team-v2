import { useQuery } from "@tanstack/react-query";
import { mockTasks, mockNotifications, mockProject, mockUser } from "@/mocks/data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      await delay(300);
      const activeTasks = mockTasks.filter(
        (t) => t.status === "in_progress" || t.status === "assigned",
      );
      const recentNotifications = [...mockNotifications]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      const thisMonthEarnings = 24500;

      return {
        user: mockUser,
        activeTasks: activeTasks.length,
        thisMonthEarnings,
        skillLevel: mockUser.skillLevel,
        podlRecords: mockUser.podlCount,
        recentTasks: mockTasks.slice(0, 4),
        recentNotifications,
        activeProject: mockProject,
        aiReadinessScore: mockUser.aiReadinessScore,
      };
    },
  });
}
