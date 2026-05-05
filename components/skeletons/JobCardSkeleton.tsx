import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
  return (
    <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-12 rounded-md" />
        </div>
        <Skeleton className="h-2.5 w-full rounded-full" />
      </CardHeader>
      <CardContent className="space-y-3 pb-5">
        <Skeleton className="h-4 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-xl" />
          <Skeleton className="h-6 w-16 rounded-xl" />
          <Skeleton className="h-6 w-16 rounded-xl" />
        </div>
        <Skeleton className="h-4 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-xl" />
          <Skeleton className="h-6 w-16 rounded-xl" />
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}
