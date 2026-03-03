// ---- Core Enums ----
export type TaskStatus =
  | "assigned"
  | "in_progress"
  | "in_review"
  | "rework"
  | "accepted"
  | "rejected";

export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskComplexity = "simple" | "moderate" | "complex";
export type PaymentStatus = "pending" | "processing" | "paid" | "failed";
export type SubmissionVerdict = "approved" | "rework" | "rejected" | "pending";
export type LearningAssetType = "tutorial" | "checklist" | "example" | "ai_tutor";
export type NotificationType = "task" | "payment" | "badge" | "team" | "system";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

// ---- User ----
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  track: "alumni" | "women" | "enterprise";
  university: string;
  bio?: string;
  phone?: string;
  location?: string;
  joinedAt: string;
  aiReadinessScore: number;
  skillLevel: string;
  totalEarnings: number;
  podlCount: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  profilePublic: boolean;
  showEarnings: boolean;
}

// ---- Task ----
export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  status: TaskStatus;
  priority: TaskPriority;
  complexity: TaskComplexity;
  assignedAt: string;
  deadline: string;
  payout: number;
  skills: string[];
  acceptanceCriteria: AcceptanceCriterion[];
  evidenceRequired: string[];
  reviewerId: string;
  reviewerName: string;
  iterationCount: number;
  maxIterations: number;
  submissions: Submission[];
  relatedLearningAssets: string[];
}

export interface AcceptanceCriterion {
  id: string;
  description: string;
  met: boolean;
}

// ---- Submission ----
export interface Submission {
  id: string;
  taskId: string;
  submittedAt: string;
  notes: string;
  files: SubmissionFile[];
  selfCheckItems: SelfCheckItem[];
  review?: ReviewFeedback;
}

export interface SubmissionFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface SelfCheckItem {
  id: string;
  label: string;
  checked: boolean;
}

// ---- Review ----
export interface ReviewFeedback {
  id: string;
  submissionId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  verdict: SubmissionVerdict;
  reviewedAt: string;
  comments: ReviewComment[];
  reworkInstructions?: string;
}

export interface ReviewComment {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

// ---- Skill Genome ----
export interface SkillGenome {
  userId: string;
  dimensions: SkillDimension[];
  aiReadinessScore: number;
  reliabilityScore: number;
  collaborationScore: number;
  learningVelocity: number;
  integrityScore: number;
  updatedAt: string;
}

export interface SkillDimension {
  skill: string;
  level: number; // 0-100
  category: string;
}

// ---- Badge ----
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  locked: boolean;
  criteria: string;
}

// ---- PoDL ----
export interface PoDLRecord {
  id: string;
  taskId: string;
  taskTitle: string;
  projectName: string;
  completedAt: string;
  skills: string[];
  payout: number;
  verdict: "accepted" | "exemplary";
  reviewerName: string;
  evidence: string[];
  hash: string;
}

// ---- Earnings ----
export interface EarningsRecord {
  id: string;
  taskId: string;
  taskTitle: string;
  projectName: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
  revenueSplit: {
    contributor: number;
    platform: number;
    university: number;
  };
}

export interface EarningsSummary {
  totalEarnings: number;
  pendingAmount: number;
  thisMonthEarnings: number;
  averagePerTask: number;
  monthlyData: { month: string; amount: number }[];
}

// ---- Learning ----
export interface ChecklistItem {
  id: string;
  label: string;
}

export interface CodeBlock {
  filename: string;
  language: string;
  code: string;
}

export interface LearningAsset {
  id: string;
  title: string;
  description: string;
  type: LearningAssetType;
  category: string;
  duration: string;
  completed: boolean;
  completedAt?: string;
  url?: string;
  relatedSkills: string[];
  objectives?: string[];
  videoUrl?: string;
  checklistItems?: ChecklistItem[];
  codeBlocks?: CodeBlock[];
}

// ---- Team ----
export interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  skills: string[];
  reliabilityScore: number;
  tasksCompleted: number;
  status: "active" | "idle" | "away";
}

export interface Team {
  id: string;
  name: string;
  projectName: string;
  charter: string;
  formedAt: string;
  members: TeamMember[];
}

// ---- Notification ----
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

// ---- Project (lightweight) ----
export interface Project {
  id: string;
  name: string;
  clientName: string;
  milestoneProgress: number;
  totalMilestones: number;
  completedMilestones: number;
  nextDeadline: string;
  teamSize: number;
}
