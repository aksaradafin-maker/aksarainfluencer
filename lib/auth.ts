import crypto from "node:crypto";
import { cookies } from "next/headers";
import { db } from "./db";

const SESSION_COOKIE = "creator_studio_session";
const SESSION_DAYS = 30;

export type UserRole = "user" | "admin";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
};

function getAuthSecret() {
  return process.env.AUTH_SECRET || "creator-studio-local-dev-secret";
}

export function hashPassword(password: string) {
  return crypto
    .createHash("sha256")
    .update(`${password}:${getAuthSecret()}`)
    .digest("hex");
}

function hashSessionToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(`${token}:${getAuthSecret()}`)
    .digest("hex");
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: number) {
  const token = createToken();
  const tokenHash = hashSessionToken(token);

  await db.execute(
    `
      INSERT INTO user_sessions
        (user_id, token_hash, expires_at)
      VALUES
        (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))
    `,
    [userId, tokenHash, SESSION_DAYS]
  );

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  return token;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);

  const [rows] = await db.execute(
    `
      SELECT
        u.id,
        u.name,
        u.email,
        u.avatar,
        u.role
      FROM user_sessions s
      INNER JOIN users u
        ON u.id = s.user_id
      WHERE
        s.token_hash = ?
        AND s.expires_at > NOW()
      LIMIT 1
    `,
    [tokenHash]
  );

  const row = (rows as Array<{
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: UserRole;
  }>)[0];

  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    role: row.role === "admin" ? "admin" : "user",
  };
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = hashSessionToken(token);

    await db.execute(
      `
        DELETE FROM user_sessions
        WHERE token_hash = ?
      `,
      [tokenHash]
    );
  }

  cookieStore.delete(SESSION_COOKIE);
}