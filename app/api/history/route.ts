import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedUserFromRequest } from "@/lib/auth";
import { deleteHistoryForUser, getHistoryForUser } from "@/lib/history-store";
import type { HistoryEntry } from "@/lib/types";

export const runtime = "nodejs";

function parsePositiveInt(value: string | null, fallback: number, max: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }

  return Math.min(Math.trunc(parsed), max);
}

function parseDate(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

function matchesSearch(entry: HistoryEntry, search: string) {
  if (!search) {
    return true;
  }

  const tokens = [
    entry.filename,
    entry.level,
    ...(entry.skills ?? []),
    entry.topMatch?.company ?? "",
    entry.topMatch?.role ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return tokens.includes(search);
}

export async function GET(request: NextRequest) {
  try {
    const user = getAuthenticatedUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const offset = parsePositiveInt(searchParams.get("offset"), 0, 10000);
    const limit = parsePositiveInt(searchParams.get("limit"), 50, 200);
    const from = parseDate(searchParams.get("from"));
    const to = parseDate(searchParams.get("to"));
    const search = (searchParams.get("search") ?? "").trim().toLowerCase();
    const withMeta = searchParams.get("meta") === "1";

    const fullHistory = getHistoryForUser(user.id);

    const filtered = fullHistory.filter((entry) => {
      const timestamp = new Date(entry.date).getTime();

      if (from !== null && !Number.isNaN(timestamp) && timestamp < from) {
        return false;
      }

      if (to !== null && !Number.isNaN(timestamp) && timestamp > to) {
        return false;
      }

      return matchesSearch(entry, search);
    });

    const paginated = filtered.slice(offset, offset + limit);

    if (withMeta) {
      return NextResponse.json({
        items: paginated,
        total: filtered.length,
        offset,
        limit,
      });
    }

    return NextResponse.json(paginated);
  } catch {
    return NextResponse.json([]);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getAuthenticatedUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const version = searchParams.get("version")?.trim() || undefined;

    const deleted = deleteHistoryForUser(user.id, version);

    return NextResponse.json({
      success: true,
      deleted,
      scope: version ? `version:${version}` : "all",
    });
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to delete history", details },
      { status: 500 }
    );
  }
}
