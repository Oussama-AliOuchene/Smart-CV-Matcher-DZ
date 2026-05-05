import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { NextRequest } from "next/server";

const USERS_FILE = join(process.cwd(), ".users.json");
const SESSION_SECRET = process.env.AUTH_SESSION_SECRET ?? "change-me-in-production";

export const AUTH_COOKIE_NAME = "cv_auth_session";
export const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  dreamCompany: string | null;
  targetRole: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  dreamCompany: string | null;
  targetRole: string | null;
  createdAt: string;
  updatedAt: string;
}

type SessionPayload = {
  sub: string;
  email: string;
  exp: number;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readUsers(): StoredUser[] {
  if (!existsSync(USERS_FILE)) {
    return [];
  }

  try {
    const raw = readFileSync(USERS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is StoredUser => {
      return (
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        "email" in item &&
        "passwordHash" in item
      );
    });
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, hashHex] = storedHash.split(":");
  if (!salt || !hashHex) {
    return false;
  }

  try {
    const hashBuffer = Buffer.from(hashHex, "hex");
    const incomingHashBuffer = Buffer.from(
      scryptSync(password, salt, 64).toString("hex"),
      "hex"
    );

    if (hashBuffer.length !== incomingHashBuffer.length) {
      return false;
    }

    return timingSafeEqual(hashBuffer, incomingHashBuffer);
  } catch {
    return false;
  }
}

function signPayload(payload: string) {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

export function createSessionToken(user: StoredUser) {
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + AUTH_SESSION_MAX_AGE_SECONDS,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);
  const expectedBuffer = Buffer.from(expectedSignature, "base64url");
  const receivedBuffer = Buffer.from(signature, "base64url");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8")
    ) as SessionPayload;

    if (!payload.sub || !payload.email || typeof payload.exp !== "number") {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  return readUsers().find((user) => normalizeEmail(user.email) === normalizedEmail) ?? null;
}

export function getUserById(id: string) {
  return readUsers().find((user) => user.id === id) ?? null;
}

export function getAuthenticatedUserFromRequest(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  const session = verifySessionToken(token);
  if (!session) {
    return null;
  }

  const user = getUserById(session.sub);
  if (!user) {
    return null;
  }

  if (normalizeEmail(user.email) !== normalizeEmail(session.email)) {
    return null;
  }

  return user;
}

export function createUser(input: {
  fullName: string;
  email: string;
  password: string;
  dreamCompany?: string;
  targetRole?: string;
}) {
  const users = readUsers();
  const normalizedEmail = normalizeEmail(input.email);

  if (users.some((user) => normalizeEmail(user.email) === normalizedEmail)) {
    return null;
  }

  const now = new Date().toISOString();
  const user: StoredUser = {
    id: randomBytes(16).toString("hex"),
    fullName: input.fullName.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(input.password),
    dreamCompany: input.dreamCompany?.trim() || null,
    targetRole: input.targetRole?.trim() || null,
    createdAt: now,
    updatedAt: now,
  };

  users.unshift(user);
  writeUsers(users);

  return user;
}

export function authenticateUser(email: string, password: string) {
  const user = getUserByEmail(email);
  if (!user) {
    return null;
  }

  if (!verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return user;
}

export function toAuthUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    dreamCompany: user.dreamCompany,
    targetRole: user.targetRole,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
  };
}

export function getClearedAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
