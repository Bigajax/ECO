import React from 'react';
import './LoadingBubble.css';

interface LoadingBubbleProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const LoadingBubble: React.FC<LoadingBubbleProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const containerClasses = `flex flex-col items-center justify-center ${className}`;
  const bubbleClasses = `loading-bubble relative rounded-full ${sizeClasses[size]}`;

  return (
    <div className={containerClasses}>
      <div
        className={bubbleClasses}
        aria-label="Loading"
        role="status"
      >
        <div className="bubble-inner absolute inset-0 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingBubble;
