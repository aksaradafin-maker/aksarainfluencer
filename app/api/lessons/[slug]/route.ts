import { NextResponse } from "next/server";
import { db } from "@/lib/db";
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

async function getLesson(slug: string) {
  const [lessonRows] = await db.execute(
    `
      SELECT
        id,
        slug,
        lesson_number AS lessonNumber,
        chapter,
        title,
        description,
        video_id AS videoId,
        video_url AS videoUrl,
        status
      FROM lessons
      WHERE slug = ?
      LIMIT 1
    `,
    [slug]
  );

  const lessons = lessonRows as Array<{
    id: number;
    slug: string;
    lessonNumber: string;
    chapter: string;
    title: string;
    description: string;
    videoId: string;
    videoUrl: string;
    status: "draft" | "published";
  }>;

  if (!lessons.length) {
    return null;
  }

  const lesson = lessons[0];

  const [flashcardRows] = await db.execute(
    `
      SELECT
        id,
        question,
        answer,
        sort_order AS sortOrder
      FROM flashcards
      WHERE lesson_id = ?
      ORDER BY sort_order ASC, id ASC
    `,
    [lesson.id]
  );

  const [materialRows] = await db.execute(
    `
      SELECT
        id,
        title,
        content,
        sort_order AS sortOrder
      FROM materials
      WHERE lesson_id = ?
      ORDER BY sort_order ASC, id ASC
    `,
    [lesson.id]
  );

  const [questionRows] = await db.execute(
    `
      SELECT
        id,
        question,
        sort_order AS sortOrder,
        correct_option_id AS correctOptionId
      FROM quiz_questions
      WHERE lesson_id = ?
      ORDER BY sort_order ASC, id ASC
    `,
    [lesson.id]
  );

  const questions = questionRows as Array<{
    id: number;
    question: string;
    sortOrder: number;
    correctOptionId: number | null;
  }>;

  const quiz = [];

  for (const question of questions) {
    const [optionRows] = await db.execute(
      `
        SELECT
          id,
          option_text AS optionText,
          sort_order AS sortOrder
        FROM quiz_options
        WHERE question_id = ?
        ORDER BY sort_order ASC, id ASC
      `,
      [question.id]
    );

    const options = optionRows as Array<{
      id: number;
      optionText: string;
      sortOrder: number;
    }>;

    const correctAnswer = options.findIndex(
      (option) => option.id === question.correctOptionId
    );

    quiz.push({
      id: question.id,
      question: question.question,
      options: options.map((option) => option.optionText),
      correctAnswer: correctAnswer >= 0 ? correctAnswer : 0,
    });
  }

  return {
    slug: lesson.slug,
    lessonNumber: lesson.lessonNumber,
    chapter: lesson.chapter,
    title: lesson.title,
    description: lesson.description,
    videoId: lesson.videoId,
    videoUrl: lesson.videoUrl,
    status: lesson.status,

    flashcards: (flashcardRows as Array<{
      id: number;
      question: string;
      answer: string;
      sortOrder: number;
    }>).map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
    })),

    materials: (materialRows as Array<{
      id: number;
      title: string;
      content: string;
      sortOrder: number;
    }>).map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
    })),

    quiz,
  };
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;

    const lesson = await getLesson(slug);

    if (!lesson) {
      return NextResponse.json(
        {
          error: "Lesson not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("GET /api/lessons/[slug] error:", error);

    return NextResponse.json(
      {
        error: "Failed to load lesson",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  const admin = await requireAdminApi();
  if (admin.response) return admin.response;

  const connection = await db.getConnection();

  try {
    const { slug } = await context.params;

    const body = (await request.json()) as LessonPayload;

    if (!body.title || !body.chapter || !body.lessonNumber) {
      return NextResponse.json(
        {
          error: "title, chapter, and lessonNumber are required",
        },
        {
          status: 400,
        }
      );
    }

    await connection.beginTransaction();

    const [lessonRows] = await connection.execute(
      `
        SELECT id
        FROM lessons
        WHERE slug = ?
        LIMIT 1
        FOR UPDATE
      `,
      [slug]
    );

    const lessons = lessonRows as Array<{
      id: number;
    }>;

    let lessonId: number;

    if (lessons.length) {
      lessonId = lessons[0].id;

      await connection.execute(
        `
          UPDATE lessons
          SET
            lesson_number = ?,
            chapter = ?,
            title = ?,
            description = ?,
            video_id = ?,
            video_url = ?,
            status = ?
          WHERE id = ?
        `,
        [
          body.lessonNumber,
          body.chapter,
          body.title,
          body.description ?? "",
          body.videoId ?? "",
          body.videoUrl ?? "",
          body.status ?? "draft",
          lessonId,
        ]
      );
    } else {
      const [insertResult] = await connection.execute(
        `
          INSERT INTO lessons (
            slug,
            lesson_number,
            chapter,
            title,
            description,
            video_id,
            video_url,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          slug,
          body.lessonNumber,
          body.chapter,
          body.title,
          body.description ?? "",
          body.videoId ?? "",
          body.videoUrl ?? "",
          body.status ?? "draft",
        ]
      );

      lessonId = Number(
        (insertResult as { insertId: number }).insertId
      );
    }

    // Replace child content atomically.
    await connection.execute(
      `DELETE FROM flashcards WHERE lesson_id = ?`,
      [lessonId]
    );

    await connection.execute(
      `DELETE FROM materials WHERE lesson_id = ?`,
      [lessonId]
    );

    await connection.execute(
      `DELETE FROM quiz_questions WHERE lesson_id = ?`,
      [lessonId]
    );

    // Flashcards
    for (
      let index = 0;
      index < (body.flashcards ?? []).length;
      index++
    ) {
      const card = body.flashcards![index];

      await connection.execute(
        `
          INSERT INTO flashcards (
            lesson_id,
            sort_order,
            question,
            answer
          )
          VALUES (?, ?, ?, ?)
        `,
        [
          lessonId,
          index,
          card.question ?? "",
          card.answer ?? "",
        ]
      );
    }

    // Materials
    for (
      let index = 0;
      index < (body.materials ?? []).length;
      index++
    ) {
      const material = body.materials![index];

      await connection.execute(
        `
          INSERT INTO materials (
            lesson_id,
            sort_order,
            title,
            content
          )
          VALUES (?, ?, ?, ?)
        `,
        [
          lessonId,
          index,
          material.title ?? "",
          material.content ?? "",
        ]
      );
    }

    // Quiz questions + options
    for (
      let questionIndex = 0;
      questionIndex < (body.quiz ?? []).length;
      questionIndex++
    ) {
      const quizQuestion = body.quiz![questionIndex];

      const [questionResult] = await connection.execute(
        `
          INSERT INTO quiz_questions (
            lesson_id,
            sort_order,
            question
          )
          VALUES (?, ?, ?)
        `,
        [
          lessonId,
          questionIndex,
          quizQuestion.question ?? "",
        ]
      );

      const questionId = Number(
        (questionResult as { insertId: number }).insertId
      );

      const options = quizQuestion.options ?? [];

      let correctOptionId: number | null = null;

      for (
        let optionIndex = 0;
        optionIndex < options.length;
        optionIndex++
      ) {
        const [optionResult] = await connection.execute(
          `
            INSERT INTO quiz_options (
              question_id,
              sort_order,
              option_text
            )
            VALUES (?, ?, ?)
          `,
          [
            questionId,
            optionIndex,
            options[optionIndex] ?? "",
          ]
        );

        const optionId = Number(
          (optionResult as { insertId: number }).insertId
        );

        if (optionIndex === quizQuestion.correctAnswer) {
          correctOptionId = optionId;
        }
      }

      if (correctOptionId !== null) {
        await connection.execute(
          `
            UPDATE quiz_questions
            SET correct_option_id = ?
            WHERE id = ?
          `,
          [correctOptionId, questionId]
        );
      }
    }

    await connection.commit();

    const savedLesson = await getLesson(slug);

    return NextResponse.json(savedLesson);
  } catch (error) {
    await connection.rollback();

    console.error("PUT /api/lessons/[slug] error:", error);

    return NextResponse.json(
      {
        error: "Failed to save lesson",
      },
      {
        status: 500,
      }
    );
  } finally {
    connection.release();
  }
}