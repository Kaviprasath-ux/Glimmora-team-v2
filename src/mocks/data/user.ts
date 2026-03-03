import type { User } from "@/types";

export const mockUser: User = {
  id: "usr-001",
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  role: "Pass-Out AI Contributor",
  track: "alumni",
  university: "IIT Delhi",
  bio: "Recent CS graduate passionate about AI/ML and full-stack development. Contributing to enterprise projects through GlimmoraTeam.",
  phone: "+91 98765 43210",
  location: "New Delhi, India",
  joinedAt: "2025-11-15T00:00:00Z",
  aiReadinessScore: 78,
  skillLevel: "Advanced",
  totalEarnings: 124500,
  podlCount: 15,
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    profilePublic: true,
    showEarnings: false,
  },
};
