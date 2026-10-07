import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not configured");
}

if (!serviceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
}

export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export type SalesSettings = {
  current_price: number;
  current_regular_price: number;
  early_bird_price: number;
  next_batch_price: number;
  countdown_enabled: boolean;
  countdown_minutes: number;
  lynk_url: string;
  accent_color: string;
  danger_color: string;
  background_color: string;
  early_bird_status: string;
};

export async function getSalesSettings(): Promise<SalesSettings> {
  const { data, error } = await supabaseAdmin
    .from("sales_settings")
    .select("key,value");

  if (error) {
    throw error;
  }

  const values = Object.fromEntries(
    (data ?? []).map((row) => [String(row.key), String(row.value ?? "")])
  );

  const numberValue = (key: string, fallback: number) => {
    const value = Number(values[key]);
    return Number.isFinite(value) ? value : fallback;
  };

  const booleanValue = (key: string, fallback: boolean) => {
    if (!(key in values)) return fallback;
    return ["1", "true", "yes", "on"].includes(
      String(values[key]).trim().toLowerCase()
    );
  };

  return {
    current_price: numberValue("current_price", 199000),
    current_regular_price: numberValue("current_regular_price", 499000),
    early_bird_price: numberValue("early_bird_price", 99000),
    next_batch_price: numberValue("next_batch_price", 499000),
    countdown_enabled: booleanValue("countdown_enabled", true),
    countdown_minutes: numberValue("countdown_minutes", 30),
    lynk_url: String(
      values.lynk_url || "https://lynk.id/a/1911036127"
    ),
    accent_color: String(values.accent_color || "#FF4D57"),
    danger_color: String(values.danger_color || "#FF5757"),
    background_color: String(values.background_color || "#07090D"),
    early_bird_status: String(values.early_bird_status || "EARLY BIRD"),
  };
}
