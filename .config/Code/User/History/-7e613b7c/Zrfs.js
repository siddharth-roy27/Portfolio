import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Load .env

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Create notes table if it doesn't exist
async function createNotesTable() {
  const { error } = await supabase.rpc('sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS notes (
        id serial PRIMARY KEY,
        title text NOT NULL,
        content text,
        created_at timestamp default now()
      );
    `
  });

  if (error) console.error('❌ Error creating table:', error.message);
  else console.log('✅ Table "notes" ready');
}

// Insert a test note
async function insertNote(title, content) {
  const { data, error } = await supabase.from('notes').insert({ title, content });
  if (error) console.error('❌ Insert error:', error.message);
  else console.log('✅ Note inserted:', data);
}

// Fetch all notes
async function fetchNotes() {
  const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
  if (error) console.error('❌ Fetch error:', error.message);
  else console.log('✅ Notes fetched:', data);
}

async function main() {
  await createNotesTable();
  await insertNote('Hello NoteForge', 'This is a test note.');
  await fetchNotes();
}

main();
