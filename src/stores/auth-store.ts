import { create } from "zustand";

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
  user: MockUser;
}

export const useAuthStore = create<AuthState>(() => ({
  user: {
    id: "usr-001",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    role: "Pass-Out AI Contributor",
    track: "alumni",
    university: "IIT Delhi",
    aiReadinessScore: 78,
    skillLevel: "Advanced",
  },
}));
