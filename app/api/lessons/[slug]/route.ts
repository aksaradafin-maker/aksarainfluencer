import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

type LessonPayload = {
  slug: string;
  lessonNumber: string;
  chapter: string;
  title: string;
  description: string;
  videoId: string;
  videoUrl: string;
  status: "draft" | "published";
  flashcards?: Array<{
    question: string;
    answer: string;
  }>;
  materials?: Array<{
    title: string;
    content: string;
  }>;
  quiz?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
};

function makeId(prefix: string) {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

function mapLesson(
  lesson: Record<string, unknown>,
  flashcards: Array<Record<string, unknown>>,
  materials: Array<Record<string, unknown>>,
  questions: Array<Record<string, unknown>>,
  options: Array<Record<string, unknown>>
) {
  return {
    slug: String(lesson.slug ?? ""),
    lessonNumber: String(lesson.number ?? ""),
    chapter: String(lesson.chapter ?? ""),
    title: String(lesson.title ?? ""),
    description: String(lesson.description ?? ""),
    videoId: String(lesson.video_id ?? ""),
    videoUrl: String(lesson.video_url ?? ""),
    status:
      String(lesson.status ?? "draft") === "published"
        ? "published"
        : "draft",
    flashcards: flashcards.map((row) => ({
      id: String(row.id ?? ""),
      question: String(row.question ?? ""),
      answer: String(row.answer ?? ""),
    })),
    materials: materials.map((row) => ({
      id: String(row.id ?? ""),
      title: String(row.title ?? ""),
      content: String(row.content ?? ""),
    })),
    quiz: questions.map((question) => {
      const questionOptions = options
        .filter(
          (option) =>
            String(option.question_id ?? "") ===
            String(question.id ?? "")
        )
        .sort(
          (a, b) =>
            Number(a.sort_order ?? 0) -
            Number(b.sort_order ?? 0)
        );

      const correctAnswer = questionOptions.findIndex(
        (option) => Boolean(option.is_correct)
      );

      return {
        id: String(question.id ?? ""),
        question: String(question.question ?? ""),
        options: questionOptions.map((option) =>
          String(option.option_text ?? "")
        ),
        correctAnswer: correctAnswer >= 0 ? correctAnswer : 0,
      };
    }),
  };
}

async function loadLessonBySlug(slug: string) {
  const { data: lesson, error: lessonError } = await supabaseAdmin
    .from("lessons")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (lessonError) throw lessonError;

  if (!lesson) return null;

  const [
    flashcardsResult,
    materialsResult,
    questionsResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("flashcards")
      .select("*")
      .eq("lesson_id", lesson.id)
      .order("sort_order", { ascending: true }),
    supabaseAdmin
      .from("materials")
      .select("*")
      .eq("lesson_id", lesson.id)
      .order("sort_order", { ascending: true }),
    supabaseAdmin
      .from("quiz_questions")
      .select("*")
      .eq("lesson_id", lesson.id)
      .order("sort_order", { ascending: true }),
  ]);

  if (flashcardsResult.error) throw flashcardsResult.error;
  if (materialsResult.error) throw materialsResult.error;
  if (questionsResult.error) throw questionsResult.error;

  const questionIds = (questionsResult.data ?? []).map(
    (row) => row.id
  );

  let options: Array<Record<string, unknown>> = [];

  if (questionIds.length > 0) {
    const { data, error } = await supabaseAdmin
      .from("quiz_options")
      .select("*")
      .in("question_id", questionIds)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    options = (data ?? []) as Array<Record<string, unknown>>;
  }

  return mapLesson(
    lesson as Record<string, unknown>,
    (flashcardsResult.data ?? []) as Array<Record<string, unknown>>,
    (materialsResult.data ?? []) as Array<Record<string, unknown>>,
    (questionsResult.data ?? []) as Array<Record<string, unknown>>,
    options
  );
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;
    const lesson = await loadLessonBySlug(slug);

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("GET /api/lessons/[slug] error:", error);

    return NextResponse.json(
      { error: "Failed to load lesson" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  const admin = await requireAdminApi();

  if (admin.response) return admin.response;

  try {
    const { slug } = await context.params;
    const body = (await request.json()) as LessonPayload;

    if (!body.title || !body.chapter || !body.lessonNumber) {
      return NextResponse.json(
        {
          error:
            "title, chapter, and lessonNumber are required",
        },
        { status: 400 }
      );
    }

    const { data: existingLesson, error: existingError } =
      await supabaseAdmin
        .from("lessons")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

    if (existingError) throw existingError;

    const lessonId =
      String(existingLesson?.id ?? "").trim() || makeId("lesson");

    const { error: lessonError } = await supabaseAdmin
      .from("lessons")
      .upsert(
        {
          id: lessonId,
          slug,
          number: body.lessonNumber,
          chapter: body.chapter,
          title: body.title,
          description: body.description ?? "",
          video_id: body.videoId ?? "",
          video_url: body.videoUrl ?? "",
          status: body.status ?? "draft",
          sort_order: 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (lessonError) throw lessonError;

    const { error: deleteFlashcardsError } = await supabaseAdmin
      .from("flashcards")
      .delete()
      .eq("lesson_id", lessonId);

    if (deleteFlashcardsError) throw deleteFlashcardsError;

    if ((body.flashcards ?? []).length > 0) {
      const rows = body.flashcards!.map((card, index) => ({
        id: makeId("flashcard"),
        lesson_id: lessonId,
        question: card.question ?? "",
        answer: card.answer ?? "",
        sort_order: index,
      }));

      const { error } = await supabaseAdmin
        .from("flashcards")
        .insert(rows);

      if (error) throw error;
    }

    const { error: deleteMaterialsError } = await supabaseAdmin
      .from("materials")
      .delete()
      .eq("lesson_id", lessonId);

    if (deleteMaterialsError) throw deleteMaterialsError;

    if ((body.materials ?? []).length > 0) {
      const rows = body.materials!.map((material, index) => ({
        id: makeId("material"),
        lesson_id: lessonId,
        title: material.title ?? "",
        content: material.content ?? "",
        sort_order: index,
      }));

      const { error } = await supabaseAdmin
        .from("materials")
        .insert(rows);

      if (error) throw error;
    }

    const { data: oldQuestions, error: oldQuestionsError } =
      await supabaseAdmin
        .from("quiz_questions")
        .select("id")
        .eq("lesson_id", lessonId);

    if (oldQuestionsError) throw oldQuestionsError;

    const oldQuestionIds = (oldQuestions ?? []).map(
      (row) => row.id
    );

    if (oldQuestionIds.length > 0) {
      const { error } = await supabaseAdmin
        .from("quiz_options")
        .delete()
        .in("question_id", oldQuestionIds);

      if (error) throw error;
    }

    const { error: deleteQuestionsError } = await supabaseAdmin
      .from("quiz_questions")
      .delete()
      .eq("lesson_id", lessonId);

    if (deleteQuestionsError) throw deleteQuestionsError;

    if ((body.quiz ?? []).length > 0) {
      for (let qi = 0; qi < body.quiz!.length; qi++) {
        const quiz = body.quiz![qi];
        const questionId = makeId("question");

        const { error: questionError } = await supabaseAdmin
          .from("quiz_questions")
          .insert({
            id: questionId,
            lesson_id: lessonId,
            question: quiz.question ?? "",
            explanation: "",
            sort_order: qi,
          });

        if (questionError) throw questionError;

        const optionRows = (quiz.options ?? []).map(
          (optionText, index) => ({
            id: makeId("option"),
            question_id: questionId,
            option_text: optionText ?? "",
            is_correct: index === quiz.correctAnswer,
            sort_order: index,
          })
        );

        if (optionRows.length > 0) {
          const { error: optionError } = await supabaseAdmin
            .from("quiz_options")
            .insert(optionRows);

          if (optionError) throw optionError;
        }
      }
    }

    const savedLesson = await loadLessonBySlug(slug);

    if (!savedLesson) {
      throw new Error("Saved lesson could not be reloaded");
    }

    return NextResponse.json(savedLesson);
  } catch (error) {
    console.error("PUT /api/lessons/[slug] error:", error);

    return NextResponse.json(
      { error: "Failed to save lesson" },
      { status: 500 }
    );
  }
}
