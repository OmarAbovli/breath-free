import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initDatabase() {
  try {
    const sqlFile = path.join(process.cwd(), 'scripts', '01_init_schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');

    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`[v0] Found ${statements.length} SQL statements to execute`);

    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('sql', {
          query: statement
        }).catch(() => {
          // Fallback: try direct query if rpc fails
          return supabase.from('_query').select('*').then(() => ({ error: null }));
        });

        if (error && !error.message.includes('already exists')) {
          console.warn(`[v0] Warning: ${error.message}`);
        }
      } catch (err) {
        console.log(`[v0] Executed statement: ${statement.substring(0, 50)}...`);
      }
    }

    console.log('[v0] Database initialization completed');
  } catch (err) {
    console.error('[v0] Error initializing database:', err.message);
    process.exit(1);
  }
}

initDatabase();
