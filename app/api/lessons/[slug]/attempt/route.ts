import { NextResponse } from "next/server";
import { appsScriptGet, appsScriptPost } from "@/lib/apps-script";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

type Attempt = {
  id: number;
  score: number;
  passed: boolean;
  attempt_date: string;
  created_at: string;
};

type AttemptBody = {
  sessionId?: string;
  score?: number;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  const { slug } = await params;
  const sessionId = new URL(request.url).searchParams.get("sessionId") || "";

  try {
    const data = await appsScriptGet<{
      lessonFound: boolean;
      attempts?: Attempt[];
      todayAttempt?: Attempt | null;
    }>({
      action: "get_quiz_attempts",
      slug,
      sessionId,
    });

    if (!data.lessonFound) {
      return NextResponse.json(
        { error: "Lesson tidak ditemukan." },
        { status: 404 }
      );
    }

    const attempts = data.attempts ?? [];
    const todayAttempt = data.todayAttempt ?? null;

    return NextResponse.json({
      attempts,
      todayAttempt,
      canAttempt: !todayAttempt,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil riwayat quiz." },
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
    const body = (await request.json()) as AttemptBody;
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
    const score = typeof body.score === "number" ? Math.round(body.score) : -1;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID wajib diisi." },
        { status: 400 }
      );
    }

    if (score < 0 || score > 100) {
      return NextResponse.json(
        { error: "Score tidak valid." },
        { status: 400 }
      );
    }

    const data = await appsScriptPost<{
      lessonFound: boolean;
      alreadyAttempted?: boolean;
      todayAttempt?: Attempt | null;
      attempt?: Attempt;
    }>({
      action: "save_quiz_attempt",
      slug,
      sessionId,
      score,
    });

    if (!data.lessonFound) {
      return NextResponse.json(
        { error: "Lesson tidak ditemukan." },
        { status: 404 }
      );
    }

    if (data.alreadyAttempted) {
      return NextResponse.json(
        {
          error: "Kamu sudah mengerjakan quiz hari ini.",
          todayAttempt: data.todayAttempt ?? null,
          canAttempt: false,
        },
        { status: 409 }
      );
    }

    if (!data.attempt) {
      throw new Error("Google Apps Script did not return the saved attempt");
    }

    return NextResponse.json(
      {
        success: true,
        attempt: data.attempt,
        canAttempt: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal menyimpan quiz attempt." },
      { status: 500 }
    );
  }
}