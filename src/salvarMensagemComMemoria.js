import { supabase } from './supabaseClient';

interface MemoryData {
    usuario_id: string;
    conteudo: string;
    sentimento: string | null;
    resumo_eco: string | null;
    emocao_principal: string | null;
    intensidade: number | null;
}

export const salvarMensagemComMemoria = async (memoryData: MemoryData) => {
    try {
        const { data, error } = await supabase
            .from('memorias')
            .insert([
                {
                    usuario_id: memoryData.usuario_id,
                    conteudo: memoryData.conteudo,
                    sentimento: memoryData.sentimento,
                    resumo_eco: memoryData.resumo_eco,
                    emocao_principal: memoryData.emocao_principal,
                    intensidade: memoryData.intensidade
                }
            ]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Erro ao salvar memória:", error);
        return false;
    }
};
