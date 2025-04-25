import React from 'react';
import { BookOpen } from 'lucide-react';

interface MemoryButtonProps {
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const seryldaBlue = '#6495ED';
const quartzPink = '#F7CAC9';

const MemoryButton: React.FC<MemoryButtonProps> = ({
    onClick,
    size = 'md',
    className = '',
}) => {
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
        <button
            onClick={onClick}
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
            aria-label="Register memory"
        >
            <BookOpen
                size={iconSizes[size]}
                className="relative z-10"
                strokeWidth={1.25}
                color={quartzPink}
            />
        </button>
    );
};

export default MemoryButton;
