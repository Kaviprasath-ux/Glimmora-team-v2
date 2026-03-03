"use client";

import { useState, useEffect } from "react";
import {
  PageTransition,
  Card,
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
import { Save, Download, Trash2, Bell, Shield, Lock, AlertTriangle } from "lucide-react";

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

  const handleSavePrefs = async () => {
    await updateProfile.mutateAsync({ preferences: prefs });
    notify({ type: "success", title: "Preferences saved" });
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
          <h1 className="font-heading text-3xl font-bold text-gradient-warm">Settings</h1>
          <p className="mt-1 text-text-secondary">
            Manage your preferences and account.
          </p>
        </div>

        <Tabs defaultValue="notifications">
          <TabsList>
            <TabsTrigger value="notifications">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#A18072]/15 to-[#A18072]/5 mr-1.5">
                <Bell className="h-3 w-3 text-[#A18072]" />
              </span>
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#5A6B4A]/15 to-[#5A6B4A]/5 mr-1.5">
                <Shield className="h-3 w-3 text-[#5A6B4A]" />
              </span>
              Privacy
            </TabsTrigger>
            <TabsTrigger value="data">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#B8A060]/15 to-[#B8A060]/5 mr-1.5">
                <Lock className="h-3 w-3 text-[#B8A060]" />
              </span>
              Data
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card variant="elevated">
              <h3 className="font-heading text-lg font-bold text-text-deep mb-5">
                Notification Preferences
              </h3>
              <div className="space-y-5">
                <Switch
                  label="Email Notifications"
                  checked={prefs.emailNotifications}
                  onCheckedChange={(checked) =>
                    setPrefs({ ...prefs, emailNotifications: checked as boolean })
                  }
                />
                <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
                <Switch
                  label="Push Notifications"
                  checked={prefs.pushNotifications}
                  onCheckedChange={(checked) =>
                    setPrefs({ ...prefs, pushNotifications: checked as boolean })
                  }
                />
                <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
                <Switch
                  label="Weekly Digest"
                  checked={prefs.weeklyDigest}
                  onCheckedChange={(checked) =>
                    setPrefs({ ...prefs, weeklyDigest: checked as boolean })
                  }
                />
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSavePrefs}>
                  <Save className="h-4 w-4 mr-2" /> Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card variant="elevated">
              <h3 className="font-heading text-lg font-bold text-text-deep mb-5">
                Privacy & Consent
              </h3>
              <div className="space-y-5">
                <Switch
                  label="Public Profile"
                  checked={prefs.profilePublic}
                  onCheckedChange={(checked) =>
                    setPrefs({ ...prefs, profilePublic: checked as boolean })
                  }
                />
                <p className="text-[11px] text-text-muted -mt-2 ml-14">
                  Allow team members and reviewers to see your profile.
                </p>
                <div className="h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
                <Switch
                  label="Show Earnings to Others"
                  checked={prefs.showEarnings}
                  onCheckedChange={(checked) =>
                    setPrefs({ ...prefs, showEarnings: checked as boolean })
                  }
                />
                <p className="text-[11px] text-text-muted -mt-2 ml-14">
                  Universities never see your earnings. This controls peer
                  visibility only.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSavePrefs}>
                  <Save className="h-4 w-4 mr-2" /> Save Privacy Settings
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data">
            <Card variant="elevated">
              <h3 className="font-heading text-lg font-bold text-text-deep mb-5">
                Data Permissions & Export
              </h3>
              <div className="space-y-4">
                <div className="rounded-[var(--radius-md)] border border-black/[0.06] p-4 hover:bg-black/[0.01] hover:shadow-warm-sm transition-all">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-text-deep">
                        Export My Data
                      </p>
                      <p className="text-[11px] text-text-muted mt-1">
                        Download all your data including profile, PoDL records,
                        earnings, and skill genome.
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" /> Export
                    </Button>
                  </div>
                </div>

                <div className="rounded-[var(--radius-md)] border border-[#8E4A55]/15 p-4 group hover:shadow-[0_0_16px_rgba(196,107,90,0.08)] transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8E4A55]/8 mt-0.5">
                        <AlertTriangle className="h-4 w-4 text-[#8E4A55]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#8E4A55]">
                          Delete Account
                        </p>
                        <p className="text-[11px] text-text-muted mt-1">
                          Permanently delete your account and all associated data.
                          This cannot be undone.
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
            </Card>

            <Dialog open={showDelete} onOpenChange={setShowDelete}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    This will permanently delete your account, PoDL records,
                    earnings history, and all personal data. This action cannot
                    be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="my-4">
                  <Input
                    label='Type "DELETE" to confirm'
                    placeholder="DELETE"
                  />
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setShowDelete(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={() => setShowDelete(false)}>
                    Permanently Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
