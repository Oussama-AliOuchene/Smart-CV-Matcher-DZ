import { Skeleton } from "@/components/ui/skeleton";

export function HistorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border border-border/70 bg-card/80 p-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-3 h-7 w-16" />
            <Skeleton className="mt-2 h-3 w-40" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/70 bg-card/80 p-4">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="mt-4 h-56 w-full rounded-xl" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="rounded-xl border border-border/70 bg-card/80 p-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-2 h-3 w-56" />
            <Skeleton className="mt-3 h-14 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
