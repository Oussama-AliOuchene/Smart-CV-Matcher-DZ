"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HistoryView } from "@/components/history/HistoryView";

export default function HistoryPage() {
  return (
    <ErrorBoundary>
      <HistoryView title="History" />
    </ErrorBoundary>
  );
}
