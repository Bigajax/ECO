    import { supabase } from './supabaseClient';

    /**
     * @typedef {object} MemoryData
     * @property {string} usuario_id
     * @property {string} conteudo
     * @property {string | null} sentimento
     * @property {string | null} resumo_eco
     * @property {string | null} emocao_principal
     * @property {number | null} intensidade
     */

    /**
     * Salva uma mensagem na tabela 'memorias' do Supabase.
     *
     * @param {MemoryData} memoryData - Os dados da memória a serem salvos.
     * @returns {Promise<boolean>} - `true` se a mensagem for salva com sucesso, `false` caso contrário.
     */
    export const salvarMensagemComMemoria = async (memoryData) => {
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
    
