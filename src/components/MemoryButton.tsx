import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface MemoryButtonProps {
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const seryldaBlue = '#6495ED';
const white = '#FFFFFF';

const MemoryButton: React.FC<MemoryButtonProps> = ({
    onClick,
    size = 'md',
    className = '',
}) => {
    const [showMessage, setShowMessage] = useState(false);

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000); // A mensagem desaparece após 3 segundos
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
