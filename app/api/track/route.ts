import { db } from "@/lib/db";

export const runtime = "nodejs";

let ready = false;
const s = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : null);

export async function POST(req: Request) {
  try {
    const b = await req.json();

    if (!ready) {
      await db.query(
        "CREATE TABLE IF NOT EXISTS cta_clicks (" +
          "id INT AUTO_INCREMENT PRIMARY KEY, spot VARCHAR(80), " +
          "utm_source VARCHAR(80), utm_medium VARCHAR(80), " +
          "utm_campaign VARCHAR(120), utm_content VARCHAR(120), " +
          "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
      );
      ready = true;
    }

    await db.query(
      "INSERT INTO cta_clicks (spot, utm_source, utm_medium, utm_campaign, utm_content) VALUES (?,?,?,?,?)",
      [s(b.spot, 80), s(b.utm_source, 80), s(b.utm_medium, 80), s(b.utm_campaign, 120), s(b.utm_content, 120)]
    );
  } catch {}

  return new Response(null, { status: 204 });
}