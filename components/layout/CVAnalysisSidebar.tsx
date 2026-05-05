"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Lightbulb, Sparkles, TrendingUp, Upload, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "My Profile", href: "/cv-analysis/my-profile", icon: UserRound },
  { label: "History", href: "/cv-analysis/match-history", icon: TrendingUp },
  { label: "Upload", href: "/cv-analysis/upload", icon: Upload },
  { label: "Skill Map", href: "/cv-analysis/skill-map", icon: Sparkles },
  { label: "Algerian Market", href: "/cv-analysis/algerian-market", icon: Compass },
  { label: "Expert Advice", href: "/cv-analysis/expert-advice", icon: Lightbulb },
];

export function CVAnalysisSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-2xl border border-border/70 bg-slate-950/95 p-4 text-slate-200 shadow-sm lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
      <p className="mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Analysis Menu</p>
      <nav className="space-y-1.5">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-base transition-colors",
                isActive
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
