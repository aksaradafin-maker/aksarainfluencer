import { NextResponse } from "next/server";
import {
  createSession,
  hashPassword,
} from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email
            .trim()
            .toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error:
            "Nama, email, dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password minimal 8 karakter.",
        },
        { status: 400 }
      );
    }

    const [existing] =
      await db.query<any[]>(
        `
          SELECT id
          FROM users
          WHERE email = ?
          LIMIT 1
        `,
        [email]
      );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          error:
            "Email sudah terdaftar.",
        },
        { status: 409 }
      );
    }

    const [result] =
      await db.execute<any>(
        `
          INSERT INTO users (
            name,
            email,
            password_hash
          )
          VALUES (?, ?, ?)
        `,
        [
          name,
          email,
          hashPassword(password),
        ]
      );

    await createSession(
      result.insertId
    );

    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.insertId,
          name,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal membuat akun.",
      },
      { status: 500 }
    );
  }
}
