import { useEffect, useRef, useMemo } from 'react';

interface StarryBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export default function StarryBackground({ children, className = '' }: StarryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aurorasRef = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Color palette from Galdiive album art
    const colors = [
      '#FF6B35',
      '#FF4D4D',
      '#FFB347',
      '#FF8C42',
      '#D4AF37',
      '#FFFFFF',
    ];

    // Create stars with gentle movement
    const stars: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      opacity: number;
      color: string;
      twinkleSpeed: number;
      twinkleOffset: number;
      moveSpeed: number;
      moveOffset: number;
    }> = [];

    const initStars = () => {
      stars.length = 0;
      const starCount = 150; // Reduced from 300

      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size: Math.random() * 1 + 0.3, // Smaller stars
          opacity: Math.random() * 0.3 + 0.2, // More subtle
          color: colors[Math.floor(Math.random() * colors.length)],
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
          moveSpeed: Math.random() * 0.003 + 0.001,
          moveOffset: Math.random() * Math.PI * 2
        });
      }
    };

    initStars();

    // Optimization: Create offscreen canvas for noise and auroras
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 100;
    noiseCanvas.height = 100;
    const noiseCtx = noiseCanvas.getContext('2d');
    if (noiseCtx) {
      const imageData = noiseCtx.createImageData(100, 100);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const n = Math.random() * 20;
        imageData.data[i] = n;
        imageData.data[i + 1] = n;
        imageData.data[i + 2] = n;
        imageData.data[i + 3] = 255;
      }
      noiseCtx.putImageData(imageData, 0, 0);
    }
    const noisePattern = ctx.createPattern(noiseCanvas, 'repeat');

    // Optimization: Pre-draw aurora brush segments
    const auroraColors = ['#4A5568', '#5B6B8C', '#6B4654', '#8B5A6B', '#3D4E6B'];
    const auroraSegments = auroraColors.map(color => {

      const offCanvas = document.createElement('canvas');
      offCanvas.width = 200;
      offCanvas.height = 400;
      const offCtx = offCanvas.getContext('2d');
      if (offCtx) {
        const grad = offCtx.createLinearGradient(0, 0, 0, 400);
        grad.addColorStop(0, color + '00');
        grad.addColorStop(0.5, color + '33');
        grad.addColorStop(1, color + '00');
        offCtx.fillStyle = grad;
        offCtx.fillRect(0, 0, 200, 400);
      }
      return offCanvas;
    });

    // --- MISING DECLARATIONS RESTORED ---
    const auroras: Array<{
      x: number; y: number; width: number; height: number;
      rotation: number; opacity: number; color: string;
      speed: number; waveOffset: number;
    }> = [];

    const createAurora = () => {
      auroras.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: Math.random() * 400 + 300,
        height: Math.random() * 500 + 400,
        rotation: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.08 + 0.03,
        color: auroraColors[Math.floor(Math.random() * auroraColors.length)],
        speed: Math.random() * 0.0005 + 0.0002,
        waveOffset: Math.random() * Math.PI * 2
      });
    };

    for (let i = 0; i < 4; i++) createAurora();

    const comets: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; life: number; maxLife: number;
    }> = [];

    const createComet = () => {
      const x = Math.random() * canvas.width;
      const y = -100;
      const speed = 2;
      comets.push({
        x, y, vx: (Math.random() - 0.5) * speed, vy: speed,
        size: Math.random() * 2 + 1.5,
        life: 0, maxLife: 300
      });
    };

    let cometTimer = 0;
    const cometInterval = 420;
    let time = 0;
    // ------------------------------------

    const animate = () => {
      // Use a slightly darker background to support the "light and creative" feel with contrast
      ctx.fillStyle = '#05050f'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw noise once using pattern
      if (noisePattern) {
        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = noisePattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      time++;

      // Draw auroras using pre-rendered segments (no blur filter in loop)
      auroras.forEach((aurora, idx) => {
        ctx.save();
        aurora.x += Math.sin(time * aurora.speed + aurora.waveOffset) * 0.2;
        aurora.y += Math.cos(time * aurora.speed + aurora.waveOffset * 0.7) * 0.1;
        
        if (aurora.x > canvas.width + aurora.width) aurora.x = -aurora.width;
        if (aurora.x < -aurora.width) aurora.x = canvas.width + aurora.width;
        
        ctx.translate(aurora.x, aurora.y);
        ctx.rotate(aurora.rotation);
        ctx.globalAlpha = aurora.opacity;
        
        const segment = auroraSegments[idx % auroraSegments.length];
        ctx.drawImage(segment, -aurora.width/2, -aurora.height/2, aurora.width, aurora.height);
        ctx.restore();
      });

      // Draw stars (circular simple shapes)
      ctx.save();
      stars.forEach(star => {
        star.baseX += 0.02; // Reduced drift speed for "airy" feel
        if (star.baseX > canvas.width) star.baseX = 0;
        
        const moveX = Math.sin(time * star.moveSpeed + star.moveOffset) * 0.5;
        const moveY = Math.cos(time * star.moveSpeed + star.moveOffset * 1.3) * 0.5;
        
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.2 + 0.8;
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.fillStyle = star.color;
        
        ctx.beginPath();
        ctx.arc(star.baseX + moveX, star.baseY + moveY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Optimize comet drawing
      cometTimer++;
      if (cometTimer > cometInterval) {
        createComet();
        cometTimer = 0;
      }

      comets.forEach((comet, i) => {
        comet.life++;
        comet.x += comet.vx;
        comet.y += comet.vy;
        
        ctx.save();
        ctx.globalAlpha = 1 - (comet.life / comet.maxLife);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (comet.life > comet.maxLife) comets.splice(i, 1);
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setCanvasSize();
      initStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`relative w-full min-h-screen overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: '#05050f',
          filter: 'blur(30px)' // Move blur filter to static CSS for performance
        }}
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}