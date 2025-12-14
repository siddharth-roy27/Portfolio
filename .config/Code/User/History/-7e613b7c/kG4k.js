import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config(); // load .env

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function main() {
  try {
    // Attempt to create the notes table (via Supabase SQL editor RPC is not needed)
    // For simplicity, let's check if table exists by selecting
    const { data, error } = await supabase.from('notes').select('*').limit(1);

    if (error && error.code === '42P01') { // table does not exist
      console.log('Table "notes" not found. Please create it in Supabase dashboard.');
      console.log('Use SQL Editor and run:');
      console.log(`
        CREATE TABLE notes (
          id serial PRIMARY KEY,
          title text NOT NULL,
          content text,
          created_at timestamp default now()
        );
      `);
      return;
    }

    console.log('✅ Supabase connected. Notes table exists.');

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
