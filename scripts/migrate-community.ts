import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log('Migrating community tables...');

  try {
    // Add comments column to community_posts
    await sql`ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS comments INTEGER DEFAULT 0;`;

    // Create community_likes table
    await sql`
      CREATE TABLE IF NOT EXISTS community_likes (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
        post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE
      );
    `;

    // Create community_comments table
    await sql`
      CREATE TABLE IF NOT EXISTS community_comments (
        id SERIAL PRIMARY KEY,
        user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
        post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        time TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
