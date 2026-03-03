"use client";

import { useState, useEffect } from "react";
import {
  PageTransition,
  Card,
  Button,
  Input,
  Textarea,
  Skeleton,
} from "@/components/ui";
import { Avatar } from "@/components/ui/avatar";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { notify } from "@/components/ui/toast";
import { Save, MapPin, Mail, Phone } from "lucide-react";

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
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 mt-6 rounded-[var(--radius-xl)]" />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gradient-warm">Profile</h1>
          <p className="mt-1 text-text-secondary">
            Your identity and public information.
          </p>
        </div>

        {/* Profile Hero Banner */}
        <div className="relative rounded-[var(--radius-2xl)] bg-gradient-hero-animated p-8 sm:p-10 overflow-hidden shadow-warm-xl">
          <div className="absolute inset-0 dot-pattern pointer-events-none" />
          <div className="orb orb-warm w-[200px] h-[200px] -top-16 -right-16 opacity-50" />
          <div className="orb orb-gold w-[120px] h-[120px] bottom-[-40px] left-[20%] opacity-30" style={{ animationDelay: "-6s" }} />

          {/* Geometric circles */}
          <div className="absolute top-8 right-12 w-20 h-20 rounded-full border border-white/[0.05] pointer-events-none" />
          <div className="absolute top-12 right-16 w-12 h-12 rounded-full border border-white/[0.04] pointer-events-none" />

          <div className="flex items-center gap-5 relative z-10">
            <Avatar name={form.name} size="xl" className="ring-4 ring-white/20 shadow-lg" />
            <div>
              <p className="text-2xl font-heading font-bold text-white">{form.name}</p>
              <p className="text-sm text-white/60 mt-0.5">{profile.role}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-white/40">
                {profile.university && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {profile.university}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <Card variant="elevated">
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
              onChange={(e) => setForm({ ...form, location: e.target.value })}
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
            <Button onClick={handleSave} disabled={updateProfile.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
