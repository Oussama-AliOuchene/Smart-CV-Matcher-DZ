import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_COOKIE_NAME,
  getClearedAuthCookieOptions,
  getUserById,
  normalizeEmail,
  toAuthUser,
  verifySessionToken,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = verifySessionToken(token);
  if (!session) {
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.set(AUTH_COOKIE_NAME, "", getClearedAuthCookieOptions());
    return response;
  }

  const user = getUserById(session.sub);
  if (!user || normalizeEmail(user.email) !== normalizeEmail(session.email)) {
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.set(AUTH_COOKIE_NAME, "", getClearedAuthCookieOptions());
    return response;
  }

  return NextResponse.json({
    authenticated: true,
    user: toAuthUser(user),
  });
}
