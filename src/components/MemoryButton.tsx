import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { salvarMensagemComMemoria } from '../../salvarMensagemComMemoria'; // Importe a função
import { usuarioService } from '../../usuarioService';

interface MemoryButtonProps {
    onMemoryButtonClick?: (memoryData: MemoryData) => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    conteudo: string; // Adicionando a prop conteudo
}

interface MemoryData {
    usuario_id: string;
    conteudo: string;
    sentimento: string | null;
    resumo_eco: string | null;
    emocao_principal: string | null;
    intensidade: number | null;
}

const seryldaBlue = '#6495ED';
const white = '#FFFFFF';

const MemoryButton: React.FC<MemoryButtonProps> = ({
    onMemoryButtonClick,
    size = 'md',
    className = '',
    conteudo, // Usando a prop conteudo
}) => {
    const [showMessage, setShowMessage] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const getUserId = async () => {
            try {
                //Obtém o ID do usuário logado.
                const id = await usuarioService.obterIdUsuario();
                setUserId(id);
            } catch (error) {
                console.error("Erro ao obter ID do usuário:", error);
                // Tratar o erro (exibir mensagem, redirecionar, etc.)
            }
        };
        getUserId();
    }, []);

    const handleClick = () => {
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
            if (onMemoryButtonClick && userId) {
                // Criar objeto memoryData
                const memoryData: MemoryData = {
                    usuario_id: userId,
                    conteudo: conteudo,
                    sentimento: null,  // Preencha com os dados reais se disponíveis
                    resumo_eco: null,     // Preencha com os dados reais se disponíveis
                    emocao_principal: null, // Preencha com os dados reais se disponíveis
                    intensidade: null,    // Preencha com os dados reais se disponíveis
                };
                // Chama a função para salvar a mensagem com memória
                salvarMensagemComMemoria(memoryData)
                    .then(() => {
                        onMemoryButtonClick(memoryData); // Passa os dados para o componente pai
                    })
                    .catch(error => {
                        console.error("Erro ao salvar memória:", error);
                        // Tratar o erro (exibir mensagem, redirecionar, etc.)
                    });
            }
        }, 3000);
    };

    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-20 h-20',
    };

    const iconSizes = {
        sm: 20,
        md: 24,
        lg: 32,
    };

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                className={`
                    relative rounded-full flex items-center justify-center
                    transition-all duration-300
                    hover:scale-105 active:scale-95
                    ${sizeClasses[size]} ${className}
                    before:absolute before:inset-0 before:rounded-full
                    before:bg-gradient-to-br before:opacity-80 before:z-0
                `}
                style={{
                    backgroundColor: seryldaBlue,
                }}
                aria-label="Registrar memória"
            >
                <BookOpen
                    size={iconSizes[size]}
                    className="relative z-10"
                    strokeWidth={1.25}
                    color={white}
                />
            </button>
            {showMessage && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-green-500 text-white text-xs rounded-md p-2 shadow-md">
                    Memória registrada
                </div>
            )}
        </div>
    );
};

export default MemoryButton;
