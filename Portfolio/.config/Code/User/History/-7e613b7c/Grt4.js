import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  try {
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
