import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUserFromRequest } from "@/lib/auth";
import { saveHistoryForUser } from "@/lib/history-store";
import type { CVResult, HistoryEntry } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = getAuthenticatedUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { filename, result }: { filename: string; result: CVResult } = await request.json();

    if (!filename || typeof filename !== "string") {
      return NextResponse.json(
        { error: "filename is required." },
        { status: 400 }
      );
    }

    if (!result || typeof result !== "object" || !result.candidate) {
      return NextResponse.json(
        { error: "result is required." },
        { status: 400 }
      );
    }

    const entry: HistoryEntry = saveHistoryForUser({
      userId: user.id,
      filename: filename.trim(),
      result,
    });

    return NextResponse.json({ success: true, entry });
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: details }, { status: 500 });
  }
}
