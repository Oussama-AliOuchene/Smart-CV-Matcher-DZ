"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, FileUp, SearchCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { PageTransition } from "@/components/layout/PageTransition";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  algerianCompanies,
  landingStats,
  landingSteps,
  landingTestimonials,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1300;
    const step = Math.max(1, Math.floor(value / 30));

    const interval = window.setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        window.clearInterval(interval);
      } else {
        setDisplay(start);
      }
    }, duration / 30);

    return () => window.clearInterval(interval);
  }, [value]);

  return (
    <span className="text-3xl font-bold text-foreground sm:text-4xl">
      {display}
      {suffix}
    </span>
  );
}

const stepIcons = [FileUp, BrainCircuit, SearchCheck];

export default function HomePage() {
  return (
    <PageTransition className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 px-6 py-14 shadow-sm sm:px-10">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 size-80 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 dark:border-blue-700/40 dark:bg-blue-500/10 dark:text-blue-300"
          >
            <Sparkles className="size-3.5" /> AI-Powered Career Matching
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-balance text-4xl font-bold leading-tight text-foreground sm:text-5xl"
          >
            Find Your Dream Job in Algeria&apos;s Tech Ecosystem
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-2xl text-lg text-muted-foreground"
          >
            Upload your CV and get matched with the best opportunities in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <Link href="/upload" className={cn(buttonVariants({ size: "lg" }), "rounded-xl px-6")}> 
              Upload My CV <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>

        <div className="relative z-10 mt-12 grid gap-4 sm:grid-cols-3">
          {landingStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.12 }}
              className="rounded-2xl border border-border/70 bg-background/90 p-5 shadow-sm"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-foreground">How It Works</h2>
          <p className="text-muted-foreground">Three simple steps from CV to interviews.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {landingSteps.map((step, index) => {
            const Icon = stepIcons[index];

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
              >
                <Card className="h-full rounded-xl border-border/70 bg-card/80 shadow-sm">
                  <CardHeader>
                    <div className="mb-2 inline-flex w-fit rounded-xl bg-primary/15 p-2 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-border/70 bg-card/70 px-6 py-10 shadow-sm sm:px-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Algerian Companies in Our Network</h2>
          <p className="text-sm text-muted-foreground">Real ecosystem, real opportunities.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {algerianCompanies.map((company) => (
            <div
              key={company}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/80 px-3 py-3 shadow-sm"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {company.slice(0, 2).toUpperCase()}
              </div>
              <span className="truncate text-sm font-medium">{company}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold text-foreground">Student Success Stories</h2>
          <p className="text-muted-foreground">What ESTIN students say about Smart CV Matcher.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {landingTestimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-full rounded-xl border-border/70 bg-card/80 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>
                    {item.role} · {item.school}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">“{item.quote}”</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
