"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type ScoreBarProps = {
  score: number;
  label?: string;
  className?: string;
};

function getScoreColor(score: number) {
  if (score >= 75) {
    return "bg-green-600";
  }

  if (score >= 50) {
    return "bg-amber-600";
  }

  return "bg-red-600";
}

export function ScoreBar({ score, label, className }: ScoreBarProps) {
  const normalized = Math.max(0, Math.min(100, score));

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-muted-foreground">{label ?? "Match Score"}</span>
        <span className="font-semibold text-foreground">{normalized}%</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${normalized}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={cn("h-full rounded-full", getScoreColor(normalized))}
        />
      </div>
    </div>
  );
}
