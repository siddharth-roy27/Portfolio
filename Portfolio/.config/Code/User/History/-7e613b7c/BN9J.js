import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Use service_role key for backend
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function ensureTable() {
  // Check if the notes table exists using pg_catalog
  const { data, error } = await supabase
    .from('pg_catalog.pg_tables')
    .select('tablename')
    .eq('schemaname', 'public')
    .eq('tablename', 'notes');

  if (error) {
    console.error('❌ Error checking table:', error.message);
    return false;
  }

  if (data.length === 0) {
    console.log('Table "notes" not found. Creating...');
    const { error: createError } = await supabase.rpc('sql', {
      q: `
        CREATE TABLE IF NOT EXISTS notes (
          id serial PRIMARY KEY,
          title text NOT NULL,
          content text,
          created_at timestamp DEFAULT now()
        );
      `
    });
    if (createError) {
      console.error('❌ Error creating table:', createError.message);
      return false;
    }
    console.log('✅ Table "notes" created.');
  } else {
    console.log('✅ Table "notes" exists.');
  }

  return true;
}

async function main() {
  try {
    const ok = await ensureTable();
    if (!ok) return;

    // Insert a test note
    const { data: insertData, error: insertError } = await supabase
      .from('notes')
      .insert([{ title: 'Hello NoteForge', content: 'This is a test note.' }]);

    if (insertError) console.error('❌ Insert error:', insertError.message);
    else console.log('✅ Note inserted:', insertData);

    // Fetch all notes
    const { data: notes, error: fetchError } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) console.error('❌ Fetch error:', fetchError.message);
    else console.log('✅ Notes fetched:', notes);

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

main();
