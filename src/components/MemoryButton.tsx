// Arquivo: src/components/MemoryButton/MemoryButton.tsx
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface MemoryButtonProps {
    onMemoryButtonClick?: () => void; // Renomeamos a prop onClick para onMemoryButtonClick
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const seryldaBlue = '#6495ED';
const white = '#FFFFFF';

const MemoryButton: React.FC<MemoryButtonProps> = ({
    onMemoryButtonClick, // Usamos o novo nome da prop
    size = 'md',
    className = '',
}) => {
    const [showMessage, setShowMessage] = useState(false);

    const handleClick = () => {
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
            if (onMemoryButtonClick) {
                onMemoryButtonClick(); // Chamamos a função de navegação do pai após exibir a mensagem
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
