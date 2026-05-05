"use client";

import type { ErrorInfo, ReactNode } from "react";
import React, { Component } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      message: "",
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-700/90 dark:text-red-300/90">
            {this.state.message || "An unexpected error happened while rendering this page."}
          </p>
          <button
            type="button"
            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/upload";
              }
            }}
          >
            Go back to Upload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
