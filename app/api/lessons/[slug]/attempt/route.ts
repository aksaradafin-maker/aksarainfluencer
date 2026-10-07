import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

type Attempt = {
  id: string;
  score: number;
  passed: boolean;
  attempt_date: string;
  created_at: string;
};

function makeId() {
  return `attempt_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

function getJakartaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function getLessonId(slug: string) {
  const { data, error } = await supabaseAdmin
    .from("lessons")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;

  return data?.id ? String(data.id) : null;
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const lessonId = await getLessonId(slug);

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson tidak ditemukan." },
        { status: 404 }
      );
    }

    const today = getJakartaDate();

    const { data, error } = await supabaseAdmin
      .from("quiz_attempts")
      .select("id,score,passed,attempt_date,created_at")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const attempts = (data ?? []) as Attempt[];

    const todayAttempt =
      attempts.find(
        (attempt) => String(attempt.attempt_date) === today
      ) ?? null;

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
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = (await request.json()) as {
      sessionId?: string;
      score?: number;
    };

    const score =
      typeof body.score === "number"
        ? Math.round(body.score)
        : -1;

    if (score < 0 || score > 100) {
      return NextResponse.json(
        { error: "Score tidak valid." },
        { status: 400 }
      );
    }

    const lessonId = await getLessonId(slug);

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson tidak ditemukan." },
        { status: 404 }
      );
    }

    const today = getJakartaDate();

    const { data: existing, error: existingError } =
      await supabaseAdmin
        .from("quiz_attempts")
        .select("id,score,passed,attempt_date,created_at")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .eq("attempt_date", today)
        .maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      return NextResponse.json(
        {
          error: "Kamu sudah mengerjakan quiz hari ini.",
          todayAttempt: existing,
          canAttempt: false,
        },
        { status: 409 }
      );
    }

    const attempt = {
      id: makeId(),
      user_id: user.id,
      lesson_id: lessonId,
      score,
      passed: score >= 80,
      attempt_date: today,
    };

    const { data: inserted, error: insertError } =
      await supabaseAdmin
        .from("quiz_attempts")
        .insert(attempt)
        .select("id,score,passed,attempt_date,created_at")
        .single();

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: concurrentAttempt } = await supabaseAdmin
          .from("quiz_attempts")
          .select("id,score,passed,attempt_date,created_at")
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId)
          .eq("attempt_date", today)
          .maybeSingle();

        return NextResponse.json(
          {
            error: "Kamu sudah mengerjakan quiz hari ini.",
            todayAttempt: concurrentAttempt ?? null,
            canAttempt: false,
          },
          { status: 409 }
        );
      }

      throw insertError;
    }

    return NextResponse.json(
      {
        success: true,
        attempt: inserted,
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
