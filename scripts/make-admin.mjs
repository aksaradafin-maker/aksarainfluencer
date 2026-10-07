import appsScriptClient from "./apps-script-client.cjs";

const { appsScriptPost } = appsScriptClient;

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/make-admin.mjs email@example.com");
  process.exitCode = 1;
} else {
  try {
    const result = await appsScriptPost({ action: "make_admin", email });

    if (!result.success) {
      throw new Error(result.error || `User tidak ditemukan: ${email}`);
    }

    console.log(`SUCCESS: ${email} sekarang menjadi ADMIN.`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}