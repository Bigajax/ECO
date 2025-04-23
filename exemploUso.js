console.log("Rodando o exemplo!");

import { supabase } from './src/supabaseClient.js';

async function testarConexao() {
  const { data, error } = await supabase.from('usuarios').select('*');
  
  if (error) {
    console.error("Erro ao buscar dados:", error.message);
  } else {
    console.log("Dados da tabela usuarios:", data);
  }
}

testarConexao();
