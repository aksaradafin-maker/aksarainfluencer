import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const s = (v: unknown, n: number) =>
  typeof v === "string" ? v.slice(0, n) : null;

export async function POST(req: Request) {
  try {
    const b = await req.json();

    await supabaseAdmin.from("cta_clicks").insert({
      id: `cta_${randomUUID().replace(/-/g, "").slice(0, 16)}`,
      spot: s(b.spot, 80),
      utm_source: s(b.utm_source, 80),
      utm_medium: s(b.utm_medium, 80),
      utm_campaign: s(b.utm_campaign, 120),
      utm_content: s(b.utm_content, 120),
    });
  } catch (error) {
    console.error("CTA_TRACK_ERROR:", error);
  }

  return new Response(null, { status: 204 });
}
