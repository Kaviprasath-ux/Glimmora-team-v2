"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import {
  PageTransition,
  Skeleton,
  Badge,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Progress,
} from "@/components/ui";
import { AIReadinessGauge } from "@/components/dashboard/ai-readiness-gauge";
import { useSkillGenome, useBadges } from "@/hooks/use-skills";
import {
  ShieldCheck,
  Users,
  TrendingUp,
  Heart,
  Rocket,
  Flame,
  Brain,
  Trophy,
  Layers,
  CheckCircle,
  Sparkles,
  Lock,
  Award,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

const ResponsiveRadar = dynamic(
  () => import("@nivo/radar").then((m) => m.ResponsiveRadar),
  { ssr: false, loading: () => <Skeleton className="h-80 rounded-[var(--radius-xl)]" /> },
);

const badgeIcons: Record<string, React.ElementType> = {
  rocket: Rocket,
  flame: Flame,
  shield: ShieldCheck,
  brain: Brain,
  users: Users,
  layers: Layers,
  heart: Heart,
  trophy: Trophy,
  "check-circle": CheckCircle,
  sparkles: Sparkles,
};

export default function SkillGenomePage() {
  const { data: genome, isLoading: genomeLoading } = useSkillGenome();
  const { data: badges, isLoading: badgesLoading } = useBadges();

  const radarData = useMemo(() => {
    if (!genome) return [];
    return genome.dimensions.map((d) => ({
      skill: d.skill,
      value: d.level,
    }));
  }, [genome]);

  if (genomeLoading || badgesLoading || !genome || !badges) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-[var(--radius-2xl)]" />
          <Skeleton className="h-96 rounded-[var(--radius-xl)]" />
        </div>
      </PageTransition>
    );
  }

  const earnedBadges = badges.filter((b) => !b.locked);

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-gradient-warm">Skill Genome</h1>
          <p className="mt-1 text-text-secondary">
            Your AI-generated skill profile, continuously updated from delivery data.
          </p>
        </div>

        {/* Centered Gauge Hero — full-width, gradient bg, inline stats */}
        <div className="rounded-[var(--radius-2xl)] bg-gradient-to-br from-[#43302B] to-[#5A4035] p-8 sm:p-10 relative overflow-hidden shadow-warm-xl">
          <div className="absolute inset-0 dot-pattern pointer-events-none opacity-20" />
          <div className="orb orb-warm w-[200px] h-[200px] -top-16 -right-16 opacity-30" />
          <div className="orb orb-gold w-[120px] h-[120px] bottom-[-40px] left-[15%] opacity-20" style={{ animationDelay: "-5s" }} />

          <div className="relative z-10 flex flex-col items-center">
            <p className="text-[11px] text-white/50 font-semibold uppercase tracking-[0.14em] mb-4">AI Readiness Score</p>
            <AIReadinessGauge score={genome.aiReadinessScore} size={120} />
            <p className="mt-3 text-4xl font-heading font-bold text-white tracking-tight">
              {genome.aiReadinessScore} <span className="text-lg text-white/40 font-normal">/ 100</span>
            </p>
            <p className="text-[11px] text-white/40 mt-1">
              Updated {formatDate(genome.updatedAt)}
            </p>

            {/* Inline stats inside hero */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg">
              {[
                { label: "Reliability", value: `${genome.reliabilityScore}%`, icon: ShieldCheck },
                { label: "Collaboration", value: `${genome.collaborationScore}%`, icon: Users },
                { label: "Learning", value: `${genome.learningVelocity}%`, icon: TrendingUp },
                { label: "Integrity", value: `${genome.integrityScore}%`, icon: Heart },
              ].map((stat) => (
                <div key={stat.label} className="text-center rounded-[var(--radius-lg)] bg-white/[0.06] backdrop-blur-sm px-3 py-3">
                  <stat.icon className="h-4 w-4 text-white/50 mx-auto mb-1" />
                  <p className="text-lg font-heading font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/40 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radar Chart — NO card wrapper, bare on canvas with mesh pattern */}
        <div className="relative">
          <div className="absolute inset-0 bg-mesh-pattern pointer-events-none opacity-30 rounded-[var(--radius-xl)]" />
          <h3 className="text-base font-bold text-text-deep mb-4 relative z-10">
            Skill Dimensions
          </h3>
          <div className="h-[380px] relative z-10">
            <ResponsiveRadar
              data={radarData}
              keys={["value"]}
              indexBy="skill"
              maxValue={100}
              margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
              curve="linearClosed"
              borderWidth={2.5}
              borderColor="#A18072"
              gridLevels={5}
              gridShape="circular"
              gridLabelOffset={20}
              dotSize={8}
              dotColor="#FFFFFF"
              dotBorderWidth={2.5}
              dotBorderColor="#A18072"
              colors={["rgba(139,117,101,0.2)"]}
              fillOpacity={0.5}
              blendMode="normal"
              theme={{
                text: { fill: "#9C8E84", fontSize: 12 },
                grid: { line: { stroke: "rgba(0,0,0,0.04)" } },
              }}
            />
          </div>
        </div>

        {/* Badges — horizontal scroll strip */}
        <div>
          <h3 className="font-heading text-lg font-bold text-text-deep mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-[#B8A060]" />
            Badges ({earnedBadges.length}/{badges.length})
          </h3>

          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none -mx-1 px-1">
            {badges.map((badge) => {
              const Icon = badgeIcons[badge.icon] || Award;
              return (
                <div
                  key={badge.id}
                  className={cn(
                    "shrink-0 flex flex-col items-center rounded-[var(--radius-lg)] p-4 text-center transition-all duration-200 w-[110px]",
                    badge.locked
                      ? "border border-black/[0.04] bg-black/[0.01] opacity-60"
                      : "bg-gradient-to-br from-[#B8A060]/[0.06] to-transparent border border-[#B8A060]/10 hover:shadow-[0_4px_20px_rgba(184,164,76,0.12)] hover:scale-[1.02]",
                  )}
                >
                  {badge.locked && (
                    <Lock className="h-3 w-3 text-text-muted mb-1" />
                  )}
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full",
                      badge.locked
                        ? "bg-black/[0.04] text-text-muted"
                        : "bg-gradient-to-br from-[#B8A060]/20 to-[#B8A060]/5 text-[#B8A060]",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-text-deep">
                    {badge.name}
                  </p>
                  {badge.earnedAt && (
                    <p className="mt-0.5 text-[10px] text-text-muted">
                      {formatDate(badge.earnedAt)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill Detail Accordion — full-width */}
        <div className="rounded-[var(--radius-xl)] bg-white border border-black/[0.04] p-6 shadow-warm">
          <h3 className="font-heading text-lg font-bold text-text-deep mb-4">
            Skill Breakdown
          </h3>
          <Accordion type="single" collapsible>
            {genome.dimensions.map((dim) => (
              <AccordionItem key={dim.skill} value={dim.skill}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3 flex-1 mr-4">
                    <span className="text-sm font-medium">{dim.skill}</span>
                    <Badge
                      variant={
                        dim.level >= 80
                          ? "success"
                          : dim.level >= 60
                            ? "warning"
                            : "info"
                      }
                    >
                      {dim.level >= 80
                        ? "Expert"
                        : dim.level >= 60
                          ? "Advanced"
                          : dim.level >= 40
                            ? "Intermediate"
                            : "Beginner"}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 rounded-[var(--radius-md)] bg-black/[0.02] p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">
                        Category: {dim.category}
                      </span>
                      <span className="font-bold tabular-nums">{dim.level}/100</span>
                    </div>
                    <Progress value={dim.level} indicatorClassName={
                      dim.level >= 80
                        ? "bg-gradient-to-r from-[#6B8F71] to-[#7A8F66]"
                        : dim.level >= 60
                          ? "bg-gradient-to-r from-[#B8A060] to-[#C9B85C]"
                          : "bg-gradient-to-r from-[#A18072] to-[#BFA094]"
                    } />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </PageTransition>
  );
}
