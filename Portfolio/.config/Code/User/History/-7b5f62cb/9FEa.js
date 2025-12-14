import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('notes').select('*');
  if (error) console.log('❌ Error:', error.message);
  else console.log('✅ Connected:', data);
}

test();
