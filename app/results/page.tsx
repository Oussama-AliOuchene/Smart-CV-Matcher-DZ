"use client";

import { jsPDF } from "jspdf";
import Link from "next/link";
import { Download, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageTransition } from "@/components/layout/PageTransition";
import { CVCardSkeleton } from "@/components/skeletons/CVCardSkeleton";
import { JobCardSkeleton } from "@/components/skeletons/JobCardSkeleton";
import { CircularScore } from "@/components/ui/CircularScore";
import { JobCard } from "@/components/ui/JobCard";
import { SkillRadarChart } from "@/components/ui/RadarChart";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CVResult } from "@/lib/types";
import { cn } from "@/lib/utils";

function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <CVCardSkeleton />
        </div>

        <div className="space-y-4 lg:col-span-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <JobCardSkeleton key={idx} />
          ))}
        </div>
      </div>

      <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <div className="h-72 w-full animate-pulse rounded-xl bg-muted/60" />
          <div className="h-72 w-full animate-pulse rounded-xl bg-muted/60" />
        </CardContent>
      </Card>
    </div>
  );
}

function buildRadarData(result: CVResult) {
  const topMatch = result.matches[0];
  const candidateSkills = result.candidate.skills;

  const focusSkills = Array.from(
    new Set([
      ...candidateSkills.slice(0, 4),
      ...(topMatch?.skills_missing ?? []).slice(0, 2),
    ])
  );

  return focusSkills.map((skill) => ({
    skill,
    candidate: candidateSkills.includes(skill) ? 82 : 35,
    ideal: topMatch?.skills_missing.includes(skill) ? 92 : 78,
  }));
}

function getPriorityClasses(priority: string) {
  if (priority === "High") {
    return "border-red-400/40 bg-red-500/10 text-red-600 dark:text-red-300";
  }

  if (priority === "Medium") {
    return "border-amber-400/40 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }

  return "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
}

function ResultsContent() {
  const [analysis, setAnalysis] = useState<CVResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cv_result");

      if (!raw) {
        setAnalysis(null);
        setIsLoading(false);
        return;
      }

      const parsed = JSON.parse(raw) as CVResult;
      if (!parsed?.candidate || !Array.isArray(parsed?.matches)) {
        setAnalysis(null);
        setIsLoading(false);
        return;
      }

      setAnalysis(parsed);
      setIsLoading(false);
    } catch {
      setAnalysis(null);
      setIsLoading(false);
    }
  }, []);

  const sortedMatches = useMemo(() => {
    if (!analysis) {
      return [];
    }

    return [...analysis.matches].sort((a, b) => b.score - a.score);
  }, [analysis]);

  const radarData = useMemo(() => {
    if (!analysis) {
      return [];
    }

    return buildRadarData(analysis);
  }, [analysis]);

  if (isLoading) {
    return <ResultsSkeleton />;
  }

  if (!analysis) {
    return (
      <Card className="mx-auto max-w-2xl rounded-xl border-border/70 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>No analysis found</CardTitle>
          <CardDescription>
            Upload and analyze a CV first to generate your personalized result.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/upload"
            className={cn(buttonVariants({ variant: "default" }), "rounded-xl")}
          >
            Go To Upload
          </Link>
        </CardContent>
      </Card>
    );
  }

  const topMatch = sortedMatches[0];

  function handleDownloadReport() {
    const currentAnalysis = analysis;
    if (!currentAnalysis) {
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Smart CV Match Report", 16, 20);
    doc.setFontSize(12);
    doc.text(`Candidate: ${currentAnalysis.candidate.name}`, 16, 32);
    doc.text(
      `Level: ${currentAnalysis.candidate.level} | Experience: ${currentAnalysis.candidate.experience_years} year(s)`,
      16,
      40
    );
    doc.text(`Education: ${currentAnalysis.candidate.education}`, 16, 48);
    doc.text(`Employability Score: ${currentAnalysis.candidate.score}/100`, 16, 56);

    doc.text("Top Job Matches:", 16, 70);
    sortedMatches.slice(0, 5).forEach((job, index) => {
      doc.text(`${index + 1}. ${job.title} - ${job.company} (${job.score}%)`, 18, 80 + index * 8);
    });

    doc.text("Recommended Learning Roadmap:", 16, 130);
    currentAnalysis.roadmap.slice(0, 5).forEach((item, index) => {
      doc.text(`- ${item.skill}: ${item.time}`, 18, 140 + index * 8);
    });

    doc.save("smart-cv-report.pdf");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">CV Analysis Results</h1>
          <p className="text-muted-foreground">Real-time output from your n8n analysis pipeline.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
          <Sparkles className="size-4" /> Analysis completed
        </span>
      </div>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm lg:col-span-4">
          <CardHeader>
            <CardTitle>{analysis.candidate.name}</CardTitle>
            <CardDescription>
              {analysis.candidate.level} • {analysis.candidate.experience_years} year(s) of experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CircularScore score={analysis.candidate.score} />

            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">Skills</p>
              <div className="flex flex-wrap gap-2">
                {analysis.candidate.skills.map((skill) => (
                  <SkillBadge key={skill} label={skill} tone="primary" />
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-muted/60 p-4 text-sm">
              <p className="font-semibold">Education</p>
              <p className="mt-1 text-muted-foreground">{analysis.candidate.education}</p>
            </div>

            <div className="rounded-xl bg-muted/60 p-4 text-sm">
              <p className="font-semibold">Summary</p>
              <p className="mt-1 text-muted-foreground">{analysis.candidate.summary}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-8">
          {sortedMatches.map((job, index) => (
            <JobCard key={job.id} job={job} delayIndex={index} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm lg:col-span-7">
          <CardHeader>
            <CardTitle>Candidate vs Ideal Profile</CardTitle>
            <CardDescription>
              Comparison generated from your current top match: {topMatch?.company ?? "N/A"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkillRadarChart data={radarData} />
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm lg:col-span-5">
          <CardHeader>
            <CardTitle>Skills Roadmap</CardTitle>
            <CardDescription>Priority skills inferred from real n8n recommendations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.roadmap.map((item) => (
              <div
                key={item.skill}
                className="rounded-xl border border-border/60 bg-muted/60 px-3 py-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{item.skill}</p>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                      getPriorityClasses(item.priority)
                    )}
                  >
                    {item.priority}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Estimated time: {item.time} · Target companies: {item.companies}
                </p>
                <a
                  href={item.resource}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex text-xs font-semibold text-primary"
                >
                  Learning resource
                </a>
              </div>
            ))}

            <div className="grid gap-3 pt-3 sm:grid-cols-3">
              <button
                type="button"
                className={cn(buttonVariants({ variant: "default" }), "w-full rounded-xl")}
                onClick={handleDownloadReport}
              >
                <Download className="mr-2 size-4" /> Report
              </button>
              <Link
                href="/upload"
                className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl")}
              >
                <RotateCcw className="mr-2 size-4" /> New CV
              </Link>
              <Link
                href="/history"
                className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl")}
              >
                View History
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <ErrorBoundary>
      <PageTransition>
        <ResultsContent />
      </PageTransition>
    </ErrorBoundary>
  );
}
