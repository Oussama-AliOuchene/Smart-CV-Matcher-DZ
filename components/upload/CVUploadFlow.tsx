"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useCVAnalysis } from "@/hooks/useCVAnalysis";
import { notify } from "@/lib/toast";
import type { AnalysisStatus, CVResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STEPS: Array<{ key: AnalysisStatus; emoji: string; label: string }> = [
  { key: "uploading", emoji: "📤", label: "Uploading your CV" },
  { key: "extracting", emoji: "🔍", label: "Extracting text with OCR" },
  { key: "analyzing", emoji: "🤖", label: "AI analyzing your profile" },
  { key: "matching", emoji: "🎯", label: "Matching with job offers" },
];

function formatFileSize(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
}

function getCurrentStepIndex(status: AnalysisStatus) {
  const order: AnalysisStatus[] = ["uploading", "extracting", "analyzing", "matching"];

  if (status === "done") {
    return order.length;
  }

  const index = order.indexOf(status);
  return index;
}

function getStepIndicator(stepIndex: number, currentIndex: number, status: AnalysisStatus) {
  if (status === "done") {
    return "✅ done";
  }

  if (currentIndex === -1) {
    return "⭕ waiting";
  }

  if (stepIndex < currentIndex) {
    return "✅ done";
  }

  if (stepIndex === currentIndex) {
    return "⏳ current";
  }

  return "⭕ waiting";
}

type CVUploadFlowProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function CVUploadFlow({
  title = "Upload Your CV",
  description = "Upload your PDF and get real AI matching from n8n pipeline.",
  className,
}: CVUploadFlowProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [dreamCompany, setDreamCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const { analyzeCV, status, progress, result, error, reset } = useCVAnalysis();

  const isProcessing = ["uploading", "extracting", "analyzing", "matching"].includes(status);
  const currentStepIndex = getCurrentStepIndex(status);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        notify.error("Only PDF files up to 10MB are allowed.");
        return;
      }

      const uploaded = acceptedFiles[0];
      if (!uploaded) {
        return;
      }

      setFile(uploaded);
      reset();
    },
  });

  const hasRequiredFields = useMemo(() => {
    return fullName.trim().length > 0 && dreamCompany.trim().length > 0 && targetRole.trim().length > 0;
  }, [dreamCompany, fullName, targetRole]);

  const canAnalyze = useMemo(
    () => Boolean(file) && hasRequiredFields && !isProcessing,
    [file, hasRequiredFields, isProcessing]
  );

  const handleAnalyze = useCallback(async () => {
    if (!file) {
      notify.error("Please select a PDF first.");
      return;
    }

    const normalizedFullName = fullName.trim();
    const normalizedDreamCompany = dreamCompany.trim();
    const normalizedTargetRole = targetRole.trim();

    if (!normalizedFullName || !normalizedDreamCompany || !normalizedTargetRole) {
      notify.error("Please fill full name, dream company, and target role.");
      return;
    }

    await analyzeCV({
      file,
      fullName: normalizedFullName,
      dreamCompany: normalizedDreamCompany,
      targetRole: normalizedTargetRole,
    });
  }, [analyzeCV, dreamCompany, file, fullName, targetRole]);

  useEffect(() => {
    if (status === "done" && result) {
      const typedResult = result as CVResult;
      sessionStorage.setItem("cv_result", JSON.stringify(typedResult));
      router.push("/results");
    }
  }, [status, result, router]);

  useEffect(() => {
    if (status === "error" && error) {
      notify.error(error);
    }
  }, [status, error]);

  return (
    <section className={cn("mx-auto w-full max-w-3xl", className)}>
      <Card className="rounded-3xl border-border/70 bg-card/80 shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your full name"
                required
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none ring-offset-background transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="dreamCompany" className="text-sm font-medium">
                Dream Company *
              </label>
              <input
                id="dreamCompany"
                type="text"
                value={dreamCompany}
                onChange={(event) => setDreamCompany(event.target.value)}
                placeholder="Example: Google"
                required
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none ring-offset-background transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="targetRole" className="text-sm font-medium">
                Target Role *
              </label>
              <input
                id="targetRole"
                type="text"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="Example: Backend Developer"
                required
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none ring-offset-background transition placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.01 }}>
            <div
              className={cn(
                "cursor-pointer rounded-2xl border-2 border-dashed border-primary/45 bg-primary/5 p-8 text-center transition",
                isDragActive && "animate-pulse border-primary bg-primary/10"
              )}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <UploadCloud className="size-7" />
              </div>
              {isDragActive ? (
                <p className="text-base font-medium text-primary">Drop your PDF here...</p>
              ) : (
                <>
                  <p className="text-base font-semibold">Drop your PDF CV here</p>
                  <p className="mt-1 text-sm text-muted-foreground">or click to browse files (max 10MB)</p>
                </>
              )}
            </div>
          </motion.div>

          {file && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/50 p-4"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-primary/10 p-2 text-primary">
                  <FileText className="size-5" />
                </span>
                <div>
                  <p className="max-w-[200px] truncate text-sm font-medium sm:max-w-xs">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              </div>

              <button
                type="button"
                className="rounded-lg border border-border/70 p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                onClick={() => {
                  setFile(null);
                  reset();
                }}
                aria-label="Remove selected file"
              >
                <X className="size-4" />
              </button>
            </motion.div>
          )}

          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4 rounded-xl border border-border/60 bg-background/80 p-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Analysis in progress</span>
                  <span className="font-semibold">{progress}%</span>
                </div>

                <div className="h-2.5 w-full rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <div className="space-y-2">
                  {STEPS.map((step, index) => (
                    <div key={step.key} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                      <span>
                        {step.emoji} {step.label}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {getStepIndicator(index, currentStepIndex, status)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {status === "error" && error && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
              <p className="font-medium">Analysis failed</p>
              <p className="mt-1">{error}</p>
              <Button
                type="button"
                size="sm"
                className="mt-3 rounded-lg"
                onClick={() => {
                  if (file) {
                    void handleAnalyze();
                  } else {
                    reset();
                  }
                }}
              >
                Retry
              </Button>
            </div>
          )}

          <Button
            type="button"
            size="lg"
            className="w-full rounded-xl"
            disabled={!canAnalyze}
            onClick={() => {
              void handleAnalyze();
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Processing...
              </>
            ) : (
              "Analyze My CV"
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
