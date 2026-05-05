"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, TrendingUp } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageTransition } from "@/components/layout/PageTransition";
import { HistorySkeleton } from "@/components/skeletons/HistorySkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { HistoryEntry } from "@/lib/types";

type HistoryViewProps = {
  title?: string;
};

function formatDisplayDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildChartPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

export function HistoryView({ title = "History" }: HistoryViewProps) {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((response) => response.json())
      .then((data: HistoryEntry[]) => {
        setHistory(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const uniqueSkills = useMemo(() => {
    const allSkills = history.flatMap((entry) => entry.skills ?? []);
    return Array.from(new Set(allSkills)).sort((a, b) => a.localeCompare(b));
  }, [history]);

  const bestMatch = useMemo(() => {
    return history.reduce((max, entry) => {
      const current = entry.topMatch?.score ?? 0;
      return current > max ? current : max;
    }, 0);
  }, [history]);

  const overallGrowth = useMemo(() => {
    if (history.length < 2) {
      return null;
    }

    const newest = history[0]?.score ?? 0;
    const oldest = history[history.length - 1]?.score ?? 0;
    return newest - oldest;
  }, [history]);

  const chronological = useMemo(() => {
    return [...history].reverse();
  }, [history]);

  const chartPoints = useMemo(() => {
    if (chronological.length === 0) {
      return [] as Array<{ x: number; y: number; score: number; label: string }>;
    }

    const scores = chronological.map((entry) => entry.score);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const range = Math.max(1, max - min);
    const width = 560;

    return chronological.map((entry, index) => {
      const x = 20 + (index * (width - 40)) / Math.max(1, chronological.length - 1);
      const normalized = (entry.score - min) / range;
      const y = 150 - normalized * 92;

      return {
        x,
        y,
        score: entry.score,
        label: entry.version,
      };
    });
  }, [chronological]);

  if (loading) {
    return <HistorySkeleton />;
  }

  if (history.length === 0) {
    return (
      <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>No CV uploaded yet</CardTitle>
          <CardDescription>Start by uploading your first CV to generate analysis history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/upload"
            className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Upload your first CV
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <PageTransition className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">Historical progression of your CV analysis and job matching quality.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardDescription>Overall Growth</CardDescription>
            <CardTitle className="text-3xl">
              {overallGrowth === null ? "-" : `${overallGrowth > 0 ? "+" : ""}${overallGrowth}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Score change from first to latest version.</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardDescription>CVs Analyzed</CardDescription>
            <CardTitle className="text-3xl">{history.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total uploaded versions in timeline.</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardDescription>Skills Detected</CardDescription>
            <CardTitle className="text-3xl">{uniqueSkills.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Unique skills observed across versions.</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardDescription>Best Match</CardDescription>
            <CardTitle className="text-3xl">{bestMatch}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Top score from historical analyses.</p>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>Score Evolution</CardTitle>
          <CardDescription>Generated from real history entries.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <svg viewBox="0 0 600 220" className="h-[240px] min-w-[600px] w-full">
            <g stroke="rgba(148,163,184,0.2)">
              <line x1="20" y1="36" x2="580" y2="36" />
              <line x1="20" y1="74" x2="580" y2="74" />
              <line x1="20" y1="112" x2="580" y2="112" />
              <line x1="20" y1="150" x2="580" y2="150" />
            </g>

            {chartPoints.length > 1 && (
              <path
                d={`${buildChartPath(chartPoints)} L${chartPoints[chartPoints.length - 1]?.x} 190 L${chartPoints[0]?.x} 190 Z`}
                fill="rgba(37,99,235,0.12)"
              />
            )}

            <path
              d={buildChartPath(chartPoints)}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {chartPoints.map((point) => (
              <g key={point.label}>
                <circle cx={point.x} cy={point.y} r="8" fill="rgba(37,99,235,0.2)" />
                <circle cx={point.x} cy={point.y} r="4" fill="#2563eb" />
                <text x={point.x - 12} y="176" fill="#0f172a" className="dark:fill-slate-100" fontSize="14" fontWeight="600">
                  {point.score}
                </text>
                <text x={point.x - 14} y="194" fill="#64748b" fontSize="10">
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>Skill Matrix</CardTitle>
            <CardDescription>Built dynamically from all versions.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border/70 text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  <th className="py-2">Skill</th>
                  {history.map((entry) => (
                    <th key={entry.version} className="py-2 text-center">{entry.version}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uniqueSkills.map((skill) => (
                  <tr key={skill} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-medium">{skill}</td>
                    {history.map((entry) => (
                      <td key={`${entry.version}-${skill}`} className="py-3 text-center">
                        <span
                          className={cn(
                            "inline-block size-2.5 rounded-full",
                            entry.skills.includes(skill) ? "bg-primary" : "bg-muted"
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle>Upload History</CardTitle>
            <CardDescription>Click any entry to reopen results.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.map((entry) => (
              <div key={entry.version} className="rounded-xl border border-border/70 bg-muted/35 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{entry.version}</p>
                    <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                      {formatDisplayDate(entry.date)} · {entry.filename}
                    </p>
                  </div>
                  <span className="rounded-full border border-primary/40 px-2 py-1 text-xs font-semibold text-primary">
                    {entry.score}
                  </span>
                </div>

                {entry.topMatch && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Top match: {entry.topMatch.company} - {entry.topMatch.role} ({entry.topMatch.score}%)
                  </p>
                )}

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      (entry.delta ?? 0) >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    <TrendingUp className="size-3.5" />
                    {entry.delta === null ? "No previous" : `${entry.delta > 0 ? "+" : ""}${entry.delta} pts`}
                  </span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-semibold text-primary"
                    onClick={() => {
                      sessionStorage.setItem("cv_result", JSON.stringify(entry.result));
                      router.push("/results");
                    }}
                  >
                    View Results <ArrowUpRight className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Targets</CardTitle>
          <CardDescription>Skills expected by your latest top match.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {(history[0]?.result.roadmap ?? []).map((item) => (
            <div key={item.skill} className="rounded-xl border border-border/70 bg-muted/40 p-3">
              <p className="font-medium">{item.skill}</p>
              <p className="text-xs text-muted-foreground">
                Priority: {item.priority} · Companies: {item.companies}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock3 className="size-3.5" /> {item.time}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageTransition>
  );
}
