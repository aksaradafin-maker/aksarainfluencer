import { NextResponse } from "next/server";
import { appsScriptGet, appsScriptPost } from "@/lib/apps-script";
import { requireAdminApi } from "@/lib/admin";

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

type Lesson = {
  slug: string;
  lessonNumber: string;
  chapter: string;
  title: string;
  description: string;
  videoId: string;
  videoUrl: string;
  status: "draft" | "published";
  flashcards: Array<{ id: number; question: string; answer: string }>;
  materials: Array<{ id: number; title: string; content: string }>;
  quiz: Array<{ id: number; question: string; options: string[]; correctAnswer: number }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;
    const data = await appsScriptGet<{ lesson?: Lesson | null }>({
      action: "get_lesson",
      slug,
    });

    if (!data.lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data.lesson);
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
        { error: "title, chapter, and lessonNumber are required" },
        { status: 400 }
      );
    }

    const data = await appsScriptPost<{ lesson?: Lesson }>({
      action: "save_lesson",
      slug,
      lesson: {
        ...body,
        slug,
        description: body.description ?? "",
        videoId: body.videoId ?? "",
        videoUrl: body.videoUrl ?? "",
        status: body.status ?? "draft",
        flashcards: body.flashcards ?? [],
        materials: body.materials ?? [],
        quiz: body.quiz ?? [],
      },
    });

    if (!data.lesson) {
      throw new Error("Google Apps Script did not return the saved lesson");
    }

    return NextResponse.json(data.lesson);
  } catch (error) {
    console.error("PUT /api/lessons/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to save lesson" },
      { status: 500 }
    );
  }
}