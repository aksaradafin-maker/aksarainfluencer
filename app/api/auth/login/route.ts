import { NextResponse } from "next/server";
import { appsScriptPost } from "@/lib/apps-script";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) return NextResponse.json({ success: false, error: "Email dan password wajib diisi." }, { status: 400 });
    const result = await appsScriptPost<{ success: boolean; user?: { id: number; name: string; email: string; avatar?: string | null; role?: string } }>({ action: "login", email, password });
    if (!result.user) return NextResponse.json({ success: false, error: "Email atau password salah." }, { status: 401 });
    await createSession(Number(result.user.id));
    return NextResponse.json({ success: true, user: { ...result.user, id: Number(result.user.id), role: result.user.role === "admin" ? "admin" : "user", avatar: result.user.avatar ?? null } });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Login gagal." }, { status: 401 });
  }
}
