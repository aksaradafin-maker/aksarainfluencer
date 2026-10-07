import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSalesSettings, supabaseAdmin } from "@/lib/supabase";

function makeId(prefix: string) {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      nama?: string;
      whatsapp?: string;
      email?: string;
      source?: string;
    };

    const nama = String(payload.nama ?? "").trim();
    const whatsapp = String(payload.whatsapp ?? "").trim();
    const email = String(payload.email ?? "").trim();

    if (!nama) {
      return NextResponse.json(
        { success: false, error: "Nama wajib diisi." },
        { status: 400 }
      );
    }

    if (!whatsapp) {
      return NextResponse.json(
        { success: false, error: "WhatsApp wajib diisi." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email wajib diisi." },
        { status: 400 }
      );
    }

    const settings = await getSalesSettings();
    const timestamp = new Date();
    const holdMinutes = settings.countdown_minutes || 30;

    const heldUntil = new Date(
      timestamp.getTime() + holdMinutes * 60 * 1000
    );

    const lead = {
      id: makeId("lead"),
      timestamp: timestamp.toISOString(),
      nama,
      whatsapp,
      email,
      harga_hold: settings.current_price,
      price_held_until: heldUntil.toISOString(),
      source: String(payload.source || "landing"),
      status: "registered",
    };

    const { error } = await supabaseAdmin
      .from("leads")
      .insert(lead);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      lead,
      offer: {
        harga_hold: settings.current_price,
        price_held_until: heldUntil.toISOString(),
        hold_minutes: holdMinutes,
        lynk_url: settings.lynk_url,
      },
    });
  } catch (error) {
    console.error("LEAD_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Data belum berhasil disimpan.",
      },
      { status: 500 }
    );
  }
}
