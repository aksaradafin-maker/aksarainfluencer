import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function requireUser() {
  return await getCurrentUser();
}

export async function GET() {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [settingsRows] =
      await db.query(`
        SELECT *
        FROM sales_page_settings
        ORDER BY id ASC
        LIMIT 1
      `);

    const [itemsRows] =
      await db.query(`
        SELECT
          id,
          section_type AS sectionType,
          title,
          description,
          value_amount AS valueAmount,
          sort_order AS sortOrder,
          is_active AS isActive
        FROM sales_page_items
        ORDER BY section_type, sort_order, id
      `);

    return NextResponse.json({
      settings:
        Array.isArray(settingsRows)
          ? settingsRows[0] ?? null
          : null,
      items:
        Array.isArray(itemsRows)
          ? itemsRows
          : [],
    });
  } catch (error) {
    console.error(
      "Sales page GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal mengambil sales page.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request
) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const s = body.settings;

    const connection =
      await db.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(
        `
        UPDATE sales_page_settings
        SET
          hero_eyebrow = ?,
          hero_title = ?,
          hero_description = ?,
          hero_cta_text = ?,
          hero_cta_url = ?,

          early_bird_price = ?,
          early_bird_status = ?,
          current_price = ?,
          current_regular_price = ?,
          next_batch_price = ?,

          countdown_enabled = ?,
          countdown_minutes = ?,

          urgency_title = ?,
          urgency_description = ?,

          value_title = ?,
          value_description = ?,

          bonus_title = ?,
          bonus_description = ?,

          final_title = ?,
          final_description = ?,
          final_cta_text = ?,
          final_cta_url = ?,

          background_type = ?,
          background_media_url = ?,
          background_color = ?,
          background_overlay_color = ?,
          background_overlay_opacity = ?,

          accent_color = ?,
          danger_color = ?,

          container_max_width = ?,
          container_radius = ?,
          container_opacity = ?,
          container_border_opacity = ?,

          page_surface_color = ?,

          is_published = ?

        WHERE id = (
          SELECT id
          FROM (
            SELECT id
            FROM sales_page_settings
            ORDER BY id ASC
            LIMIT 1
          ) AS x
        )
        `,
        [
          s.hero_eyebrow,
          s.hero_title,
          s.hero_description,
          s.hero_cta_text,
          s.hero_cta_url,

          Number(s.early_bird_price),
          s.early_bird_status,
          Number(s.current_price),
          Number(s.current_regular_price),
          Number(s.next_batch_price),

          s.countdown_enabled ? 1 : 0,
          Number(s.countdown_minutes),

          s.urgency_title,
          s.urgency_description,

          s.value_title,
          s.value_description,

          s.bonus_title,
          s.bonus_description,

          s.final_title,
          s.final_description,
          s.final_cta_text,
          s.final_cta_url,

          s.background_type,
          s.background_media_url,
          s.background_color,
          s.background_overlay_color,
          Number(
            s.background_overlay_opacity
          ),

          s.accent_color,
          s.danger_color,

          Number(s.container_max_width),
          Number(s.container_radius),
          Number(s.container_opacity),
          Number(
            s.container_border_opacity
          ),

          s.page_surface_color,

          s.is_published ? 1 : 0,
        ]
      );

      await connection.query(
        `DELETE FROM sales_page_items`
      );

      for (
        const item of body.items ?? []
      ) {
        await connection.query(
          `
          INSERT INTO sales_page_items
          (
            section_type,
            title,
            description,
            value_amount,
            sort_order,
            is_active
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            item.sectionType,
            item.title,
            item.description,
            item.valueAmount
              ? Number(item.valueAmount)
              : null,
            Number(item.sortOrder || 0),
            item.isActive === false
              ? 0
              : 1,
          ]
        );
      }

      await connection.commit();

      return NextResponse.json({
        success: true,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(
      "Sales page PUT error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Gagal menyimpan sales page.",
      },
      { status: 500 }
    );
  }
}