import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env' });

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log("Dropping all tables...");
  await sql`DROP TABLE IF EXISTS "account" CASCADE`;
  await sql`DROP TABLE IF EXISTS "session" CASCADE`;
  await sql`DROP TABLE IF EXISTS "verificationToken" CASCADE`;
  await sql`DROP TABLE IF EXISTS "usage_logs" CASCADE`;
  await sql`DROP TABLE IF EXISTS "cravings" CASCADE`;
  await sql`DROP TABLE IF EXISTS "ai_memory" CASCADE`;
  await sql`DROP TABLE IF EXISTS "users" CASCADE`;
  await sql`DROP TABLE IF EXISTS "user" CASCADE`;
  console.log("All tables dropped!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to drop tables!", err);
  process.exit(1);
});
