import { supabase } from './supabaseClient'; // Certifique-se de que o caminho está correto

interface MemoryData {
  usuario_id: string;
  conteudo: string;
  sentimento: string | null;
  resumo_eco: string | null;
  emocao_principal: string | null;
  intensidade: number | null;
}

export const salvarMensagemComMemoria = async (memoryData: MemoryData): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('memories') // Nome da tabela no Supabase
      .insert([memoryData]);

    if (error) {
      console.error("Erro ao inserir memória:", error);
      throw new Error("Falha ao salvar memória"); // Lança erro para ser capturado no componente
    }
    console.log('Dados inseridos com sucesso:', data);
    return true;
  } catch (error) {
    console.error("Erro geral ao salvar memória:", error);
    return false; // Retorna false em caso de erro
  }
};
