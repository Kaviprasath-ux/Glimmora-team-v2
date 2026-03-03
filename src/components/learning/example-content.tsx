"use client";

import { useState } from "react";
import { FileCode, Copy, Check } from "lucide-react";
import type { CodeBlock } from "@/types";

interface ExampleContentProps {
  codeBlocks: CodeBlock[];
}

function CodeBlockCard({ block }: { block: CodeBlock }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[var(--radius-md)] overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: "#1e1e2e" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileCode className="h-4 w-4 text-[#cdd6f4] shrink-0" />
          <span className="text-sm text-[#cdd6f4] font-medium truncate">
            {block.filename}
          </span>
          <span className="text-xs text-[#6c7086]">{block.language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-[#6c7086] hover:text-[#cdd6f4] transition-colors shrink-0 ml-2"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#a6e3a1]" />
              <span className="text-[#a6e3a1]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div style={{ backgroundColor: "#11111b" }}>
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm text-[#cdd6f4] font-mono leading-relaxed whitespace-pre">
            {block.code}
          </code>
        </pre>
      </div>
    </div>
  );
}

export function ExampleContent({ codeBlocks }: ExampleContentProps) {
  return (
    <div className="space-y-4">
      {codeBlocks.map((block) => (
        <CodeBlockCard key={block.filename} block={block} />
      ))}
    </div>
  );
}
