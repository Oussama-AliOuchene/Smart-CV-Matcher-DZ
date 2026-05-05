import { CVAnalysisSidebar } from "@/components/layout/CVAnalysisSidebar";

export default function CVAnalysisLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <CVAnalysisSidebar />
      <div>{children}</div>
    </section>
  );
}
