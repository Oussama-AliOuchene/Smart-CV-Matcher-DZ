import { ArrowUpRight, Lightbulb, MapPin } from "lucide-react";

import { PageTransition } from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const hiringCompanies = [
  {
    name: "Yassir",
    openRoles: 42,
    badge: "YA",
    tone: "bg-slate-100 text-slate-900 dark:bg-slate-200 dark:text-slate-900",
  },
  {
    name: "Ooredoo",
    openRoles: 18,
    badge: "OR",
    tone: "bg-red-500 text-white",
  },
  {
    name: "Djezzy",
    openRoles: 12,
    badge: "DZ",
    tone: "bg-yellow-400 text-slate-900",
  },
  {
    name: "Ouedkniss",
    openRoles: 25,
    badge: "OK",
    tone: "bg-blue-500 text-white",
  },
];

const salaryBenchmarks = [
  { region: "Algiers Metropole", range: "240k - 450k DZD", width: "92%" },
  { region: "Oran Coastal Hub", range: "180k - 320k DZD", width: "76%" },
  { region: "Constantine Tech Park", range: "160k - 280k DZD", width: "63%" },
  { region: "Ouargla Energy Sector", range: "200k - 380k DZD", width: "84%" },
];

const trendingSkills = [
  "Machine Learning",
  "Docker",
  "Tailwind CSS",
  "Python 3.12",
  "AWS Lambda",
  "Flutter",
  "Solidity",
  "GoLang",
  "Kubernetes",
  "PostgreSQL",
  "Generative AI",
];

export default function MarketTrendsPage() {
  return (
    <PageTransition className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">
          Market Trends <span className="text-primary">2024</span>
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Regional economic shifts and talent density analysis across North Africa. Precision monitoring of
          the Algerian tech ecosystem.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                Sector Growth
              </CardDescription>
              <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">+24.8%</span>
            </div>
            <CardTitle className="text-3xl">Algeria</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">AI &amp; Cloud Skills</p>
            <p className="mt-1 text-sm text-muted-foreground">Growth trajectory vs Regional Average</p>
            <div className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-muted/40 p-3">
              <svg viewBox="0 0 360 120" className="h-24 w-full">
                <path
                  d="M0,98 C40,100 60,72 98,68 C135,64 150,76 188,64 C230,50 248,26 286,22 C316,19 339,31 360,28"
                  fill="none"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              Active Recruitment
            </CardDescription>
            <CardTitle className="text-3xl">Top Hiring Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {hiringCompanies.map((company) => (
                <div key={company.name} className="rounded-xl border border-border/60 bg-muted/35 p-3 text-center">
                  <div className={cn("mx-auto mb-2 flex size-11 items-center justify-center rounded-full text-sm font-bold", company.tone)}>
                    {company.badge}
                  </div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-xs text-muted-foreground">{company.openRoles} Open Roles</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              Compensation Benchmarks
            </CardDescription>
            <CardTitle className="text-3xl">Regional Salary Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {salaryBenchmarks.map((item) => (
              <div key={item.region} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">{item.region}</span>
                  <span className="font-medium">{item.range}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: item.width }} />
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="text-muted-foreground">Last updated: 14 Oct 2024</span>
              <span className="inline-flex items-center gap-1 font-semibold text-primary">
                FULL REPORT <ArrowUpRight className="size-3.5" />
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-3xl">Talent Density Map</CardTitle>
                <CardDescription>Real-time engagement by administrative region</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-lg border border-border/70 bg-muted/60 px-3 py-1.5">All Sectors</span>
                <span className="rounded-lg bg-primary/15 px-3 py-1.5 font-medium text-primary">Engineering</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative h-[280px] overflow-hidden rounded-xl border border-border/60 bg-slate-950">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(59,130,246,.18),transparent_42%),radial-gradient(circle_at_72%_70%,rgba(14,165,233,.14),transparent_40%)]" />
              <div className="absolute inset-8 rotate-[-6deg] rounded-[28px] border border-slate-800 bg-slate-900/70" />
              <div className="absolute left-[45%] top-[42%] size-3 rounded-full bg-cyan-400" />
              <div className="absolute left-[57%] top-[49%] size-2.5 rounded-full bg-cyan-400/85" />
              <div className="absolute left-[52%] top-[36%] rounded-xl border border-cyan-500/35 bg-slate-900/92 px-3 py-2 text-sm shadow-lg">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300">Region: Algiers</p>
                <p className="mt-1 flex items-center gap-2 text-slate-100">
                  <MapPin className="size-4 text-cyan-300" /> Active Engineers
                  <span className="font-semibold">14,204</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl">Trending Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {trendingSkills.map((skill, idx) => (
                <span
                  key={skill}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm",
                    idx % 4 === 0 || skill === "Python 3.12" || skill === "Generative AI"
                      ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700/40 dark:bg-blue-500/10 dark:text-blue-300"
                      : "border-border/70 bg-muted/60 text-muted-foreground"
                  )}
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="rounded-xl border border-cyan-500/35 bg-cyan-500/10 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                <Lightbulb className="size-4" /> Insight
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Demand for DevOps specialists in the North African region has spiked 35% this quarter as more
                startups transition to cloud-native architectures.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageTransition>
  );
}
