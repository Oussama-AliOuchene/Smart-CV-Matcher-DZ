"use client";

import { PageTransition } from "@/components/layout/PageTransition";
import { CVUploadFlow } from "@/components/upload/CVUploadFlow";

export default function CVAnalysisUploadPage() {
  return (
    <PageTransition>
      <CVUploadFlow className="max-w-none" />
    </PageTransition>
  );
}
