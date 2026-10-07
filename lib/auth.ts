import crypto from "node:crypto";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase";

const SESSION_COOKIE = "creator_studio_session";
const SESSION_DAYS = 30;

export type UserRole = "user" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
};

function getAuthSecret() {
  return (
    process.env.AUTH_SECRET ||
    "creator-studio-local-dev-secret"
  );
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

export function createId(prefix: string) {
  return `${prefix}_${crypto
    .randomUUID()
    .replace(/-/g, "")
    .slice(0, 16)}`;
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId: string) {
  const token = createToken();
  const tokenHash = hashSessionToken(token);

  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const { error } = await supabaseAdmin
    .from("user_sessions")
    .insert({
      id: createId("session"),
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });

  if (error) {
    throw error;
  }

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });

  return token;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = (await cookies())
    .get(SESSION_COOKIE)
    ?.value;

  if (!token) {
    return null;
  }

  try {
    const tokenHash = hashSessionToken(token);

    const { data: session, error: sessionError } =
      await supabaseAdmin
        .from("user_sessions")
        .select("user_id, expires_at")
        .eq("token_hash", tokenHash)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

    if (sessionError || !session) {
      return null;
    }

    const { data: user, error: userError } =
      await supabaseAdmin
        .from("users")
        .select(
          "id,name,email,avatar,role,status"
        )
        .eq("id", String(session.user_id))
        .maybeSingle();

    if (userError || !user) {
      return null;
    }

    if (
      String(user.status || "active").toLowerCase() !==
      "active"
    ) {
      return null;
    }

    return {
      id: String(user.id),
      name: String(user.name),
      email: String(user.email),
      avatar: user.avatar
        ? String(user.avatar)
        : null,
      role:
        String(user.role).toLowerCase() === "admin"
          ? "admin"
          : "user",
    };
  } catch {
    return null;
  }
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
    try {
      const tokenHash = hashSessionToken(token);

      await supabaseAdmin
        .from("user_sessions")
        .delete()
        .eq("token_hash", tokenHash);
    } catch {}
  }

  cookieStore.delete(SESSION_COOKIE);
}
