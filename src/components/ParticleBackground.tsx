import { useEffect, useRef } from 'react';
import { useDomain } from '@/contexts/DomainContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  connections: number[];
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { domain } = useDomain();
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 20));
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      connections: [],
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const primaryColor = domain === 'software' ? '77, 163, 255' : '138, 255, 193';
      const secondaryColor = domain === 'software' ? '138, 255, 193' : '77, 163, 255';

      particlesRef.current.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          particle.vx -= (dx / dist) * force * 0.02;
          particle.vy -= (dy / dist) * force * 0.02;
        }

        // Speed limit
        const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
        if (speed > 1.5) {
          particle.vx = (particle.vx / speed) * 1.5;
          particle.vy = (particle.vy / speed) * 1.5;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primaryColor}, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particlesRef.current.slice(i + 1).forEach((other) => {
          const connDx = other.x - particle.x;
          const connDy = other.y - particle.y;
          const connDist = Math.sqrt(connDx * connDx + connDy * connDy);

          if (connDist < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            const opacity = (1 - connDist / 120) * 0.3;
            ctx.strokeStyle = `rgba(${secondaryColor}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw circuit-like patterns for ECE domain
      if (domain === 'ece') {
        ctx.strokeStyle = `rgba(${primaryColor}, 0.1)`;
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
          const startX = Math.random() * canvas.width;
          const startY = Math.random() * canvas.height;
          
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          
          let x = startX;
          let y = startY;
          
          for (let j = 0; j < 3; j++) {
            if (Math.random() > 0.5) {
              x += (Math.random() > 0.5 ? 1 : -1) * 50;
            } else {
              y += (Math.random() > 0.5 ? 1 : -1) * 50;
            }
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [domain]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default ParticleBackground;
