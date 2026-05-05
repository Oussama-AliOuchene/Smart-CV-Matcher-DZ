import { CheckCircle2, Gem } from "lucide-react";

import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  "Unlimited CV analyses",
  "Priority AI matching",
  "Advanced skills roadmap",
  "Direct recruiter visibility",
];

export default function PremiumPage() {
  return (
    <PageTransition className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Premium</h1>
        <p className="text-muted-foreground">Unlock faster growth with advanced career intelligence.</p>
      </section>

      <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
        <CardHeader>
          <div className="mb-2 inline-flex w-fit rounded-xl bg-blue-100 p-2 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
            <Gem className="size-5" />
          </div>
          <CardTitle className="text-2xl">Luminous Premium</CardTitle>
          <CardDescription>Designed for students targeting top Algerian tech companies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-4xl font-bold">2,490 DA / quarter</p>

          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 rounded-xl bg-muted/60 p-3 text-sm">
                <CheckCircle2 className="size-4 text-green-600" />
                {feature}
              </div>
            ))}
          </div>

          <Button type="button" className="rounded-xl">Upgrade to Premium</Button>
        </CardContent>
      </Card>
    </PageTransition>
  );
}
