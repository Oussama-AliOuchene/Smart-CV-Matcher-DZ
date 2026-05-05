import { PageTransition } from "@/components/layout/PageTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const advice = [
  "Build one FastAPI + Docker project and deploy it publicly.",
  "Add TypeScript to your React projects to unlock frontend roles.",
  "Learn Redis basics for backend interview readiness.",
];

export default function ExpertAdvicePage() {
  return (
    <PageTransition className="space-y-5">
      <section>
        <h1 className="text-3xl font-bold">Expert Advice</h1>
        <p className="text-muted-foreground">Practical recommendations to increase your match score.</p>
      </section>

      <Card className="rounded-xl border-border/70 bg-card/80 shadow-sm">
        <CardHeader>
          <CardTitle>Personalized Next Steps</CardTitle>
          <CardDescription>Action plan tailored for your profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {advice.map((item, index) => (
            <p key={item}>{index + 1}. {item}</p>
          ))}
        </CardContent>
      </Card>
    </PageTransition>
  );
}
