import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

function makeId(prefix: string) {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

function toSettingsObject(
  rows: Array<{ key: string; value: string }>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const row of rows) {
    const raw = String(row.value ?? "");

    try {
      result[row.key] = JSON.parse(raw);
      continue;
    } catch {}

    if (raw === "true") {
      result[row.key] = true;
      continue;
    }

    if (raw === "false") {
      result[row.key] = false;
      continue;
    }

    const numeric = Number(raw);

    result[row.key] =
      raw.trim() !== "" && Number.isFinite(numeric) ? numeric : raw;
  }

  return result;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: settingsRows, error: settingsError } =
      await supabaseAdmin
        .from("sales_settings")
        .select("key,value")
        .neq("key", "sales_page_items")
        .order("key", { ascending: true });

    if (settingsError) throw settingsError;

    const { data: itemRows, error: itemsError } = await supabaseAdmin
      .from("sales_page_items")
      .select("id,sort_order,item")
      .order("sort_order", { ascending: true });

    if (itemsError) throw itemsError;

    const items = (itemRows ?? []).map((row) => ({
      ...((row.item ?? {}) as Record<string, unknown>),
      id: row.id,
      sort_order: row.sort_order,
    }));

    return NextResponse.json({
      settings: toSettingsObject(settingsRows ?? []),
      items,
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

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as {
      settings?: Record<string, unknown>;
      items?: Array<Record<string, unknown>>;
    };

    const settings = body.settings ?? {};
    const items = Array.isArray(body.items) ? body.items : [];

    for (const [key, value] of Object.entries(settings)) {
      const storedValue =
        typeof value === "string" ? value : JSON.stringify(value);

      const { error } = await supabaseAdmin
        .from("sales_settings")
        .upsert(
          {
            key,
            value: storedValue,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        );

      if (error) throw error;
    }

    const { error: deleteError } = await supabaseAdmin
      .from("sales_page_items")
      .delete()
      .neq("id", "");

    if (deleteError) throw deleteError;

    if (items.length > 0) {
      const rows = items.map((item, index) => {
        const candidateId =
          typeof item.id === "string" && item.id.trim()
            ? item.id.trim()
            : makeId("salesitem");

        const candidateSort =
          typeof item.sort_order === "number"
            ? item.sort_order
            : index;

        return {
          id: candidateId,
          sort_order: candidateSort,
          item,
          updated_at: new Date().toISOString(),
        };
      });

      const { error: insertError } = await supabaseAdmin
        .from("sales_page_items")
        .insert(rows);

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sales page PUT error:", error);

    return NextResponse.json(
      { error: "Gagal menyimpan sales page." },
      { status: 500 }
    );
  }
}
