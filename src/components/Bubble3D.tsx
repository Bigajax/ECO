import React, { useEffect, useRef } from 'react';

const Bubble3D: React.FC = () => {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bubble = bubbleRef.current;

    if (!bubble) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / innerWidth;
      const y = (e.clientY - innerHeight / 2) / innerHeight;

      bubble.style.transform = `translate(-50%, -50%) rotateX(${y * 10}deg) rotateY(${x * 10}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={bubbleRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(173,216,230,0.3), rgba(200, 160, 255, 0.4))',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.2), inset 0 0 40px rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        animation: 'float 6s ease-in-out infinite, pulse 4s ease-in-out infinite',
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.2s ease-out',
      }}
    />
  );
};

export default Bubble3D;
