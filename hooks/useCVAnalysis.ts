"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { notify } from "@/lib/toast";
import type { AnalysisStatus, CVResult } from "@/lib/types";

type AnalyzeCVInput = {
  file: File;
  fullName: string;
  dreamCompany: string;
  targetRole: string;
};

type UseCVAnalysisReturn = {
  analyzeCV: (input: AnalyzeCVInput) => Promise<void>;
  status: AnalysisStatus;
  progress: number;
  result: CVResult | null;
  error: string | null;
  reset: () => void;
};

export function useCVAnalysis(): UseCVAnalysisReturn {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CVResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timeoutsRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current = [];
  }, []);

  const saveHistory = useCallback(async (filename: string, analysisResult: CVResult) => {
    try {
      await fetch("/api/history/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          result: analysisResult,
        }),
      });
    } catch (err: unknown) {
      console.error("[history/save]", err);
    }
  }, []);

  const analyzeCV = useCallback(
    async ({ file, fullName, dreamCompany, targetRole }: AnalyzeCVInput) => {
      clearTimeouts();
      setError(null);
      setResult(null);
      setStatus("uploading");
      setProgress(10);

      const extractingTimeout = setTimeout(() => {
        setStatus("extracting");
        setProgress(35);
      }, 1500);

      const analyzingTimeout = setTimeout(() => {
        setStatus("analyzing");
        setProgress(60);
      }, 4000);

      const matchingTimeout = setTimeout(() => {
        setStatus("matching");
        setProgress(85);
      }, 8000);

      timeoutsRef.current.push(extractingTimeout, analyzingTimeout, matchingTimeout);

      try {
        const formData = new FormData();
        formData.append("cv", file);
        formData.append("fullName", fullName.trim());
        formData.append("dreamCompany", dreamCompany.trim());
        formData.append("targetRole", targetRole.trim());

        const response = await fetch("/api/analyze-cv", {
          method: "POST",
          body: formData,
        });

        const payload = (await response.json()) as CVResult & {
          error?: string;
          details?: string;
        };

        if (!response.ok || payload.success === false) {
          const apiMessage = payload.error ?? "Analysis failed";
          const apiDetails = payload.details?.trim();
          throw new Error(apiDetails ? `${apiMessage} ${apiDetails}` : apiMessage);
        }

        setResult(payload);
        setProgress(100);
        setStatus("done");

        notify.uploadSuccess();
        notify.analysisDone(payload.candidate.name);

        await saveHistory(file.name, payload);
      } catch (err: unknown) {
        clearTimeouts();

        const message = err instanceof Error ? err.message : "Unexpected error during analysis";

        setStatus("error");
        setError(message);
        notify.error(message);
      }
    },
    [clearTimeouts, saveHistory]
  );

  const reset = useCallback(() => {
    clearTimeouts();
    setStatus("idle");
    setProgress(0);
    setResult(null);
    setError(null);
  }, [clearTimeouts]);

  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  return { analyzeCV, status, progress, result, error, reset };
}
