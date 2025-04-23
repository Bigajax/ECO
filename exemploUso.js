// exemploUso.js
import { supabase } from './src/supabaseClient.js';

async function testarSupabase() {
  const { data, error } = await supabase.from('teste').select('*');
  console.log('data:', data);
  console.log('error:', error);
}

testarSupabase();
