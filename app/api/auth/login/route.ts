import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  authenticateUser,
  createSessionToken,
  getAuthCookieOptions,
  normalizeEmail,
  toAuthUser,
} from "@/lib/auth";

export const runtime = "nodejs";

type LoginPayload = {
  email?: string;
  password?: string;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as LoginPayload;

    const email = normalizeEmail(cleanText(payload.email));
    const password = cleanText(payload.password);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: toAuthUser(user),
    });

    response.cookies.set(
      AUTH_COOKIE_NAME,
      createSessionToken(user),
      getAuthCookieOptions()
    );

    return response;
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to login", details },
      { status: 500 }
    );
  }
}
