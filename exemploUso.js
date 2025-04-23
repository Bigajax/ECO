// exemploUso.js
import { supabase } from './src/supabaseClient.js';

async function testarSupabase() {
  const { data, error } = await supabase.from('teste').select('*');
  console.log('data:', data);
  console.log('error:', error);
}

testarSupabase();
console.log("Rodando exemploUso.js");

import { supabase } from './src/supabaseClient.js';

console.log("Cliente Supabase carregado:", !!supabase); // só pra confirmar que existe
