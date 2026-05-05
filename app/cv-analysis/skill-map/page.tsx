import {
  Boxes,
  CheckCircle2,
  CirclePlus,
  Code2,
  GraduationCap,
  Monitor,
  ShieldAlert,
  Star,
} from "lucide-react";

import { PageTransition } from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const gapTargets = [
  { label: "Advanced Python", duration: "2 Weeks", progress: 76, icon: Code2, tone: "cyan" },
  { label: "Docker Orchestration", duration: "5 Weeks", progress: 53, icon: Boxes, tone: "violet" },
  {
    label: "React Server Components",
    duration: "3 Weeks",
    progress: 67,
    icon: Monitor,
    tone: "blue",
  },
  {
    label: "Cybersecurity Audit",
    duration: "1 Month",
    progress: 18,
    icon: ShieldAlert,
    tone: "red",
  },
];

const pathSteps = [
  { role: "Junior Dev", status: "Completed", icon: CheckCircle2, state: "done" },
  { role: "Mid-Level", status: "Completed", icon: CheckCircle2, state: "done" },
  { role: "Senior Dev", status: "In Progress (45%)", icon: GraduationCap, state: "active" },
  { role: "Lead / Architect", status: "Q4 2025", icon: Star, state: "todo" },
  { role: "CTO Track", status: "Target 2027", icon: CirclePlus, state: "todo" },
] as const;

export default function SkillMapPage() {
  return (
    <PageTransition className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold">Skill Map</h1>
        <p className="text-muted-foreground">Compare your profile with market targets and follow the learning path.</p>
      </section>

      <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
        <CardHeader className="rounded-t-xl bg-slate-950 text-slate-100">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-3xl text-slate-100">Career Trajectory</CardTitle>
              <CardDescription className="text-slate-400">System update: 12 minutes ago</CardDescription>
            </div>
            <span className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              Live Market Data
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 rounded-b-xl bg-slate-950 pb-5 pt-5 text-slate-200">
          <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-100">Skill Map Comparison</h3>
                  <p className="text-sm text-slate-400">
                    Real-time delta between current proficiency and industry benchmarks.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-sky-400" /> Current
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-400" /> Market
                  </span>
                </div>
              </div>

              <div className="relative mx-auto mt-3 h-[290px] max-w-[420px]">
                <svg viewBox="0 0 380 300" className="h-full w-full">
                  <polygon
                    points="190,40 305,102 305,220 190,282 75,220 75,102"
                    fill="none"
                    stroke="rgba(148,163,184,0.22)"
                    strokeWidth="1.4"
                  />
                  <polygon
                    points="190,78 270,124 270,198 190,242 110,198 110,124"
                    fill="none"
                    stroke="rgba(148,163,184,0.18)"
                    strokeWidth="1.2"
                  />
                  <polygon
                    points="190,116 236,143 236,179 190,206 144,179 144,143"
                    fill="none"
                    stroke="rgba(148,163,184,0.14)"
                    strokeWidth="1"
                  />

                  <polygon
                    points="190,40 305,102 305,220 190,282 75,220 75,102"
                    fill="rgba(16,185,129,0.14)"
                    stroke="rgba(52,211,153,0.9)"
                    strokeWidth="3"
                  />
                  <polygon
                    points="190,92 248,126 242,186 190,220 132,186 128,132"
                    fill="rgba(56,189,248,0.22)"
                    stroke="rgba(56,189,248,0.96)"
                    strokeWidth="3"
                  />
                </svg>

                <span className="absolute left-[10px] top-[138px] -rotate-90 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Leadership
                </span>
                <span className="absolute left-[163px] top-[8px] text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  C
                </span>
                <span className="absolute right-[10px] top-[138px] rotate-90 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Fullstack
                </span>
                <span className="absolute bottom-[8px] left-[168px] text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  S
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <h3 className="text-2xl font-semibold text-slate-100">Skill Gap Analysis</h3>
              <p className="mb-4 text-sm text-slate-400">Priority acquisition targets for Senior rank.</p>

              <div className="space-y-3">
                {gapTargets.map((target) => {
                  const Icon = target.icon;
                  const toneClasses =
                    target.tone === "cyan"
                      ? { badge: "bg-cyan-500/20 text-cyan-200", bar: "bg-cyan-400" }
                      : target.tone === "violet"
                        ? { badge: "bg-violet-500/20 text-violet-200", bar: "bg-violet-400" }
                        : target.tone === "blue"
                          ? { badge: "bg-blue-500/20 text-blue-200", bar: "bg-blue-400" }
                          : { badge: "bg-red-500/20 text-red-200", bar: "bg-red-400" };

                  return (
                    <div key={target.label} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="rounded-lg bg-slate-800 p-2 text-slate-300">
                            <Icon className="size-4" />
                          </span>
                          <p className="text-sm font-medium text-slate-100">{target.label}</p>
                        </div>
                        <span className={cn("rounded-full px-2 py-1 text-[11px] font-semibold uppercase", toneClasses.badge)}>
                          {target.duration}
                        </span>
                      </div>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
                        <div
                          className={cn("h-full rounded-full", toneClasses.bar)}
                          style={{ width: `${target.progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-200 transition-colors hover:bg-slate-700"
              >
                View Detailed Gap Report
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/45 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold text-slate-100">Dynamic Learning Path</h3>
                <p className="text-sm text-slate-400">AI-calculated roadmap based on your current velocity.</p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Est. Completion: Oct 2025 <span className="ml-2 text-cyan-300">92% Match</span>
              </p>
            </div>

            <div className="mt-6 overflow-x-auto pb-2">
              <div className="relative min-w-[760px]">
                <div className="absolute left-[52px] right-[52px] top-[44px] h-0.5 bg-slate-700" />

                <div className="relative flex items-start justify-between">
                  {pathSteps.map((step) => {
                    const Icon = step.icon;

                    return (
                      <div key={step.role} className="z-10 flex w-[140px] flex-col items-center text-center">
                        {step.state === "active" ? (
                          <span className="mb-2 rounded-md bg-cyan-500/25 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-200">
                            You Are Here
                          </span>
                        ) : (
                          <span className="mb-2 h-6" />
                        )}

                        <span
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full border",
                            step.state === "done"
                              ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                              : step.state === "active"
                                ? "border-cyan-300 bg-cyan-400/30 text-cyan-100 shadow-[0_0_0_5px_rgba(34,211,238,0.12)]"
                                : "border-slate-700 bg-slate-900 text-slate-500"
                          )}
                        >
                          <Icon className="size-4" />
                        </span>

                        <p className="mt-3 text-sm font-medium text-slate-100">{step.role}</p>
                        <p
                          className={cn(
                            "text-xs",
                            step.state === "active"
                              ? "text-cyan-300"
                              : step.state === "done"
                                ? "text-cyan-200"
                                : "text-slate-500"
                          )}
                        >
                          {step.status}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
