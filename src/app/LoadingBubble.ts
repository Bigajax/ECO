import React from 'react';
import './LoadingBubble.css';

interface LoadingBubbleProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  className?: string;
}

const LoadingBubble: React.FC<LoadingBubbleProps> = ({ 
  size = 'md',
  label,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`loading-bubble relative rounded-full ${sizeClasses[size]}`}
        aria-label="Loading"
        role="status"
      >
        <div className="bubble-inner absolute inset-0 rounded-full"></div>
      </div>
      {label && (
        <p className="mt-4 text-white/80 font-medium">{label}</p>
      )}
    </div>
  );
};

export default LoadingBubble;
