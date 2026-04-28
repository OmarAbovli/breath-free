import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log('Migrating user settings columns...');

  try {
    await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EGP';`;
    await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT TRUE;`;
    await sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'dark';`;

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
