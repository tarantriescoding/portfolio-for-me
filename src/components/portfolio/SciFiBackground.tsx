'use client';

import { useEffect, useRef } from 'react';

function createParticle(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const colors = [
    '16, 185, 129',
    '52, 211, 153',
    '6, 182, 212',
    '56, 189, 248',
    '139, 92, 246',
  ];

  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.5,
    fadeDirection: Math.random() > 0.5 ? 1 : -1,
    color: Math.random() > 0.85 ? colors[4] : colors[Math.floor(Math.random() * 4)],

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5;
      this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
      this.color = Math.random() > 0.85 ? colors[4] : colors[Math.floor(Math.random() * 4)];
    },

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeDirection * 0.003;
      if (this.opacity <= 0.05) this.fadeDirection = 1;
      if (this.opacity >= 0.5) this.fadeDirection = -1;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    },

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
      if (this.size > 1.2) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity * 0.1})`;
        ctx.fill();
      }
    },
  };
}

function createGridLine(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  return {
    y: Math.random() * canvas.height,
    speed: Math.random() * 0.2 + 0.05,
    opacity: Math.random() * 0.04 + 0.01,
    length: Math.random() * 300 + 100,

    reset() {
      this.y = Math.random() * canvas.height;
      this.speed = Math.random() * 0.2 + 0.05;
      this.opacity = Math.random() * 0.04 + 0.01;
      this.length = Math.random() * 300 + 100;
    },

    update() {
      this.y += this.speed;
      if (this.y > canvas.height) {
        this.y = -10;
        this.opacity = Math.random() * 0.04 + 0.01;
      }
    },

    draw() {
      ctx.beginPath();
      const startX = Math.random() * canvas.width * 0.5;
      ctx.moveTo(startX, this.y);
      ctx.lineTo(startX + this.length, this.y);
      ctx.strokeStyle = `rgba(16, 185, 129, ${this.opacity})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    },
  };
}

function createDataStream(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const chars = '01アイウエオカキクケコ><{}[]|/\\=+*&^%$#@!~'.split('');

  return {
    x: Math.random() * canvas.width,
    y: -Math.random() * 500,
    speed: Math.random() * 2 + 0.5,
    length: Math.random() * 20 + 5,
    opacity: Math.random() * 0.15 + 0.02,

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -Math.random() * 500;
      this.speed = Math.random() * 2 + 0.5;
      this.length = Math.random() * 20 + 5;
      this.opacity = Math.random() * 0.15 + 0.02;
    },

    update() {
      this.y += this.speed;
      if (this.y > canvas.height + 100) {
        this.reset();
      }
    },

    draw() {
      ctx.font = '10px monospace';
      for (let i = 0; i < this.length; i++) {
        const charY = this.y - i * 14;
        if (charY < 0 || charY > canvas.height) continue;
        const charOpacity = this.opacity * (1 - i / this.length);
        ctx.fillStyle = `rgba(16, 185, 129, ${charOpacity})`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], this.x, charY);
      }
    },
  };
}

export function SciFiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: ReturnType<typeof createParticle>[] = [];
    const gridLines: ReturnType<typeof createGridLine>[] = [];
    const dataStreams: ReturnType<typeof createDataStream>[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize entities
    const particleCount = Math.min(80, Math.floor(canvas.width / 15));
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(canvas, ctx));
    }
    for (let i = 0; i < 15; i++) {
      gridLines.push(createGridLine(canvas, ctx));
    }
    for (let i = 0; i < 5; i++) {
      dataStreams.push(createDataStream(canvas, ctx));
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.015)';
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Grid intersections
      ctx.fillStyle = 'rgba(16, 185, 129, 0.03)';
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      dataStreams.forEach((s) => { s.update(); s.draw(); });
      gridLines.forEach((g) => { g.update(); g.draw(); });
      particles.forEach((p) => { p.update(); p.draw(); });
      drawConnections();

      animationId = requestAnimationFrame(animate);
    };
    animate();

    const resizeInterval = setInterval(() => {
      const newHeight = document.documentElement.scrollHeight;
      if (Math.abs(canvas.height - newHeight) > 100) {
        canvas.height = newHeight;
      }
    }, 2000);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(resizeInterval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.8 }}
      />

      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="scan-beam" />
        <div className="absolute inset-0 scanline-overlay" />

        <div
          className="absolute animate-float-slow"
          style={{
            top: '10%', left: '-5%', width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute animate-float-medium"
          style={{
            top: '40%', right: '-8%', width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.04) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute animate-float-slow"
          style={{
            bottom: '5%', left: '20%', width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.03) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(45px)',
          }}
        />
        <div
          className="absolute animate-float-fast"
          style={{
            top: '65%', left: '50%', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(35px)',
          }}
        />
      </div>
    </>
  );
}
