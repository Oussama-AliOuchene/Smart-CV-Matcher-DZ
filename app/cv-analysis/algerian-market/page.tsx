import { PageTransition } from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const marketKpis = [
  { label: "Top Skill", value: "Python" },
  { label: "Avg Salary", value: "86k DA" },
  { label: "Open Offers", value: "1247" },
];

export default function AlgerianMarketPage() {
  return (
    <PageTransition className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold">Algerian Market</h1>
        <p className="text-muted-foreground">Demand trends from active tech opportunities in Algeria.</p>
      </section>

      <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>Market Snapshot</CardTitle>
          <CardDescription>Updated indicators from current job demand.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {marketKpis.map((item) => (
            <div key={item.label} className="rounded-xl bg-muted/50 p-3 text-sm">
              <p className="text-muted-foreground">{item.label}</p>
              <p className="text-xl font-semibold">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageTransition>
  );
}
