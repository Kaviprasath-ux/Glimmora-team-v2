import type { LearningAsset } from "@/types";

export const mockLearningAssets: LearningAsset[] = [
  {
    id: "la-001",
    title: "JWT Authentication Best Practices",
    description: "Learn secure JWT implementation patterns including refresh tokens, token rotation, and secure storage.",
    type: "tutorial",
    category: "Security",
    duration: "45 min",
    completed: false,
    relatedSkills: ["JWT", "Node.js", "Security"],
    videoUrl: "https://www.youtube.com/watch?v=7Q17ubqLfaM",
    objectives: [
      "Implement secure token rotation with sliding expiry",
      "Configure refresh token flow using HTTP-only cookies",
      "Apply secure storage patterns for client-side tokens",
      "Set up token revocation with a Redis blacklist",
    ],
  },
  {
    id: "la-002",
    title: "Data Visualization with Nivo",
    description: "Build beautiful, responsive charts with the Nivo library. Covers line, bar, radar, and pie charts.",
    type: "tutorial",
    category: "Frontend",
    duration: "60 min",
    completed: false,
    relatedSkills: ["React", "Nivo", "Data Visualization"],
    videoUrl: "https://www.youtube.com/watch?v=xId9B1PIFBo",
    objectives: [
      "Create responsive line and bar charts with custom themes",
      "Build radar charts for multi-dimensional skill data",
      "Implement interactive tooltips and legends",
      "Optimize chart rendering for large datasets",
    ],
  },
  {
    id: "la-003",
    title: "API Rate Limiting Checklist",
    description: "Step-by-step checklist for implementing production-grade rate limiting.",
    type: "checklist",
    category: "Backend",
    duration: "15 min",
    completed: false,
    relatedSkills: ["Node.js", "Redis", "API Design"],
    checklistItems: [
      { id: "cl-001", label: "Choose a rate-limiting algorithm (fixed window, sliding window, token bucket)" },
      { id: "cl-002", label: "Set up Redis connection with retry and failover config" },
      { id: "cl-003", label: "Implement per-route rate limit middleware" },
      { id: "cl-004", label: "Add per-user rate limit tiers (free, pro, enterprise)" },
      { id: "cl-005", label: "Return X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After headers" },
      { id: "cl-006", label: "Write unit tests for rate limit edge cases (burst, reset)" },
      { id: "cl-007", label: "Add monitoring dashboard for rate limit hits" },
      { id: "cl-008", label: "Document rate limit tiers in API reference" },
    ],
    objectives: [
      "Set up a Redis-based rate limiter with sliding window counters",
      "Configure per-route and per-user rate limit tiers",
      "Add standard rate-limit response headers (X-RateLimit-*)",
    ],
  },
  {
    id: "la-004",
    title: "WebSocket Reconnection Patterns",
    description: "Examples of robust WebSocket reconnection with exponential backoff and heartbeat monitoring.",
    type: "example",
    category: "Backend",
    duration: "30 min",
    completed: true,
    completedAt: "2026-02-24T00:00:00Z",
    relatedSkills: ["WebSocket", "Node.js"],
    codeBlocks: [
      {
        filename: "websocket-client.ts",
        language: "TypeScript",
        code: `class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private retries = 0;
  private maxRetries = 10;
  private baseDelay = 1000;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("Connected");
      this.retries = 0;
      this.startHeartbeat();
    };

    this.ws.onclose = () => {
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (this.retries >= this.maxRetries) return;
    const delay = this.baseDelay * Math.pow(2, this.retries);
    const jitter = delay * 0.2 * Math.random();
    setTimeout(() => this.connect(), delay + jitter);
    this.retries++;
  }

  private startHeartbeat() {
    setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);
  }
}`,
      },
    ],
    objectives: [
      "Implement exponential backoff with jitter for reconnection",
      "Build a heartbeat/ping-pong keep-alive mechanism",
      "Handle connection state transitions gracefully in the UI",
    ],
  },
  {
    id: "la-005",
    title: "Writing Effective Unit Tests",
    description: "Learn to write maintainable, focused unit tests that catch real bugs.",
    type: "tutorial",
    category: "Testing",
    duration: "40 min",
    completed: true,
    completedAt: "2026-01-25T00:00:00Z",
    relatedSkills: ["Testing", "Jest", "TypeScript"],
    videoUrl: "https://www.youtube.com/watch?v=Jv2uxzhPFl4",
    objectives: [
      "Structure tests using Arrange-Act-Assert pattern",
      "Write focused assertions that pinpoint failures",
      "Use mocks and stubs without over-mocking",
      "Identify and test edge cases and error paths",
    ],
  },
  {
    id: "la-006",
    title: "PostgreSQL Query Optimization Guide",
    description: "Master query planning, indexing strategies, and EXPLAIN ANALYZE interpretation.",
    type: "tutorial",
    category: "Database",
    duration: "90 min",
    completed: false,
    relatedSkills: ["PostgreSQL", "Query Optimization"],
    videoUrl: "https://www.youtube.com/watch?v=BHwzDmr6d7s",
    objectives: [
      "Read and interpret EXPLAIN ANALYZE output",
      "Design composite indexes for common query patterns",
      "Identify and eliminate sequential scans on large tables",
      "Use CTEs and window functions for complex aggregations",
    ],
  },
  {
    id: "la-007",
    title: "Secure File Upload Checklist",
    description: "Essential security checks for file upload implementations.",
    type: "checklist",
    category: "Security",
    duration: "10 min",
    completed: false,
    relatedSkills: ["Security", "File Upload", "S3"],
    checklistItems: [
      { id: "cl-101", label: "Validate file type using magic bytes (not just file extension)" },
      { id: "cl-102", label: "Enforce maximum file size limit on both client and server" },
      { id: "cl-103", label: "Generate unique storage keys (UUID) instead of using original filenames" },
      { id: "cl-104", label: "Strip EXIF metadata from uploaded images" },
      { id: "cl-105", label: "Scan uploaded files for malware signatures" },
      { id: "cl-106", label: "Store files outside the web root or in S3 with private ACL" },
      { id: "cl-107", label: "Set Content-Disposition: attachment on download responses" },
      { id: "cl-108", label: "Log all upload events with user ID and file hash for audit trail" },
    ],
    objectives: [
      "Validate file types using magic bytes, not just extensions",
      "Enforce size limits and scan for malware signatures",
      "Generate unique storage keys and strip EXIF metadata",
    ],
  },
  {
    id: "la-008",
    title: "GitHub Actions CI/CD Examples",
    description: "Real-world GitHub Actions workflows for Node.js applications.",
    type: "example",
    category: "DevOps",
    duration: "25 min",
    completed: false,
    relatedSkills: ["GitHub Actions", "CI/CD", "Docker"],
    codeBlocks: [
      {
        filename: "ci.yml",
        language: "YAML",
        code: `name: CI Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/`,
      },
      {
        filename: "Dockerfile",
        language: "Dockerfile",
        code: `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]`,
      },
    ],
    objectives: [
      "Set up a multi-stage CI pipeline with caching",
      "Configure Docker image builds with layer caching",
      "Implement environment-specific deployment workflows",
      "Add status checks and branch protection rules",
    ],
  },
];
