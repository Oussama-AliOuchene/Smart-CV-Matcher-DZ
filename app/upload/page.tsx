"use client";

import { PageTransition } from "@/components/layout/PageTransition";
import { CVUploadFlow } from "@/components/upload/CVUploadFlow";

export default function UploadPage() {
  return (
    <PageTransition>
      <CVUploadFlow />
    </PageTransition>
  );
}
