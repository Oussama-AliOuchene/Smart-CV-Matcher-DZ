"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  FileText,
  LogOut,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { PageTransition } from "@/components/layout/PageTransition";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { HistoryEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProfileUser = {
  id: string;
  fullName: string;
  email: string;
  dreamCompany: string | null;
  targetRole: string | null;
  createdAt: string;
};

type MeResponse = {
  authenticated?: boolean;
  user?: ProfileUser;
};

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function toDayKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function previousDayKey(dayKey: string) {
  const date = new Date(`${dayKey}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setUTCDate(date.getUTCDate() - 1);
  return toDayKey(date.toISOString());
}

function countEntriesInLastDays(entries: HistoryEntry[], days: number) {
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;

  return entries.filter((entry) => {
    const timestamp = new Date(entry.date).getTime();
    return !Number.isNaN(timestamp) && timestamp >= threshold;
  }).length;
}

function countOffersViewed(entries: HistoryEntry[]) {
  return entries.reduce((total, entry) => {
    const count = Array.isArray(entry.result?.matches) ? entry.result.matches.length : 0;
    return total + count;
  }, 0);
}

function getBestMatchScore(entries: HistoryEntry[]) {
  return entries.reduce((max, entry) => {
    const scores = Array.isArray(entry.result?.matches)
      ? entry.result.matches.map((match) => match.score)
      : [];
    const entryMax = scores.length > 0 ? Math.max(...scores) : entry.topMatch?.score ?? 0;
    return Math.max(max, entryMax);
  }, 0);
}

function calculateConsistencyStreak(entries: HistoryEntry[], createdAt?: string) {
  const activityDays = new Set<string>();

  entries.forEach((entry) => {
    const key = toDayKey(entry.date);
    if (key) {
      activityDays.add(key);
    }
  });

  if (createdAt) {
    const accountCreationDay = toDayKey(createdAt);
    if (accountCreationDay) {
      activityDays.add(accountCreationDay);
    }
  }

  if (activityDays.size === 0) {
    return 1;
  }

  const latestDay = Array.from(activityDays).sort().at(-1);
  if (!latestDay) {
    return 1;
  }

  let streak = 0;
  let cursor: string | null = latestDay;

  while (cursor && activityDays.has(cursor)) {
    streak += 1;
    cursor = previousDayKey(cursor);
  }

  return Math.max(1, streak);
}

function buildSkillScore(baseScore: number, index: number, hasSkill: boolean) {
  const offset = hasSkill ? 12 : -18;
  const value = baseScore + offset - index * 6;
  return Math.max(20, Math.min(95, Math.round(value)));
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setError(null);

        const meRes = await fetch("/api/auth/me", { cache: "no-store" });

        if (meRes.status === 401) {
          if (!cancelled) {
            setUser(null);
            setHistory([]);
          }
          return;
        }

        const mePayload = (await meRes.json()) as MeResponse;
        if (!meRes.ok || !mePayload.user) {
          throw new Error("Unable to load your profile.");
        }

        const historyRes = await fetch("/api/history", { cache: "no-store" });
        const historyPayload = historyRes.ok
          ? ((await historyRes.json()) as HistoryEntry[])
          : [];

        if (!cancelled) {
          setUser(mePayload.user);
          setHistory(Array.isArray(historyPayload) ? historyPayload : []);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Unexpected profile error.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const latestResult = history[0]?.result;

  const completionRate = useMemo(() => {
    if (!user) {
      return 0;
    }

    const checkpoints = [
      user.fullName.length > 1,
      user.email.length > 3,
      Boolean(user.targetRole),
      Boolean(user.dreamCompany),
      history.length > 0,
    ];

    const achieved = checkpoints.filter(Boolean).length;
    return Math.round((achieved / checkpoints.length) * 100);
  }, [history.length, user]);

  const cvsAnalyzed = history.length;

  const cvsAnalyzedThisWeek = useMemo(() => {
    return countEntriesInLastDays(history, 7);
  }, [history]);

  const offersViewed = useMemo(() => {
    return countOffersViewed(history);
  }, [history]);

  const bestMatch = useMemo(() => {
    return getBestMatchScore(history);
  }, [history]);

  const activeStreakDays = useMemo(() => {
    return calculateConsistencyStreak(history, user?.createdAt);
  }, [history, user?.createdAt]);

  const skillForge = useMemo(() => {
    if (!latestResult) {
      return [
        { label: "Node.js", score: 40 },
        { label: "React", score: 52 },
        { label: "TypeScript", score: 35 },
        { label: "SQL", score: 45 },
      ];
    }

    const candidateSkills = latestResult.candidate.skills;
    const missingSkills = latestResult.matches[0]?.skills_missing ?? [];

    const pickedSkills = Array.from(
      new Set([...candidateSkills.slice(0, 4), ...missingSkills.slice(0, 2)])
    ).slice(0, 6);

    return pickedSkills.map((skill, index) => ({
      label: skill,
      score: buildSkillScore(latestResult.candidate.score, index, candidateSkills.includes(skill)),
    }));
  }, [latestResult]);

  const currentObjective = user?.targetRole
    ? `${user.targetRole} at ${user.dreamCompany ?? "an Algerian startup"}`
    : "Secure your first strong tech opportunity";

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <PageTransition className="space-y-4">
        <div className="h-40 animate-pulse rounded-3xl bg-muted/50" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-muted/50" />
          ))}
        </div>
      </PageTransition>
    );
  }

  if (!user) {
    return (
      <PageTransition>
        <Card className="mx-auto max-w-xl rounded-2xl border-border/70 bg-card/85 shadow-sm">
          <CardHeader>
            <CardTitle>You need to sign in first</CardTitle>
            <CardDescription>
              Connecte-toi pour voir ton profil, tes analyses et ton historique de progression.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: "default" }), "rounded-xl")}>
              Go to login
            </Link>
            <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
              Back to home
            </Link>
          </CardContent>
        </Card>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-indigo-400/30 bg-slate-950 p-6 text-slate-100 shadow-[0_16px_50px_rgba(2,6,23,0.5)] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(99,102,241,0.25),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.22),transparent_36%)]" />

        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative flex size-20 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-2xl font-semibold text-indigo-200">
              {initialsFromName(user.fullName)}
              <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-yellow-500/50 bg-yellow-400 text-slate-900">
                <Sparkles className="size-4" />
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user.fullName}</h1>
              <p className="text-sm text-slate-300">{user.targetRole ?? "Junior Developer"} · Algeria</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-300">
                  {user.dreamCompany ?? "Open to opportunities"}
                </span>
                <span className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-2.5 py-1 text-indigo-200">
                  {completionRate}% profile alchemized
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <LogOut className="size-4" />
            {isLoggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-2xl border-indigo-500/15 bg-slate-950/95 text-slate-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">CVS ANALYZED</CardDescription>
            <CardTitle className="text-4xl text-cyan-300">{cvsAnalyzed}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400">+{cvsAnalyzedThisWeek} this week</CardContent>
        </Card>

        <Card className="rounded-2xl border-indigo-500/15 bg-slate-950/95 text-slate-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">OFFERS VIEWED</CardDescription>
            <CardTitle className="text-4xl text-indigo-300">{offersViewed}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400">Local opportunities explored</CardContent>
        </Card>

        <Card className="rounded-2xl border-indigo-500/15 bg-slate-950/95 text-slate-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">BEST MATCH</CardDescription>
            <CardTitle className="text-4xl text-yellow-300">{bestMatch}%</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400">Excellent trajectory</CardContent>
        </Card>

        <Card className="rounded-2xl border-indigo-500/15 bg-slate-950/95 text-slate-100">
          <CardHeader className="pb-2">
            <CardDescription className="text-slate-400">DAYS ACTIVE</CardDescription>
            <CardTitle className="text-4xl text-fuchsia-300">{activeStreakDays}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-400">Consistency streak</CardContent>
        </Card>
      </section>

      {error ? (
        <div className="rounded-xl border border-amber-300/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="rounded-2xl border-indigo-500/15 bg-slate-950/95 text-slate-100 lg:col-span-7">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="size-5 text-indigo-300" /> Skill Forge
            </CardTitle>
            <CardDescription className="text-slate-400">
              Snapshot of your strongest and weakest technical areas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillForge.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span className="text-slate-300">{item.score}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-5">
          <Card className="rounded-2xl border-indigo-500/15 bg-slate-950/95 text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="size-5 text-indigo-300" /> Career Odyssey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xl font-semibold">{currentObjective}</p>
              <p className="text-sm text-slate-400">Progress to goal</p>
              <div className="h-2.5 w-full rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">You are building a profile recruiters can trust.</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-indigo-500/15 bg-slate-950/95 text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Clock3 className="size-5 text-indigo-300" /> Analysis Archive
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-slate-400">No analysis yet. Upload your first CV to start.</p>
              ) : (
                history.slice(0, 4).map((entry) => (
                  <div
                    key={`${entry.version}-${entry.date}`}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300">
                        <FileText className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">{entry.filename}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-yellow-300">{entry.score}%</p>
                  </div>
                ))
              )}

              <div className="pt-2">
                <Link href="/history" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                  View detailed history <ArrowRight className="size-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="rounded-2xl border border-indigo-500/15 bg-slate-950/95 p-5 text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold">Ready for your next analysis?</p>
            <p className="text-sm text-slate-400">Upload a new CV version and track your progression over time.</p>
          </div>
          <Link href="/upload" className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-xl")}> 
            <UserRound className="mr-1 size-4" /> New CV Upload
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
