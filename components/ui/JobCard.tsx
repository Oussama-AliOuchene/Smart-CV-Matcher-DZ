"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { SkillBadge } from "@/components/ui/SkillBadge";
import type { JobMatch } from "@/lib/types";

type JobCardProps = {
  job: JobMatch;
  delayIndex?: number;
};

function getCompanyInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getLogoColor(score: number) {
  if (score >= 75) {
    return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300";
  }

  if (score >= 50) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300";
  }

  return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300";
}

export function JobCard({ job, delayIndex = 0 }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: delayIndex * 0.15 }}
    >
      <Card className="rounded-xl border-border/80 bg-card/80 shadow-sm">
        <CardHeader className="space-y-3 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-11 items-center justify-center rounded-full text-sm font-bold ${getLogoColor(
                  job.score
                )}`}
              >
                {getCompanyInitials(job.company)}
              </div>
              <div>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <div className="hidden rounded-xl bg-muted px-3 py-1 text-sm font-semibold text-foreground sm:block">
              {job.score}%
            </div>
          </div>
          <ScoreBar score={job.score} />
        </CardHeader>

        <CardContent className="space-y-4 pb-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills you have</p>
            <div className="flex flex-wrap gap-2">
              {job.skills_match.map((skill) => (
                <SkillBadge key={`${job.id}-${skill}`} label={skill} tone="success" />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skills you are missing</p>
            <div className="flex flex-wrap gap-2">
              {job.skills_missing.map((skill) => (
                <SkillBadge key={`${job.id}-missing-${skill}`} label={skill} tone="danger" />
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-muted/70 p-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2 font-medium text-foreground">
              <BriefcaseBusiness className="size-4 text-primary" /> AI Insight
            </p>
            <p className="mt-1">{job.comment}</p>
          </div>

          <Button type="button" className="w-full rounded-xl">
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
