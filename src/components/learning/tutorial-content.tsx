"use client";

import { Button } from "@/components/ui";
import { Play, ExternalLink } from "lucide-react";

interface TutorialContentProps {
  title: string;
  videoUrl: string;
}

export function TutorialContent({ title, videoUrl }: TutorialContentProps) {
  return (
    <div className="space-y-3">
      {/* Video thumbnail placeholder */}
      <div
        className="relative aspect-video w-full rounded-[var(--radius-md)] overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1e1e2e 0%, #313244 50%, #45475a 100%)",
        }}
      >
        {/* Title overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-sm text-white/90 font-medium line-clamp-2">
            {title}
          </p>
        </div>

        {/* Centered play button */}
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center group"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm border border-white/20 transition-transform duration-200 group-hover:scale-110">
            <Play className="h-7 w-7 text-white ml-1" fill="currentColor" />
          </div>
        </a>
      </div>

      {/* Watch on YouTube button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => window.open(videoUrl, "_blank", "noopener,noreferrer")}
      >
        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
        Watch on YouTube
      </Button>
    </div>
  );
}
