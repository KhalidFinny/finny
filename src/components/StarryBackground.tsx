'use client';

import { useEffect, useRef } from 'react';

interface StarryBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export default function StarryBackground({ children, className = '' }: StarryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Create canvas noise texture
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = 200;
    noiseCanvas.height = 200;
    const noiseCtx = noiseCanvas.getContext('2d');
    
    if (noiseCtx) {
      const imageData = noiseCtx.createImageData(200, 200);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 15;
        imageData.data[i] = noise;
        imageData.data[i + 1] = noise;
        imageData.data[i + 2] = noise;
        imageData.data[i + 3] = 255;
      }
      noiseCtx.putImageData(imageData, 0, 0);
    }

    // Comet system
    const comets: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      trail: Array<{ x: number; y: number; opacity: number }>;
    }> = [];

    // Aurora system
    const auroras: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
      opacity: number;
      color: string;
      speed: number;
      waveOffset: number;
    }> = [];

    const createAurora = () => {
      const colors = ['#4A5568', '#5B6B8C', '#6B4654', '#8B5A6B', '#3D4E6B']; // Blue-grey and faded red tones
      auroras.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: Math.random() * 400 + 300,
        height: Math.random() * 500 + 400,
        rotation: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.08 + 0.03, // Much more subtle
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.0005 + 0.0002,
        waveOffset: Math.random() * Math.PI * 2
      });
    };

    // Create initial auroras
    for (let i = 0; i < 4; i++) {
      createAurora();
    }

    const createComet = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      let targetX, targetY;

      switch(side) {
        case 0: // Top to bottom
          x = Math.random() * canvas.width;
          y = -100;
          targetX = Math.random() * canvas.width;
          targetY = canvas.height + 100;
          break;
        case 1: // Right to left
          x = canvas.width + 100;
          y = Math.random() * canvas.height;
          targetX = -100;
          targetY = Math.random() * canvas.height;
          break;
        case 2: // Left to right
          x = -100;
          y = Math.random() * canvas.height;
          targetX = canvas.width + 100;
          targetY = Math.random() * canvas.height;
          break;
        default: // Diagonal top-right to bottom-left
          x = canvas.width + 100;
          y = -100;
          targetX = -100;
          targetY = canvas.height + 100;
      }

      const dx = targetX - x;
      const dy = targetY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 2; // Slower speed

      vx = (dx / distance) * speed;
      vy = (dy / distance) * speed;

      comets.push({
        x,
        y,
        vx,
        vy,
        size: Math.random() * 2 + 1.5,
        life: 0,
        maxLife: Math.ceil(distance / speed) + 30, // Adjusted for slower speed
        trail: []
      });
    };

    let cometTimer = 0;
    const cometInterval = 420; // Comet appears every ~7 seconds at 60fps

    let time = 0;
    let textureOffsetX = 0;
    let textureOffsetY = 0;

    const animate = () => {
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle moving texture
      if (noiseCanvas) {
        ctx.globalAlpha = 0.03;
        textureOffsetX += 0.1;
        textureOffsetY += 0.05;
        
        for (let x = -200; x < canvas.width + 200; x += 200) {
          for (let y = -200; y < canvas.height + 200; y += 200) {
            ctx.drawImage(
              noiseCanvas,
              x + (textureOffsetX % 200),
              y + (textureOffsetY % 200)
            );
          }
        }
        ctx.globalAlpha = 1;
      }

      time++;

      // Draw faded auroras with painted brush strokes
      auroras.forEach((aurora, index) => {
        ctx.save();
        
        // Slow drift movement
        aurora.x += Math.sin(time * aurora.speed + aurora.waveOffset) * 0.3;
        aurora.y += Math.cos(time * aurora.speed + aurora.waveOffset * 0.7) * 0.2;
        aurora.rotation += aurora.speed * 0.3;
        
        // Wrap around
        if (aurora.x > canvas.width + aurora.width) aurora.x = -aurora.width;
        if (aurora.x < -aurora.width) aurora.x = canvas.width + aurora.width;
        if (aurora.y > canvas.height + aurora.height) aurora.y = -aurora.height;
        if (aurora.y < -aurora.height) aurora.y = canvas.height + aurora.height;
        
        ctx.translate(aurora.x, aurora.y);
        ctx.rotate(aurora.rotation);
        
        // Create painted brush stroke effect with multiple overlapping shapes
        const brushStrokes = 6;
        for (let i = 0; i < brushStrokes; i++) {
          const offset = (i / brushStrokes) * aurora.width * 0.4;
          const strokeWidth = aurora.width * (1 - i / brushStrokes * 0.6);
          const strokeHeight = aurora.height * (0.7 + Math.sin(time * 0.01 + i) * 0.2);
          
          const gradient = ctx.createRadialGradient(
            offset, 0, 0,
            offset, 0, strokeWidth
          );
          
          const opacityHex = Math.floor(aurora.opacity * (1 - i / brushStrokes * 0.8) * 255)
            .toString(16)
            .padStart(2, '0');
          
          gradient.addColorStop(0, aurora.color + opacityHex);
          gradient.addColorStop(0.3, aurora.color + Math.floor(parseInt(opacityHex, 16) * 0.5).toString(16).padStart(2, '0'));
          gradient.addColorStop(0.7, aurora.color + '05');
          gradient.addColorStop(1, aurora.color + '00');
          
          ctx.fillStyle = gradient;
          ctx.filter = 'blur(60px)';
          ctx.fillRect(
            offset - strokeWidth / 2,
            -strokeHeight / 2,
            strokeWidth,
            strokeHeight
          );
        }
        
        ctx.filter = 'none';
        ctx.restore();
      });

      // Draw twinkling and slowly drifting stars
      stars.forEach(star => {
        // Very gentle floating movement
        const moveX = Math.sin(time * star.moveSpeed + star.moveOffset) * 1.5;
        const moveY = Math.cos(time * star.moveSpeed + star.moveOffset * 1.3) * 1.5;
        
        // Slow continuous drift
        star.baseX += 0.05;
        star.baseY += 0.02;
        
        // Wrap around screen
        if (star.baseX > canvas.width + 10) star.baseX = -10;
        if (star.baseX < -10) star.baseX = canvas.width + 10;
        if (star.baseY > canvas.height + 10) star.baseY = -10;
        if (star.baseY < -10) star.baseY = canvas.height + 10;
        
        star.x = star.baseX + moveX;
        star.y = star.baseY + moveY;

        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity * twinkle;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Comet spawning
      cometTimer++;
      if (cometTimer > cometInterval) {
        createComet();
        cometTimer = 0;
      }

      // Update and draw comets
      for (let i = comets.length - 1; i >= 0; i--) {
        const comet = comets[i];
        
        comet.life++;
        comet.x += comet.vx;
        comet.y += comet.vy;

        // Add to trail
        comet.trail.push({ 
          x: comet.x, 
          y: comet.y, 
          opacity: 1 
        });

        if (comet.trail.length > 25) {
          comet.trail.shift();
        }

        // Draw trail
        comet.trail.forEach((point, index) => {
          const trailOpacity = (index / comet.trail.length) * 0.8;
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, comet.size * 2
          );
          
          gradient.addColorStop(0, `rgba(255, 107, 53, ${trailOpacity})`);
          gradient.addColorStop(0.5, `rgba(255, 140, 66, ${trailOpacity * 0.5})`);
          gradient.addColorStop(1, `rgba(255, 179, 71, 0)`);

          ctx.fillStyle = gradient;
          ctx.globalAlpha = 1;
          ctx.fillRect(
            point.x - comet.size * 2,
            point.y - comet.size * 2,
            comet.size * 4,
            comet.size * 4
          );
        });

        // Draw comet head
        const headGradient = ctx.createRadialGradient(
          comet.x, comet.y, 0,
          comet.x, comet.y, comet.size * 3
        );
        headGradient.addColorStop(0, '#FFFFFF');
        headGradient.addColorStop(0.3, '#FFB347');
        headGradient.addColorStop(1, 'rgba(255, 107, 53, 0)');

        ctx.fillStyle = headGradient;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Remove comets that completed their journey
        if (comet.life > comet.maxLife) {
          comets.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
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
        style={{ background: '#0a0a1a' }}
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}