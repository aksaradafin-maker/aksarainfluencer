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

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "Email dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    const [rows] =
      await db.query<any[]>(
        `
          SELECT
            id,
            name,
            email,
            avatar,
            password_hash
          FROM users
          WHERE email = ?
          LIMIT 1
        `,
        [email]
      );

    const user = rows[0];

    if (
      !user ||
      user.password_hash !==
        hashPassword(password)
    ) {
      return NextResponse.json(
        {
          error:
            "Email atau password salah.",
        },
        { status: 401 }
      );
    }

    await createSession(
      user.id
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Gagal login.",
      },
      { status: 500 }
    );
  }
}
