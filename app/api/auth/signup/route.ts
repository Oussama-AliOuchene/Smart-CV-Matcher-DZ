import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  createUser,
  getAuthCookieOptions,
  getUserByEmail,
  normalizeEmail,
  toAuthUser,
} from "@/lib/auth";

export const runtime = "nodejs";

type SignupPayload = {
  fullName?: string;
  email?: string;
  password?: string;
  dreamCompany?: string;
  targetRole?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as SignupPayload;

    const fullName = cleanText(payload.fullName);
    const email = normalizeEmail(cleanText(payload.email));
    const password = cleanText(payload.password);
    const dreamCompany = cleanText(payload.dreamCompany);
    const targetRole = cleanText(payload.targetRole);

    if (fullName.length < 2) {
      return NextResponse.json(
        { error: "Full name must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    if (getUserByEmail(email)) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const user = createUser({
      fullName,
      email,
      password,
      dreamCompany,
      targetRole,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unable to create account." },
        { status: 500 }
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
      { error: "Failed to create account", details },
      { status: 500 }
    );
  }
}
