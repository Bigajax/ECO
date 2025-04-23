// exemploUso.js
import { supabase } from './src/supabaseClient.js';

async function testarSupabase() {
  const { data, error } = await supabase.from('mensagens').select('*');

  if (error) {
    console.error('Erro ao buscar dados:', error.message);
  } else {
    console.log('Dados retornados:', data);
  }
}

testarSupabase();
