
// Arquivo: src/components/MemoryButton/MemoryButton.tsx

import React from 'react';
import { BookOpen } from 'lucide-react';

interface MemoryButtonProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

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
        bg-white/10 backdrop-blur-xl
        transition-all duration-300
        hover:scale-105 active:scale-95
        ${sizeClasses[size]} ${className}
        before:absolute before:inset-0 before:rounded-full
        before:bg-gradient-to-br before:from-white/30 before:to-white/5
        before:opacity-80 before:z-0
      `}
      aria-label="Register memory"
    >
      <BookOpen
        size={iconSizes[size]}
        className="text-white/90 relative z-10"
        strokeWidth={1.25}
      />
    </button>
  );
};

export default MemoryButton;
