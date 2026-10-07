import { NextResponse } from "next/server";
import { appsScriptGet, appsScriptPost } from "@/lib/apps-script";
import { getCurrentUser } from "@/lib/auth";

type SalesPageData = {
  settings: Record<string, unknown> | null;
  items: Array<Record<string, unknown>>;
};

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await appsScriptGet<Partial<SalesPageData>>({
      action: "get_sales_page",
      published: "false",
    });

    return NextResponse.json({
      settings: data.settings ?? null,
      items: data.items ?? [],
    });
  } catch (error) {
    console.error("Sales page GET error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil sales page." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = await appsScriptPost<{ success?: boolean }>({
      action: "save_sales_page",
      settings: body.settings,
      items: body.items ?? [],
    });

    return NextResponse.json({ success: data.success !== false });
  } catch (error) {
    console.error("Sales page PUT error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan sales page." },
      { status: 500 }
    );
  }
}