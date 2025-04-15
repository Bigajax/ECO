import React, { useRef, useEffect } from 'react';
const Bubble3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const r = 50 + 10 * Math.sin(t);
      const gradient = ctx.createRadialGradient(width/2, height/2, r * 0.2, width/2, height/2, r);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#94a3b8');

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      t += 0.05;
      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full flex justify-center mb-6">
      <canvas
        ref={canvasRef}
        className="w-32 h-32 md:w-48 md:h-48"
        style={{ filter: 'blur(1px)' }}
      />
    </div>
  );
};

export default Bubble3D;
