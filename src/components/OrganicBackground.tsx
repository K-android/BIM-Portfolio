import React, { useEffect, useRef } from 'react';

export const OrganicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;
      angle: number;
      speed: number;
      currentAlpha: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 1.5 + 0.5;
        this.density = (Math.random() * 30) + 1;
        this.angle = Math.random() * 360;
        this.speed = Math.random() * 0.01 + 0.005;
        this.currentAlpha = 0.5;
      }

      draw() {
        ctx!.fillStyle = `rgba(59, 130, 246, ${this.currentAlpha})`;
        if (this.currentAlpha > 0.5) {
          ctx!.shadowBlur = 15;
          ctx!.shadowColor = 'rgba(59, 130, 246, 0.8)';
        } else {
          ctx!.shadowBlur = 0;
        }
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.closePath();
        ctx!.fill();
        ctx!.shadowBlur = 0; // reset for lines
      }

      update() {
        // Organic drifting
        this.angle += this.speed;
        this.baseX += Math.cos(this.angle) * 0.1;
        this.baseY += Math.sin(this.angle) * 0.1;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        
        const maxDistance = 200;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < maxDistance) {
          this.currentAlpha = 0.5 + (force * 0.5);
          this.x -= directionX;
          this.y -= directionY;
        } else {
          this.currentAlpha = 0.5;
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 30;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 30;
          }
        }
      }
    }

    let particleArray: Particle[] = [];
    const init = () => {
      particleArray = [];
      const numberOfParticles = (width * height) / 10000;
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        particleArray.push(new Particle(x, y));
      }
    };

    init();

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].update();
        particleArray[i].draw();
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    const connect = () => {
      let opacityValue = 1;
      for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
          let dx = particleArray[a].x - particleArray[b].x;
          let dy = particleArray[a].y - particleArray[b].y;
          let distance = dx * dx + dy * dy;

          if (distance < 5000) {
            opacityValue = 1 - (distance / 5000);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue * 0.12})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particleArray[a].x, particleArray[a].y);
            ctx.lineTo(particleArray[b].x, particleArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};
