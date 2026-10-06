import mysql from "mysql2/promise";
import crypto from "node:crypto";
import readline from "node:readline";

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/make-admin.mjs email@example.com");
  process.exitCode = 1;
} else {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "creator_studio",
  });

  const [result] = await db.execute(
    `
      UPDATE users
      SET role = 'admin'
      WHERE email = ?
    `,
    [email]
  );

  const affected = result.affectedRows || 0;

  if (!affected) {
    console.error(`User tidak ditemukan: ${email}`);
    console.error("Pastikan user sudah register terlebih dahulu.");
    await db.end();
    process.exitCode = 1;
  } else {
    console.log(`SUCCESS: ${email} sekarang menjadi ADMIN.`);
    await db.end();
  }
}