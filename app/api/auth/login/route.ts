import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  createSession,
  hashPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      body.password || ""
    );

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

    const { data: user, error } =
      await supabaseAdmin
        .from("users")
        .select(
          "id,name,email,avatar,role,status"
        )
        .eq("email", email)
        .eq("password_hash", passwordHash)
        .eq("status", "active")
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    await createSession(String(user.id));

    return NextResponse.json({
      success: true,
      user: {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role:
          user.role === "admin"
            ? "admin"
            : "user",
        avatar: user.avatar ?? null,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Login gagal.",
      },
      { status: 401 }
    );
  }
}
