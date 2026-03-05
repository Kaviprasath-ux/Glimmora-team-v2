"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PageTransition,
  Button,
  Input,
  Textarea,
  Skeleton,
} from "@/components/ui";
import { Avatar } from "@/components/ui/avatar";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { notify } from "@/components/ui/toast";
import { Save, MapPin } from "lucide-react";

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

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name,
        email: profile.email,
        phone: profile.phone || "",
        bio: profile.bio || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    await updateProfile.mutateAsync(form);
    notify({
      type: "success",
      title: "Profile updated",
      description: "Your changes have been saved.",
    });
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
          <Skeleton className="h-[120px] rounded-2xl" />
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
        {/* ── Hero — Standard 3-tier ── */}
        <motion.div variants={fadeUp}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">
            Your Identity
          </p>
          <h1
            className="font-heading font-bold text-neutral-950 leading-tight"
            style={{ fontSize: 28, letterSpacing: "-0.025em" }}
          >
            Profile
          </h1>
          <p className="mt-1.5 text-[13px] text-neutral-500 leading-relaxed max-w-xl">
            Your identity and public information.
          </p>
        </motion.div>

        {/* ── Profile Identity — White card (replaces dark banner) ── */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-white overflow-hidden"
          style={cardStyle}
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-5">
              <div
                className="shrink-0 rounded-full p-[3px]"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 25%, transparent), color-mix(in srgb, var(--color-accent-terracotta) 20%, transparent))",
                }}
              >
                <Avatar
                  name={form.name}
                  size="xl"
                  className="ring-2 ring-white"
                />
              </div>
              <div className="min-w-0">
                <h2
                  className="font-heading font-bold text-neutral-950 truncate"
                  style={{ fontSize: 20, letterSpacing: "-0.01em" }}
                >
                  {form.name}
                </h2>
                <p className="text-[13px] text-neutral-500 mt-0.5">
                  {profile.role}
                </p>
                {profile.university && (
                  <div className="flex items-center gap-1.5 mt-2 text-[12px] text-neutral-400">
                    <MapPin className="h-3 w-3" />
                    {profile.university}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Edit Details Card ── */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-white overflow-hidden"
          style={cardStyle}
        >
          <div className="p-6">
            <h2 className="font-heading font-bold text-[15px] text-neutral-900 mb-5">
              Edit Details
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                label="Location"
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
              <div className="sm:col-span-2">
                <Textarea
                  label="Bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateProfile.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}
