"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Checkbox,
  Progress,
  Card,
} from "@/components/ui";
import {
  Rocket,
  User,
  Dna,
  Brain,
  BookOpen,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const steps = [
  { id: 1, title: "Welcome", icon: Rocket },
  { id: 2, title: "Basic Info", icon: User },
  { id: 3, title: "Skill Discovery", icon: Dna },
  { id: 4, title: "AI Assessment", icon: Brain },
  { id: 5, title: "Orientation", icon: BookOpen },
  { id: 6, title: "Consent", icon: Shield },
  { id: 7, title: "Ready!", icon: CheckCircle },
];

export default function AlumniOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const progress = (step / steps.length) * 100;

  const next = () => setStep((s) => Math.min(s + 1, steps.length));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="min-h-screen bg-surface-warm flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-surface-card border-b border-primary/8">
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">
              Step {step} of {steps.length}
            </span>
            <span className="text-xs font-medium text-primary">
              {steps[step - 1].title}
            </span>
          </div>
          <Progress value={progress} indicatorClassName="bg-secondary" />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <div className="text-center space-y-6">
                  <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-primary/10">
                    <Rocket className="h-10 w-10 text-primary" />
                  </div>
                  <h1 className="font-heading text-3xl text-text-deep">
                    Welcome to GlimmoraTeam
                  </h1>
                  <p className="text-text-secondary max-w-md mx-auto">
                    You&apos;re about to join a platform where your skills meet real
                    projects. Get paid for outcomes, build proof-of-work, and
                    grow your career.
                  </p>
                  <Button size="lg" onClick={next}>
                    Get Started <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <Card>
                  <h2 className="font-heading text-2xl text-text-deep mb-6">
                    Tell us about yourself
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="First Name" placeholder="Priya" />
                      <Input label="Last Name" placeholder="Sharma" />
                    </div>
                    <Input label="Email" type="email" placeholder="you@example.com" />
                    <Input label="Phone" placeholder="+91 98765 43210" />
                    <Select>
                      <SelectTrigger label="University">
                        <SelectValue placeholder="Select university" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iit-delhi">IIT Delhi</SelectItem>
                        <SelectItem value="iit-bombay">IIT Bombay</SelectItem>
                        <SelectItem value="bits">BITS Pilani</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input label="Year of Graduation" placeholder="2025" />
                  </div>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <h2 className="font-heading text-2xl text-text-deep mb-2">
                    Skill Discovery
                  </h2>
                  <p className="text-sm text-text-secondary mb-6">
                    Select the skills you&apos;re confident in. We&apos;ll use this to match
                    you with the right projects.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "React", "Node.js", "TypeScript", "Python", "Java",
                      "PostgreSQL", "Docker", "AWS", "REST API", "GraphQL",
                      "Machine Learning", "Data Analysis",
                    ].map((skill) => (
                      <label
                        key={skill}
                        className="flex items-center gap-2 rounded-[var(--radius)] border border-primary/10 p-3 hover:bg-primary/3 cursor-pointer transition-colors"
                      >
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-text-deep">{skill}</span>
                      </label>
                    ))}
                  </div>
                </Card>
              )}

              {step === 4 && (
                <Card>
                  <h2 className="font-heading text-2xl text-text-deep mb-2">
                    AI Readiness Assessment
                  </h2>
                  <p className="text-sm text-text-secondary mb-6">
                    A quick assessment to understand your current skill level.
                    No right or wrong answers — this helps us personalize your
                    experience.
                  </p>
                  <div className="space-y-4">
                    {[
                      "I can build a full REST API from scratch",
                      "I understand version control with Git",
                      "I can write unit tests for my code",
                      "I can deploy an application to the cloud",
                      "I can read and understand someone else's code",
                    ].map((q, i) => (
                      <div key={i} className="space-y-2">
                        <p className="text-sm text-text-deep">{q}</p>
                        <div className="flex gap-2">
                          {["Strongly Agree", "Agree", "Neutral", "Disagree"].map(
                            (opt) => (
                              <label
                                key={opt}
                                className="flex-1 text-center text-xs rounded-[var(--radius)] border border-primary/10 py-2 hover:bg-primary/5 cursor-pointer transition-colors"
                              >
                                <input
                                  type="radio"
                                  name={`q-${i}`}
                                  className="sr-only"
                                />
                                {opt}
                              </label>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {step === 5 && (
                <Card>
                  <h2 className="font-heading text-2xl text-text-deep mb-2">
                    Platform Orientation
                  </h2>
                  <p className="text-sm text-text-secondary mb-6">
                    Here&apos;s how GlimmoraTeam works:
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Outcome-Based Delivery",
                        desc: "Get matched to real enterprise tasks. Complete them, get paid. No hourly billing.",
                      },
                      {
                        title: "Skill Genome",
                        desc: "Your AI-powered skill profile updates with every delivery. It gets smarter as you work.",
                      },
                      {
                        title: "Proof-of-Delivery Ledger",
                        desc: "Every accepted task becomes a verifiable credential. Build your professional proof-of-work.",
                      },
                      {
                        title: "Team Formation",
                        desc: "You'll be placed in small teams with complementary skills. Collaboration is built-in.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[var(--radius)] border border-primary/8 p-4"
                      >
                        <h4 className="text-sm font-medium text-text-deep">
                          {item.title}
                        </h4>
                        <p className="text-xs text-text-secondary mt-1">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {step === 6 && (
                <Card>
                  <h2 className="font-heading text-2xl text-text-deep mb-2">
                    Consent & Agreements
                  </h2>
                  <p className="text-sm text-text-secondary mb-6">
                    Please review and agree to the following:
                  </p>
                  <div className="space-y-4">
                    <Checkbox label="I agree to the GlimmoraTeam Terms of Service" />
                    <Checkbox label="I consent to AI-assisted skill assessment and matching" />
                    <Checkbox label="I understand that payment is outcome-locked (paid on accepted deliverables)" />
                    <Checkbox label="I agree to the Privacy Policy and data handling practices" />
                    <Checkbox label="I acknowledge that my university will not see my earnings" />
                  </div>
                </Card>
              )}

              {step === 7 && (
                <div className="text-center space-y-6">
                  <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-success/10">
                    <CheckCircle className="h-10 w-10 text-success" />
                  </div>
                  <h1 className="font-heading text-3xl text-text-deep">
                    You&apos;re all set!
                  </h1>
                  <p className="text-text-secondary max-w-md mx-auto">
                    Your account is ready. We&apos;re building your Skill Genome and
                    finding the best projects for you. Head to your workspace to
                    get started.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => router.push("/workspace")}
                  >
                    Go to Workspace <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      {step > 1 && step < steps.length && (
        <div className="sticky bottom-0 bg-surface-card border-t border-primary/8">
          <div className="max-w-xl mx-auto px-4 py-3 flex justify-between">
            <Button variant="ghost" onClick={prev}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={next}>
              Continue <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
