import crypto from "node:crypto";
import { cookies } from "next/headers";
import { appsScriptPost } from "./apps-script";

const SESSION_COOKIE = "creator_studio_session";
const SESSION_DAYS = 30;
export type UserRole = "user" | "admin";
export type AuthUser = { id: number; name: string; email: string; avatar: string | null; role: UserRole };

function getAuthSecret() { return process.env.AUTH_SECRET || "creator-studio-local-dev-secret"; }
export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(`${password}:${getAuthSecret()}`).digest("hex");
}
function createToken() { return crypto.randomBytes(32).toString("hex"); }

export async function createSession(userId: number) {
  const token = createToken();
  await appsScriptPost({ action: "create_session", user_id: userId, token, expires_days: SESSION_DAYS });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_DAYS * 86400 });
  return token;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const result = await appsScriptPost<{ success: boolean; user?: AuthUser | null }>({ action: "session", token });
    if (!result.user) return null;
    return { id: Number(result.user.id), name: result.user.name, email: result.user.email, avatar: result.user.avatar ?? null, role: result.user.role === "admin" ? "admin" : "user" };
  } catch { return null; }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (user.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) { try { await appsScriptPost({ action: "delete_session", token }); } catch {} }
  cookieStore.delete(SESSION_COOKIE);
}
