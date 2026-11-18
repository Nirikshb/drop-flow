"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "new",
  "await",
  "async",
  "function",
  "return",
  "if",
  "else",
  "for",
  "of",
  "in",
  "type",
  "interface",
  "as",
  "true",
  "false",
  "null",
  "undefined",
  "void",
  "throw",
  "try",
  "catch",
]);

const TOKEN_SOURCE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b[A-Za-z_$][\w$]*(?=\s*\()|\b[A-Za-z_$][\w$]*\b|\b\d+(?:\.\d+)?\b)/.source;

function tokenClass(token: string): string {
  if (token.startsWith("//") || token.startsWith("/*")) return "text-slate-500";
  if (/^["'`]/.test(token)) return "text-emerald-300";
  if (/^\d/.test(token)) return "text-amber-300";
  if (KEYWORDS.has(token)) return "text-violet-300";
  return "text-sky-300";
}

function highlight(code: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = new RegExp(TOKEN_SOURCE, "g");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(code)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(code.slice(lastIndex, match.index));
    }
    nodes.push(
      <span key={match.index} className={tokenClass(match[0])}>
        {match[0]}
      </span>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < code.length) nodes.push(code.slice(lastIndex));
  return nodes;
}

interface CodeBlockProps {
  code: string;
  filename?: string;
  language?: string;
  className?: string;
}

export function CodeBlock({
  code,
  filename,
  language = "ts",
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy — check clipboard permissions");
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-white/10 bg-[#0a0f1c] shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/5 px-3 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
          </div>
          {filename && (
            <span className="truncate font-mono text-xs text-slate-300">
              {filename}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden font-mono text-[10px] tracking-wider text-slate-500 uppercase sm:inline">
            {language}
          </span>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy code to clipboard"
            className="inline-flex size-7 items-center justify-center rounded-md text-slate-400 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy className="size-3.5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-6 text-slate-200 sm:text-[13px]">
        <code>{highlight(code)}</code>
      </pre>
    </div>
  );
}
