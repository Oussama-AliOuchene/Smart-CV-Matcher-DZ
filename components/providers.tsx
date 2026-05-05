"use client";

import * as React from "react";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "0.75rem",
            border: "1px solid #dbeafe",
            background: "#eff6ff",
            color: "#1e3a8a",
          },
        }}
      />
    </ThemeProvider>
  );
}
