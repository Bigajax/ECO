// src/salvarMensagemComMemoria.js
import { supabase } from './supabaseClient';

export async function salvarMensagemComMemoria({
  usuario_id,
  conteudo,
  sentimento,
  resumo_eco,
  emocao_principal,
  intensidade,
  contexto = 'interação', // Valor padrão
  categoria = 'reflexão', // Valor padrão
  salvar_memoria = true
}) {
  try {
    const { data: mensagem, error: erroMensagem } = await supabase
      .from('mensagens')
      .insert([
        {
          usuario_id,
          conteudo,
          data_hora: new Date().toISOString(),
          sentimento,
          salvar_memoria
        }
      ])
      .select()
      .single();

    if (erroMensagem) throw erroMensagem;

    const { data: memoria, error: erroMemoria } = await supabase
      .from('memorias')
      .insert([
        {
          usuario_id,
          mensagem_id: mensagem.id,
          resumo_eco,
          data_registro: new Date().toISOString(),
          emocao_principal,
          intensidade,
          contexto,
          categoria,
          salvar_memoria
        }
      ])
      .select()
      .single();

    if (erroMemoria) throw erroMemoria;

    return { sucesso: true, mensagem, memoria };
  } catch (error: any) {
    console.error('Erro ao salvar:', error.message);
    return { sucesso: false, error: error.message };
  }
}
