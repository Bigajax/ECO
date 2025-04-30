import { supabase } from './supabaseClient'; // Importa a instância do Supabase

/**
 * Salva uma mensagem na tabela 'mensagem'.
 *
 * @param {string} usuario_id - O ID do usuário que enviou a mensagem.
 * @param {string} conteudo - O conteúdo da mensagem.
 * @param {Date} data_hora - A data e hora da mensagem.
 * @param {string | null} sentimento - O sentimento associado à mensagem (opcional).
 * @param {boolean} salvar_memoria - Indica se a mensagem deve ser salva na memória.
 * @returns {Promise<void>} - Uma Promise que resolve quando a mensagem é salva com sucesso, ou rejeita com um erro.
 */
export const salvarMensagem = async (
  usuario_id: string,
  conteudo: string,
  data_hora: Date,
  sentimento: string | null,
  salvar_memoria: boolean
): Promise<void> => {
  try {
    // Insere a mensagem na tabela 'mensagem'
    const { data, error } = await supabase
      .from('mensagem')
      .insert([
        {
          usuario_id,
          conteudo,
          data_hora,
          sentimento,
          salvar_memoria,
        },
      ]);

    if (error) {
      console.error("Erro ao salvar mensagem:", error);
      throw new Error(`Erro ao salvar mensagem: ${error.message}`); // Lança o erro para ser tratado no catch
    }

    console.log("Mensagem salva com sucesso:", data);
    // Se a inserção for bem-sucedida, a Promise resolve sem retornar nada (void)
  } catch (error: any) {
    // Captura erros durante a inserção
    console.error("Erro ao salvar mensagem (catch):", error);
    throw error; // Re-lança o erro para que o código que chamou a função possa tratá-lo
  }
};
