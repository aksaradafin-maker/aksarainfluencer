import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  createId,
  createSession,
  hashPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(
      body.name || ""
    ).trim();

    const email = String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      body.password || ""
    );

    const whatsapp = String(
      body.whatsapp || ""
    ).trim();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Nama, email, dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password minimal 6 karakter.",
        },
        { status: 400 }
      );
    }

    const { data: existingUser, error: lookupError } =
      await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Email sudah terdaftar.",
        },
        { status: 400 }
      );
    }

    const user = {
      id: createId("user"),
      name,
      email,
      whatsapp,
      password_hash: hashPassword(password),
      avatar: null,
      role: "user",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: createdUser, error } =
      await supabaseAdmin
        .from("users")
        .insert(user)
        .select(
          "id,name,email,avatar,role,status"
        )
        .single();

    if (error) {
      throw error;
    }

    await createSession(String(createdUser.id));

    return NextResponse.json({
      success: true,
      user: {
        id: String(createdUser.id),
        name: createdUser.name,
        email: createdUser.email,
        role:
          createdUser.role === "admin"
            ? "admin"
            : "user",
        avatar:
          createdUser.avatar ?? null,
      },
    });
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Registrasi gagal.",
      },
      { status: 400 }
    );
  }
}
