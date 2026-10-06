import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

type AttemptBody = {
  sessionId?: string;
  score?: number;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const { slug } = await params;

  try {
    const [lessons] = await db.query<any[]>(
      `
        SELECT id
        FROM lessons
        WHERE slug = ?
        LIMIT 1
      `,
      [slug]
    );

    const lesson = lessons[0];

    if (!lesson) {
      return NextResponse.json(
        {
          error: "Lesson tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    const url = new URL(_request.url);
    const sessionId =
      url.searchParams.get("sessionId") || "";

    if (!sessionId) {
      return NextResponse.json({
        attempts: [],
        todayAttempt: null,
        canAttempt: true,
      });
    }

    const [attempts] = await db.query<any[]>(
      `
        SELECT
          id,
          score,
          passed,
          attempt_date,
          created_at
        FROM quiz_attempts
        WHERE lesson_id = ?
          AND session_id = ?
        ORDER BY created_at DESC
        LIMIT 20
      `,
      [lesson.id, sessionId]
    );

    const todayAttempt =
      attempts.find(
        (attempt) =>
          String(attempt.attempt_date)
            .slice(0, 10) ===
          new Date()
            .toISOString()
            .slice(0, 10)
      ) || null;

    return NextResponse.json({
      attempts,
      todayAttempt,
      canAttempt: !todayAttempt,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal mengambil riwayat quiz.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  const { slug } = await params;

  try {
    const body =
      (await request.json()) as AttemptBody;

    const sessionId =
      typeof body.sessionId === "string"
        ? body.sessionId.trim()
        : "";

    const score =
      typeof body.score === "number"
        ? Math.round(body.score)
        : -1;

    if (!sessionId) {
      return NextResponse.json(
        {
          error: "Session ID wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (score < 0 || score > 100) {
      return NextResponse.json(
        {
          error: "Score tidak valid.",
        },
        { status: 400 }
      );
    }

    const [lessons] = await db.query<any[]>(
      `
        SELECT id
        FROM lessons
        WHERE slug = ?
        LIMIT 1
      `,
      [slug]
    );

    const lesson = lessons[0];

    if (!lesson) {
      return NextResponse.json(
        {
          error: "Lesson tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    const [existing] = await db.query<any[]>(
      `
        SELECT
          id,
          score,
          passed,
          attempt_date,
          created_at
        FROM quiz_attempts
        WHERE lesson_id = ?
          AND session_id = ?
          AND attempt_date = CURDATE()
        LIMIT 1
      `,
      [lesson.id, sessionId]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        {
          error:
            "Kamu sudah mengerjakan quiz hari ini.",
          todayAttempt: existing[0],
          canAttempt: false,
        },
        { status: 409 }
      );
    }

    const passed = score >= 80 ? 1 : 0;

    const [result] = await db.execute<any>(
      `
        INSERT INTO quiz_attempts (
          lesson_id,
          session_id,
          score,
          passed,
          attempt_date
        )
        VALUES (?, ?, ?, ?, CURDATE())
      `,
      [
        lesson.id,
        sessionId,
        score,
        passed,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        attempt: {
          id: result.insertId,
          score,
          passed: Boolean(passed),
        },
        canAttempt: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal menyimpan quiz attempt.",
      },
      { status: 500 }
    );
  }
}
