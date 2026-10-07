import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

try {
  process.loadEnvFile(".env.local");
} catch {}

try {
  process.loadEnvFile(".env");
} catch {}

const email = String(process.argv[2] || "").trim().toLowerCase();

if (!email) {
  console.error("Usage: node scripts/make-admin.mjs email@example.com");
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum tersedia.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

try {
  const { data: user, error: findError } = await supabase
    .from("users")
    .select("id,email,role")
    .eq("email", email)
    .maybeSingle();

  if (findError) throw findError;

  if (!user) {
    throw new Error(`User tidak ditemukan: ${email}`);
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({
      role: "admin",
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) throw updateError;

  console.log(`SUCCESS: ${email} sekarang menjadi ADMIN.`);
} catch (error) {
  console.error(
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
}
