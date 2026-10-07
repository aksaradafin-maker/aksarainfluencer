import { appsScriptPost } from "@/lib/apps-script";

export const runtime = "nodejs";

const s = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : null);

export async function POST(req: Request) {
  try {
    const b = await req.json();

    await appsScriptPost({
      action: "track_cta_click",
      spot: s(b.spot, 80),
      utm_source: s(b.utm_source, 80),
      utm_medium: s(b.utm_medium, 80),
      utm_campaign: s(b.utm_campaign, 120),
      utm_content: s(b.utm_content, 120),
    });
  } catch {}

  return new Response(null, { status: 204 });
}