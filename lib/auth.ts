import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { sha256 } from "@/lib/security";
import { getUserByEmail, createSession, getSessionByTokenHash, deleteSessionByTokenHash } from "@/lib/db";

const SESSION_COOKIE_NAME = "session";
const SESSION_DURATION_DAYS = 7;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(): string {
  const token = Array.from({ length: 32 }, () =>
    Math.random().toString(36).slice(2)
  ).join("");
  return token;
}

export async function createSessionForUser(userId: string) {
  const token = createSessionToken();
  const tokenHash = await sha256(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  createSession(userId, tokenHash, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    const tokenHash = await sha256(token);
    deleteSessionByTokenHash(tokenHash);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = await sha256(token);
  const session = getSessionByTokenHash(tokenHash);
  if (!session) return null;

  return {
    id: session.id,
    name: session.name,
    email: session.email,
  };
}
