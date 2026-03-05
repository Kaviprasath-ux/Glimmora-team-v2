"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PageTransition,
  Button,
  Input,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Skeleton,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { notify } from "@/components/ui/toast";
import { Download, Trash2, AlertTriangle } from "lucide-react";

/* ── Animations ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.02 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};
const cardStyle = {
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "var(--shadow-warm)",
} as const;

export default function SettingsPage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    profilePublic: true,
    showEarnings: false,
  });
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (profile) {
      setPrefs(profile.preferences);
    }
  }, [profile]);

  const togglePref = async (key: keyof typeof prefs) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    await updateProfile.mutateAsync({ preferences: updated });
    notify({ type: "success", title: "Preference updated" });
  };

  if (isLoading || !profile) {
    return (
      <PageTransition>
        <div className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-80 rounded-xl" />
          <Skeleton className="h-[320px] rounded-2xl" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <motion.div
        className="space-y-5"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* ── Hero ── */}
        <motion.div variants={fadeUp}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
            Preferences
          </p>
          <h1
            className="font-heading font-bold text-neutral-950 leading-tight"
            style={{ fontSize: 28, letterSpacing: "-0.025em" }}
          >
            Settings
          </h1>
          <p className="mt-1.5 text-[13px] text-neutral-500 leading-relaxed max-w-xl">
            Manage your preferences and account.
          </p>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div variants={fadeUp}>
          <Tabs defaultValue="notifications">
            <TabsList>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <motion.div
                className="rounded-2xl bg-white overflow-hidden"
                style={cardStyle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="p-6">
                  <h3 className="font-heading text-[15px] font-bold text-neutral-900 mb-5">
                    Notification Preferences
                  </h3>
                  <div className="space-y-5">
                    <Switch
                      label="Email Notifications"
                      checked={prefs.emailNotifications}
                      onCheckedChange={() => togglePref("emailNotifications")}
                    />
                    <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
                    <Switch
                      label="Push Notifications"
                      checked={prefs.pushNotifications}
                      onCheckedChange={() => togglePref("pushNotifications")}
                    />
                    <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
                    <Switch
                      label="Weekly Digest"
                      checked={prefs.weeklyDigest}
                      onCheckedChange={() => togglePref("weeklyDigest")}
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <motion.div
                className="rounded-2xl bg-white overflow-hidden"
                style={cardStyle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="p-6">
                  <h3 className="font-heading text-[15px] font-bold text-neutral-900 mb-5">
                    Privacy & Consent
                  </h3>
                  <div className="space-y-5">
                    <Switch
                      label="Public Profile"
                      checked={prefs.profilePublic}
                      onCheckedChange={() => togglePref("profilePublic")}
                    />
                    <p className="text-[11px] text-neutral-400 -mt-2 ml-14">
                      Allow team members and reviewers to see your profile.
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
                    <Switch
                      label="Show Earnings to Others"
                      checked={prefs.showEarnings}
                      onCheckedChange={() => togglePref("showEarnings")}
                    />
                    <p className="text-[11px] text-neutral-400 -mt-2 ml-14">
                      Universities never see your earnings. This controls peer
                      visibility only.
                    </p>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Data Tab */}
            <TabsContent value="data">
              <motion.div
                className="rounded-2xl bg-white overflow-hidden"
                style={cardStyle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="p-6">
                  <h3 className="font-heading text-[15px] font-bold text-neutral-900 mb-5">
                    Data & Account
                  </h3>
                  <div className="space-y-4">
                    {/* Export Data */}
                    <div
                      className="rounded-xl p-4 transition-all"
                      style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">
                            Export My Data
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-1">
                            Download all your data including profile, PoDL
                            records, earnings, and skill genome.
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" /> Export
                        </Button>
                      </div>
                    </div>

                    {/* Delete Account */}
                    <div
                      className="rounded-xl p-4 transition-all"
                      style={{
                        border:
                          "1px solid color-mix(in srgb, var(--color-accent-terracotta) 15%, transparent)",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5"
                            style={{
                              background:
                                "color-mix(in srgb, var(--color-accent-terracotta) 8%, transparent)",
                            }}
                          >
                            <AlertTriangle
                              className="h-4 w-4"
                              style={{
                                color: "var(--color-accent-terracotta)",
                              }}
                            />
                          </div>
                          <div>
                            <p
                              className="text-sm font-semibold"
                              style={{
                                color: "var(--color-accent-terracotta)",
                              }}
                            >
                              Delete Account
                            </p>
                            <p className="text-[11px] text-neutral-400 mt-1">
                              Permanently delete your account and all associated
                              data. This cannot be undone.
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setShowDelete(true)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <Dialog open={showDelete} onOpenChange={setShowDelete}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                      This will permanently delete your account, PoDL records,
                      earnings history, and all personal data. This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="my-4">
                    <Input
                      label='Type "DELETE" to confirm'
                      placeholder="DELETE"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setShowDelete(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setShowDelete(false)}
                    >
                      Permanently Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
