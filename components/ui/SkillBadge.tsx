import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SkillBadgeTone = "primary" | "success" | "danger" | "neutral";

type SkillBadgeProps = {
  label: string;
  tone?: SkillBadgeTone;
};

const toneClasses: Record<SkillBadgeTone, string> = {
  primary: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-700/40 dark:bg-blue-500/10 dark:text-blue-300",
  success: "border-green-200 bg-green-50 text-green-700 dark:border-green-700/40 dark:bg-green-500/10 dark:text-green-300",
  danger: "border-red-200 bg-red-50 text-red-700 dark:border-red-700/40 dark:bg-red-500/10 dark:text-red-300",
  neutral: "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200",
};

export function SkillBadge({ label, tone = "primary" }: SkillBadgeProps) {
  return (
    <Badge variant="outline" className={cn("rounded-xl border px-2.5 py-1 text-xs font-medium", toneClasses[tone])}>
      {label}
    </Badge>
  );
}
