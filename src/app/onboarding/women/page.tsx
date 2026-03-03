"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Input,
  Card,
  Checkbox,
  Progress,
} from "@/components/ui";
import {
  Heart,
  User,
  Dna,
  Shield,
  CreditCard,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sun,
  Fingerprint,
} from "lucide-react";

const steps = [
  { id: 1, title: "Welcome", icon: Heart },
  { id: 2, title: "Registration", icon: User },
  { id: 3, title: "Skills", icon: Dna },
  { id: 4, title: "Orientation", icon: Sun },
  { id: 5, title: "Verification", icon: Fingerprint },
  { id: 6, title: "Starter Task", icon: Shield },
  { id: 7, title: "Payment", icon: CreditCard },
  { id: 8, title: "Community", icon: Users },
  { id: 9, title: "Ready!", icon: CheckCircle },
];

export default function WomenOnboardingPage() {
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
            <span className="text-xs font-medium text-accent-terracotta">
              {steps[step - 1].title}
            </span>
          </div>
          <Progress value={progress} indicatorClassName="bg-accent-terracotta" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {step === 1 && (
                <div className="text-center space-y-6">
                  <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-accent-terracotta/10">
                    <Heart className="h-10 w-10 text-accent-terracotta" />
                  </div>
                  <h1 className="font-heading text-3xl text-text-deep">
                    Welcome to a safe space
                  </h1>
                  <p className="text-text-secondary max-w-md mx-auto text-lg leading-relaxed">
                    GlimmoraTeam is designed with you in mind. Work from home,
                    at your own pace, on real projects that value your IT skills.
                    No compromises on dignity, safety, or flexibility.
                  </p>
                  <p className="text-sm text-text-muted max-w-sm mx-auto">
                    Your identity is protected. Your earnings are private.
                    Your growth is celebrated.
                  </p>
                  <Button
                    size="lg"
                    onClick={next}
                    className="min-h-[48px] min-w-[200px]"
                  >
                    Begin Your Journey{" "}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <Card>
                  <h2 className="font-heading text-2xl text-text-deep mb-2">
                    A gentle start
                  </h2>
                  <p className="text-sm text-text-secondary mb-6">
                    Only the basics for now. You can fill in more details later
                    when you&apos;re comfortable.
                  </p>
                  <div className="space-y-4">
                    <Input label="Your Name (or preferred name)" placeholder="What should we call you?" />
                    <Input label="Email" type="email" placeholder="your.email@example.com" />
                    <Input label="Phone (optional)" placeholder="+91" />
                    <p className="text-xs text-text-muted">
                      Your phone number is never shared. It&apos;s only used for
                      account recovery.
                    </p>
                  </div>
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <h2 className="font-heading text-2xl text-text-deep mb-2">
                    What are you good at?
                  </h2>
                  <p className="text-sm text-text-secondary mb-6">
                    Select the areas where you have experience. Don&apos;t worry
                    about being perfect — we&apos;ll help you grow.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Web Development", "Data Entry", "Testing/QA",
                      "Content Writing", "UI Design", "Python",
                      "Excel / Data Analysis", "Mobile Development",
                      "Translation", "Customer Support",
                    ].map((skill) => (
                      <label
                        key={skill}
                        className="flex items-center gap-2 rounded-[var(--radius)] border border-primary/10 p-3 min-h-[48px] hover:bg-primary/3 cursor-pointer transition-colors"
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
                    How it works for you
                  </h2>
                  <p className="text-sm text-text-secondary mb-6">
                    GlimmoraTeam is built around your needs:
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Work from home, always",
                        desc: "Every task is 100% remote. Set your own hours and work around your schedule.",
                      },
                      {
                        title: "Get paid for what you deliver",
                        desc: "No hourly tracking. Complete a task, get it reviewed, receive payment. Simple.",
                      },
                      {
                        title: "Your identity is protected",
                        desc: "Clients see your work, not your personal details. Privacy is built-in, not optional.",
                      },
                      {
                        title: "Start small, grow big",
                        desc: "Begin with guided starter tasks. As your confidence grows, so do the opportunities.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[var(--radius)] border border-accent-terracotta/10 bg-accent-terracotta/3 p-4"
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

              {step === 5 && (
                <Card>
                  <h2 className="font-heading text-2xl text-text-deep mb-2">
                    Identity Verification
                  </h2>
                  <p className="text-sm text-text-secondary mb-6">
                    A simple, one-time verification to ensure the safety of our
                    community. Your documents are encrypted and never shared.
                  </p>
                  <div className="space-y-4">
                    <div className="rounded-[var(--radius-md)] border-2 border-dashed border-primary/15 p-8 text-center">
                      <Fingerprint className="h-8 w-8 text-text-muted mx-auto" />
                      <p className="mt-2 text-sm text-text-secondary">
                        Upload a government-issued ID
                      </p>
                      <p className="mt-1 text-xs text-text-muted">
                        Aadhaar, PAN, or Passport
                      </p>
                      <Button variant="outline" size="sm" className="mt-3 min-h-[48px]">
                        Choose File
                      </Button>
                    </div>
                    <p className="text-xs text-text-muted">
                      Your ID is verified using secure AI. The original document
                      is deleted after verification.
                    </p>
                  </div>
                </Card>
              )}

              {step === 6 && (
                <Card>
                  <h2 className="font-heading text-2xl text-text-deep mb-2">
                    Your Guided Starter Task
                  </h2>
                  <p className="text-sm text-text-secondary mb-6">
                    We&apos;ll start you with a simple, low-pressure task to help you
                    get comfortable with the platform. Here&apos;s what to expect:
                  </p>
                  <div className="rounded-[var(--radius)] border border-secondary/15 bg-secondary/5 p-4 space-y-3">
                    <h4 className="text-sm font-medium text-text-deep">
                      Sample Starter Task
                    </h4>
                    <p className="text-xs text-text-secondary">
                      Review and annotate a set of product images with
                      descriptive tags.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span>Complexity: Simple</span>
                      <span>Estimated: 2-3 hours</span>
                      <span>Payout: ₹800</span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-text-muted">
                    You&apos;ll receive step-by-step guidance, and a reviewer will
                    provide gentle, constructive feedback.
                  </p>
                </Card>
              )}

              {step === 7 && (
                <Card>
                  <h2 className="font-heading text-2xl text-text-deep mb-2">
                    Payment Setup
                  </h2>
                  <p className="text-sm text-text-secondary mb-6">
                    Set up how you&apos;d like to receive payments. Your earnings go
                    directly to you — no middlemen.
                  </p>
                  <div className="space-y-4">
                    <Input label="Bank Account Holder Name" placeholder="As on your bank account" />
                    <Input label="Bank Account Number" placeholder="Account number" />
                    <Input label="IFSC Code" placeholder="e.g., SBIN0001234" />
                    <p className="text-xs text-text-muted">
                      Payments are processed weekly for accepted deliverables.
                      Your bank details are encrypted and stored securely.
                    </p>
                  </div>
                </Card>
              )}

              {step === 8 && (
                <Card>
                  <h2 className="font-heading text-2xl text-text-deep mb-2">
                    Join Your Community
                  </h2>
                  <p className="text-sm text-text-secondary mb-6">
                    You&apos;re not alone. Connect with other women contributors
                    for support, learning, and encouragement.
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Women Contributors Circle",
                        desc: "A private community of women in tech, sharing tips, celebrating wins, and supporting each other.",
                        members: "240+ members",
                      },
                      {
                        title: "Mentorship Program",
                        desc: "Get paired with an experienced woman mentor who can guide your growth journey.",
                        members: "30 mentors available",
                      },
                      {
                        title: "Weekly Learning Circles",
                        desc: "Optional group sessions on new skills, tools, and best practices.",
                        members: "Every Thursday, 3 PM",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-3 rounded-[var(--radius)] border border-primary/10 p-4"
                      >
                        <Users className="h-5 w-5 text-accent-terracotta shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-text-deep">
                            {item.title}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {item.desc}
                          </p>
                          <p className="text-xs text-text-muted mt-1">
                            {item.members}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {step === 9 && (
                <div className="text-center space-y-6">
                  <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-success/10">
                    <CheckCircle className="h-10 w-10 text-success" />
                  </div>
                  <h1 className="font-heading text-3xl text-text-deep">
                    Welcome aboard!
                  </h1>
                  <p className="text-text-secondary max-w-md mx-auto text-lg leading-relaxed">
                    You&apos;re ready to begin. Your workspace is set up, and your
                    first guided task is waiting for you.
                  </p>
                  <p className="text-sm text-text-muted max-w-sm mx-auto">
                    Remember: go at your own pace. Every step forward counts.
                    We&apos;re here to support you.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => router.push("/workspace")}
                    className="min-h-[48px] min-w-[200px]"
                  >
                    Enter Your Workspace{" "}
                    <ArrowRight className="h-4 w-4 ml-2" />
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
            <Button
              variant="ghost"
              onClick={prev}
              className="min-h-[48px]"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={next} className="min-h-[48px]">
              Continue <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
