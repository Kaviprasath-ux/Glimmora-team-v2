import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  track: "alumni" | "women" | "enterprise";
  university: string;
  aiReadinessScore: number;
  skillLevel: string;
}

interface AuthState {
  user: MockUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => void;
  signup: (data: { name: string; email: string; password: string; track: "alumni" | "women" }) => void;
  logout: () => void;
  setHydrated: () => void;
}

const defaultMockUser: MockUser = {
  id: "usr-001",
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  role: "Pass-Out AI Contributor",
  track: "alumni",
  university: "IIT Delhi",
  aiReadinessScore: 78,
  skillLevel: "Advanced",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      login: (_email: string, _password: string) => {
        set({
          user: { ...defaultMockUser, email: _email },
          isAuthenticated: true,
        });
      },

      signup: (data) => {
        const role = data.track === "alumni" ? "Pass-Out AI Contributor" : "Women IT Contributor";
        set({
          user: {
            id: `usr-${Date.now()}`,
            name: data.name,
            email: data.email,
            role,
            track: data.track,
            university: data.track === "alumni" ? "Not specified" : "",
            aiReadinessScore: 0,
            skillLevel: "Beginner",
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setHydrated: () => {
        set({ isHydrated: true });
      },
    }),
    {
      name: "glimmora-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
