// src/salvarMensagemComMemoria.ts
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
```typescript
// src/components/MemoryButton.tsx
import React from 'react';
import * as Lucide from 'lucide-react';

interface MemoryButtonProps {
    onMemoryButtonClick: () => void;
    size?: 'sm' | 'md' | 'lg';
}

const MemoryButton: React.FC<MemoryButtonProps> = ({ onMemoryButtonClick, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24
    };

    return (
        <button
            className={`memory-button ${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
            onClick={onMemoryButtonClick}
            aria-label="Salvar na memória"
        >
            <Lucide.Heart size={iconSizes[size]} className="text-white" />
        </button>
    );
};

export default MemoryButton;
