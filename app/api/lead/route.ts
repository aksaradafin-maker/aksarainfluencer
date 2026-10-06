import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5OvT2U8Z3f7wXNLM4t5jSLcsI-fiEob7xYLlBG4Zl6PSpRfoB6OGdT8329rrDDGC6bA/exec";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Google Apps Script menolak request.",
          detail: text,
        },
        { status: 502 }
      );
    }

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        success: true,
        raw: text,
      };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("LEAD_PROXY_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Gagal menghubungkan ke Google Apps Script.",
      },
      { status: 500 }
    );
  }
}