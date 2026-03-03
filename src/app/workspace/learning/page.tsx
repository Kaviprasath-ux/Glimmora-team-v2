"use client";

import { useState, useMemo, useEffect } from "react";
import {
  PageTransition,
  Button,
  Badge,
  SkillChip,
  Skeleton,
  EmptyState,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Pagination,
} from "@/components/ui";
import {
  useLearningAssets,
  useLearningCounts,
} from "@/hooks/use-learning";
import {
  BookOpen,
  CheckSquare,
  Code2,
  Bot,
  Clock,
  CheckCircle,
  Play,
  Inbox,
  MessageCircle,
  Search,
  Eye,
} from "lucide-react";
import type { LearningAsset, LearningAssetType } from "@/types";
import { cn } from "@/lib/utils";
import { notify } from "@/components/ui/toast";
import { LearningAssetSheet } from "@/components/learning";

const ITEMS_PER_PAGE = 9;

const typeIcons: Record<LearningAssetType, React.ElementType> = {
  tutorial: BookOpen,
  checklist: CheckSquare,
  example: Code2,
  ai_tutor: Bot,
};

const typeCardStyles: Record<LearningAssetType, { bg: string; text: string; stripe: string }> = {
  tutorial: { bg: "bg-gradient-to-br from-[#A18072]/10 to-[#A18072]/3", text: "text-[#A18072]", stripe: "from-[#A18072] to-[#BFA094]" },
  checklist: { bg: "bg-gradient-to-br from-[#5A6B4A]/10 to-[#5A6B4A]/3", text: "text-[#5A6B4A]", stripe: "from-[#5A6B4A] to-[#7A8F66]" },
  example: { bg: "bg-gradient-to-br from-[#B8A060]/10 to-[#B8A060]/3", text: "text-[#B8A060]", stripe: "from-[#B8A060] to-[#C9B85C]" },
  ai_tutor: { bg: "bg-gradient-to-br from-[#BFA094]/10 to-[#BFA094]/3", text: "text-[#BFA094]", stripe: "from-[#BFA094] to-[#D2BAB0]" },
};

const filterPills = [
  { value: "all", label: "All" },
  { value: "tutorial", label: "Tutorials" },
  { value: "checklist", label: "Checklists" },
  { value: "example", label: "Examples" },
  { value: "ai_tutor", label: "AI Tutor" },
];

export default function LearningHubPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showMentor, setShowMentor] = useState(false);
  const [mentorMessage, setMentorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState<LearningAsset | null>(null);

  const typeFilter = activeFilter === "all" ? undefined : activeFilter;
  const { data: assets, isLoading } = useLearningAssets({
    type: typeFilter,
    search: search || undefined,
  });
  const { data: counts } = useLearningCounts();

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, search]);

  if (isLoading || !assets) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-32 rounded-[var(--radius-2xl)]" />
          <Skeleton className="h-40 rounded-[var(--radius-xl)]" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-[var(--radius-xl)]" />
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  const recommended = assets.filter((a) => !a.completed).slice(0, 5);
  const totalPages = Math.ceil(assets.length / ITEMS_PER_PAGE);
  const paginatedAssets = assets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleMentorSubmit = () => {
    notify({
      type: "success",
      title: "Request sent",
      description: "A mentor will respond within 24 hours.",
    });
    setShowMentor(false);
    setMentorMessage("");
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Hero: Title + Large search bar */}
        <div className="rounded-[var(--radius-2xl)] bg-gradient-to-br from-[#43302B]/[0.04] to-white border border-black/[0.04] p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="font-heading text-3xl font-bold text-gradient-warm">
                Learning Hub
              </h1>
              <p className="mt-1 text-text-secondary">
                Resources to grow your skills and improve delivery quality.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMentor(true)}
              className="shrink-0"
            >
              <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Ask a Mentor
            </Button>
          </div>

          {/* Large search bar as hero element */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search learning assets, tutorials, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-12 w-full rounded-[var(--radius-lg)] border border-black/[0.08] bg-white pl-12 pr-4 py-3 text-base text-text-deep placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:ring-[#A18072]/30 focus:border-[#A18072] shadow-warm-sm"
            />
          </div>
        </div>

        {/* Recommended — horizontal scroll */}
        {activeFilter === "all" && recommended.length > 0 && (
          <div>
            <h3 className="font-heading text-base font-bold text-text-deep mb-3">
              Recommended for You
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none -mx-1 px-1">
              {recommended.map((asset) => {
                const Icon = typeIcons[asset.type];
                const style = typeCardStyles[asset.type];
                return (
                  <div
                    key={asset.id}
                    className="shrink-0 w-[260px] rounded-[var(--radius-xl)] bg-white border border-black/[0.04] shadow-warm hover-lift transition-all overflow-hidden relative flex flex-col cursor-pointer"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <div className={cn("h-[3px] bg-gradient-to-r", style.stripe)} />
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-[var(--radius)]", style.bg)}>
                          <Icon className={cn("h-4 w-4", style.text)} />
                        </div>
                        <span className="flex items-center gap-1 text-[10px] text-text-muted">
                          <Clock className="h-3 w-3" />
                          {asset.duration}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-text-deep line-clamp-2">
                        {asset.title}
                      </h4>
                      <div className="mt-auto pt-2 flex flex-wrap gap-1">
                        {asset.relatedSkills.slice(0, 2).map((s) => (
                          <SkillChip key={s} skill={s} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterPills.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setActiveFilter(pill.value)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeFilter === pill.value
                  ? "bg-[#A18072] text-white shadow-warm-md"
                  : "bg-white border border-black/[0.06] text-text-secondary hover:border-[#A18072]/30 hover:text-text-deep",
              )}
            >
              {pill.label}
              {counts && (
                <span className={cn(
                  "ml-1.5 text-[11px] tabular-nums",
                  activeFilter === pill.value ? "text-white/70" : "text-text-muted"
                )}>
                  ({counts[pill.value] || 0})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* AI Tutor tab */}
        {activeFilter === "ai_tutor" ? (
          <div className="rounded-[var(--radius-xl)] bg-gradient-to-br from-[#BFA094]/[0.04] to-white border border-[#BFA094]/10 p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#BFA094]/[0.04] blur-3xl pointer-events-none" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#BFA094] to-[#A07265] shadow-sm">
                <Bot className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-deep">
                  AI Tutor
                </h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Get personalized learning guidance based on your Skill
                  Genome and current tasks. Ask questions, get
                  explanations, and receive practice exercises.
                </p>
                <Badge variant="warning" className="mt-2">
                  Coming Soon
                </Badge>
              </div>
            </div>
          </div>
        ) : assets.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No assets found"
            description={
              search
                ? "Try adjusting your search."
                : "No learning assets in this category yet."
            }
          />
        ) : (
          <>
            {/* 3-col asset grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedAssets.map((asset) => {
                const Icon = typeIcons[asset.type];
                const style = typeCardStyles[asset.type];
                return (
                  <div
                    key={asset.id}
                    className="rounded-[var(--radius-xl)] bg-white border border-black/[0.04] shadow-warm hover-lift transition-all overflow-hidden relative flex flex-col"
                  >
                    <div className={cn("h-[3px] bg-gradient-to-r", style.stripe)} />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between">
                        <div className={cn("flex h-9 w-9 items-center justify-center rounded-[var(--radius)]", style.bg)}>
                          <Icon className={cn("h-4 w-4", style.text)} />
                        </div>
                        {asset.completed ? (
                          <Badge variant="success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Done
                          </Badge>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] text-text-muted">
                            <Clock className="h-3 w-3" />
                            {asset.duration}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-3 text-sm font-semibold text-text-deep">
                        {asset.title}
                      </h4>
                      <p className="mt-1 text-[11px] text-text-secondary line-clamp-2 flex-1">
                        {asset.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {asset.relatedSkills.slice(0, 3).map((s) => (
                          <SkillChip key={s} skill={s} />
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-black/[0.04]">
                        {asset.completed ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAsset(asset)}
                          >
                            <Eye className="h-3 w-3 mr-1" /> View Details
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAsset(asset)}
                          >
                            <Play className="h-3 w-3 mr-1" /> Start Learning
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={assets.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </>
        )}
      </div>

      {/* Learning Asset Detail Sheet */}
      <LearningAssetSheet
        asset={selectedAsset}
        open={!!selectedAsset}
        onOpenChange={(open) => !open && setSelectedAsset(null)}
      />

      {/* Mentor Dialog */}
      <Dialog open={showMentor} onOpenChange={setShowMentor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Mentor Help</DialogTitle>
            <DialogDescription>
              Describe what you need help with. A senior team member or mentor
              will respond within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            label="Your Question"
            placeholder="What do you need help with?"
            value={mentorMessage}
            onChange={(e) => setMentorMessage(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMentor(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleMentorSubmit}
              disabled={!mentorMessage.trim()}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
