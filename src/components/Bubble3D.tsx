import React, { useEffect, useRef } from 'react';
import './bubble3d.css'; // Certifique-se de ter o CSS abaixo nesse arquivo

const Bubble3D: React.FC = () => {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble) return;

    let animationFrame: number;

    const animate = () => {
      const time = Date.now() * 0.001;
      const floatY = Math.sin(time) * 5;
      const scale = 1 + Math.sin(time * 1.5) * 0.01;

      bubble.style.transform = `translateY(${floatY}px) scale(${scale})`;

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="bubble-container">
      <div ref={bubbleRef} className="bubble-glass" />
    </div>
  );
};

export default Bubble3D;
