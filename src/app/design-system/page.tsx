"use client";

import { useState } from "react";
import {
  Button,
  Badge,
  StatusBadge,
  SkillChip,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Checkbox,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Avatar,
  Progress,
  Skeleton,
  Separator,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  MetricTile,
  TimelineStepper,
  EmptyState,
  ToastContainer,
  notify,
} from "@/components/ui";
import {
  Zap,
  TrendingUp,
  Star,
  FileText,
  Inbox,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

export default function DesignSystemPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-surface-warm">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="font-heading text-4xl text-text-deep">
            GlimmoraTeam Design System
          </h1>
          <p className="mt-2 text-text-secondary">
            Warm palette, crafted for trust-first delivery.
          </p>

          <Separator className="my-8" />

          {/* Colors */}
          <Section title="Color Palette">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              <ColorSwatch color="bg-primary" label="Primary" hex="#8B7565" />
              <ColorSwatch color="bg-primary-light" label="Primary Light" hex="#A89080" />
              <ColorSwatch color="bg-primary-dark" label="Primary Dark" hex="#6B5545" />
              <ColorSwatch color="bg-secondary" label="Secondary" hex="#5A6B4A" />
              <ColorSwatch color="bg-accent-terracotta" label="Terracotta" hex="#B5877A" />
              <ColorSwatch color="bg-accent-teal" label="Teal" hex="#5B9EAD" />
              <ColorSwatch color="bg-accent-gold" label="Gold" hex="#B8A44C" />
              <ColorSwatch color="bg-surface-warm" label="Warm White" hex="#F7F3EE" />
              <ColorSwatch color="bg-surface-card" label="Card" hex="#FBF8F4" />
              <ColorSwatch color="bg-surface-sand" label="Sand" hex="#C9A882" />
              <ColorSwatch color="bg-text-deep" label="Deep Brown" hex="#3A2E28" />
              <ColorSwatch color="bg-text-secondary" label="Text Secondary" hex="#7A6E66" />
            </div>
          </Section>

          {/* Typography */}
          <Section title="Typography">
            <div className="space-y-4">
              <h1 className="font-heading text-4xl text-text-deep">
                Heading 1 — DM Serif Display
              </h1>
              <h2 className="font-heading text-3xl text-text-deep">
                Heading 2 — DM Serif Display
              </h2>
              <h3 className="font-heading text-2xl text-text-deep">
                Heading 3 — DM Serif Display
              </h3>
              <h4 className="font-heading text-xl text-text-deep">
                Heading 4 — DM Serif Display
              </h4>
              <p className="text-base text-text-deep">
                Body text — DM Sans. The platform creates a continuous loop:
                education, contribution, credibility, proof-of-work.
              </p>
              <p className="text-sm text-text-secondary">
                Secondary text — DM Sans 14px. Enterprises receive risk-reduced
                delivery with pay-for-accepted outcomes.
              </p>
              <p className="text-xs text-text-muted">
                Muted text — DM Sans 12px. Caption and helper text style.
              </p>
            </div>
          </Section>

          {/* Buttons */}
          <Section title="Buttons">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
            </div>
          </Section>

          {/* Badges */}
          <Section title="Badges & Status">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="assigned" />
                <StatusBadge status="in_progress" />
                <StatusBadge status="in_review" />
                <StatusBadge status="rework" />
                <StatusBadge status="accepted" />
                <StatusBadge status="paid" />
                <StatusBadge status="processing" />
              </div>
              <div className="flex flex-wrap gap-2">
                <SkillChip skill="React" level="expert" />
                <SkillChip skill="TypeScript" level="advanced" />
                <SkillChip skill="Python" level="intermediate" />
                <SkillChip skill="Docker" level="beginner" />
                <SkillChip skill="Node.js" />
              </div>
            </div>
          </Section>

          {/* Cards */}
          <Section title="Cards">
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Alpha</CardTitle>
                  <CardDescription>
                    API development for enterprise client
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={65} />
                  <p className="mt-2 text-sm text-text-secondary">
                    65% complete
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Skill Genome</CardTitle>
                  <CardDescription>
                    Your AI-generated skill profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <SkillChip skill="React" level="expert" />
                    <SkillChip skill="Node.js" level="advanced" />
                    <SkillChip skill="SQL" level="intermediate" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* Form Elements */}
          <Section title="Form Elements">
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                error="Please enter a valid email"
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  placeholder="Describe your task..."
                  rows={3}
                />
              </div>
              <Select>
                <SelectTrigger label="Priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <div className="space-y-3">
                <Checkbox label="I agree to the terms" />
                <Checkbox label="Send notifications" defaultChecked />
              </div>
              <div className="space-y-3">
                <Switch label="Dark mode" />
                <Switch label="Email updates" defaultChecked />
              </div>
            </div>
          </Section>

          {/* Tabs */}
          <Section title="Tabs">
            <Tabs defaultValue="overview" className="max-w-lg">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <p className="text-sm text-text-secondary">
                  Overview tab content. This shows project details and summary
                  information.
                </p>
              </TabsContent>
              <TabsContent value="tasks">
                <p className="text-sm text-text-secondary">
                  Tasks tab content. View and manage your assigned tasks here.
                </p>
              </TabsContent>
              <TabsContent value="settings">
                <p className="text-sm text-text-secondary">
                  Settings tab content. Configure your workspace preferences.
                </p>
              </TabsContent>
            </Tabs>
          </Section>

          {/* Dialog */}
          <Section title="Dialog">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Work</DialogTitle>
                  <DialogDescription>
                    Upload your deliverables and add any notes for the reviewer.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 my-4">
                  <Input label="Title" placeholder="Submission title" />
                  <Textarea label="Notes" placeholder="Add notes..." rows={3} />
                </div>
                <DialogFooter>
                  <Button variant="ghost">Cancel</Button>
                  <Button>Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Section>

          {/* Dropdown */}
          <Section title="Dropdown Menu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Options <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <User className="h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Section>

          {/* Tooltip */}
          <Section title="Tooltip">
            <div className="flex gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    Hover me
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a helpful tooltip</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </Section>

          {/* Avatar */}
          <Section title="Avatars">
            <div className="flex items-center gap-4">
              <Avatar name="Priya Sharma" size="sm" />
              <Avatar name="Ravi Kumar" size="md" />
              <Avatar name="Anita Desai" size="lg" />
              <Avatar name="Dev Team" size="xl" />
            </div>
          </Section>

          {/* Progress */}
          <Section title="Progress">
            <div className="space-y-4 max-w-md">
              <div>
                <p className="text-sm text-text-secondary mb-2">25%</p>
                <Progress value={25} />
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-2">50%</p>
                <Progress value={50} />
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-2">75%</p>
                <Progress
                  value={75}
                  indicatorClassName="bg-secondary"
                />
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-2">100%</p>
                <Progress
                  value={100}
                  indicatorClassName="bg-success"
                />
              </div>
            </div>
          </Section>

          {/* Skeleton */}
          <Section title="Skeleton">
            <div className="space-y-3 max-w-md">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </Section>

          {/* Metric Tiles */}
          <Section title="Metric Tiles">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricTile
                label="Active Tasks"
                value={5}
                icon={Zap}
                trend={{ value: 12, label: "vs last month" }}
                delay={0}
              />
              <MetricTile
                label="Earnings"
                value="₹24,500"
                icon={TrendingUp}
                trend={{ value: 8, label: "vs last month" }}
                delay={0.1}
              />
              <MetricTile
                label="Skill Level"
                value="Advanced"
                icon={Star}
                delay={0.2}
              />
              <MetricTile
                label="PoDL Records"
                value={23}
                icon={FileText}
                trend={{ value: -3, label: "vs last month" }}
                delay={0.3}
              />
            </div>
          </Section>

          {/* Timeline */}
          <Section title="Timeline Stepper">
            <div className="max-w-md">
              <TimelineStepper
                steps={[
                  {
                    id: "1",
                    title: "Task Assigned",
                    description: "API endpoint implementation",
                    date: "Jan 15, 2026",
                    status: "completed",
                  },
                  {
                    id: "2",
                    title: "Work Submitted",
                    description: "First submission with tests",
                    date: "Jan 20, 2026",
                    status: "completed",
                  },
                  {
                    id: "3",
                    title: "Under Review",
                    description: "Reviewer: Anita Desai",
                    date: "Jan 21, 2026",
                    status: "current",
                  },
                  {
                    id: "4",
                    title: "Accepted",
                    status: "upcoming",
                  },
                ]}
              />
            </div>
          </Section>

          {/* Accordion */}
          <Section title="Accordion">
            <div className="max-w-lg">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is Skill Genome?</AccordionTrigger>
                  <AccordionContent>
                    A continuously updated profile of your skills, behaviors,
                    and delivery reliability. It powers team formation and task
                    matching.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How does outcome-based payment work?
                  </AccordionTrigger>
                  <AccordionContent>
                    Payments are triggered only by accepted outcomes and
                    evidence, not by hours logged. Quality and proof drive
                    earnings.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What is PoDL?</AccordionTrigger>
                  <AccordionContent>
                    Proof-of-Delivery Ledger — a verifiable record of your
                    accepted deliverables and contributions across all projects.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Section>

          {/* Empty State */}
          <Section title="Empty State">
            <EmptyState
              icon={Inbox}
              title="No tasks yet"
              description="You haven't been assigned any tasks. New tasks will appear here when a project matches your Skill Genome."
              action={{
                label: "Browse Projects",
                onClick: () => {},
              }}
            />
          </Section>

          {/* Toast */}
          <Section title="Toast Notifications">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  notify({
                    type: "success",
                    title: "Task accepted",
                    description: "Your submission has been approved.",
                  })
                }
              >
                Success Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  notify({
                    type: "error",
                    title: "Submission rejected",
                    description: "Please review the feedback and resubmit.",
                  })
                }
              >
                Error Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  notify({
                    type: "warning",
                    title: "Deadline approaching",
                    description: "Task due in 2 days.",
                  })
                }
              >
                Warning Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  notify({
                    type: "info",
                    title: "New learning asset",
                    description: "A tutorial has been recommended for you.",
                  })
                }
              >
                Info Toast
              </Button>
            </div>
          </Section>
        </div>

        <ToastContainer />
      </div>
    </TooltipProvider>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-heading text-2xl text-text-deep mb-6">{title}</h2>
      {children}
    </section>
  );
}

function ColorSwatch({
  color,
  label,
  hex,
}: {
  color: string;
  label: string;
  hex: string;
}) {
  return (
    <div className="space-y-2">
      <div
        className={`h-16 w-full rounded-[var(--radius-md)] ${color} shadow-warm-sm border border-black/5`}
      />
      <p className="text-xs font-medium text-text-deep">{label}</p>
      <p className="text-xs text-text-muted">{hex}</p>
    </div>
  );
}
