import { NextResponse } from "next/server";
import { appsScriptPost } from "@/lib/apps-script";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    if (!name || !email || !password) return NextResponse.json({ success: false, error: "Nama, email, dan password wajib diisi." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ success: false, error: "Password minimal 6 karakter." }, { status: 400 });
    const result = await appsScriptPost<{ success: boolean; user?: { id: number; name: string; email: string; avatar?: string | null; role?: string } }>({ action: "register_user", name, email, password, whatsapp: body.whatsapp || "" });
    if (!result.user) return NextResponse.json({ success: false, error: "Registrasi gagal." }, { status: 400 });
    await createSession(Number(result.user.id));
    return NextResponse.json({ success: true, user: { ...result.user, id: Number(result.user.id), role: result.user.role === "admin" ? "admin" : "user", avatar: result.user.avatar ?? null } });
  } catch (error) {
    console.error("REGISTER_ERROR:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Registrasi gagal." }, { status: 400 });
  }
}
