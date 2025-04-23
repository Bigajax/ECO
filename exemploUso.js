// exemploUso.js
import { supabase } from './supabaseClient.js';

async function testarConexao() {
  const { data, error } = await supabase.from('mensagens').select('*');

  if (error) {
    console.error('Erro ao conectar ao Supabase:', error.message);
  } else {
    console.log('Conexão bem-sucedida! Dados recebidos:');
    console.log(data);
  }
}

testarConexao();
