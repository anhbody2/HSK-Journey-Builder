import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  hueSpeed: number;
  opacity: number;
}

export function FloatingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const blobs: Blob[] = [];
    const BLOB_COUNT = 7;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initBlobs() {
      blobs.length = 0;
      for (let i = 0; i < BLOB_COUNT; i++) {
        blobs.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: 200 + Math.random() * 200,
          hue: Math.random() * 360,
          hueSpeed: (Math.random() - 0.5) * 0.4,
          opacity: 0.22 + Math.random() * 0.12,
        });
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const b of blobs) {
        b.x += b.vx;
        b.y += b.vy;
        b.hue = (b.hue + b.hueSpeed + 360) % 360;

        if (b.x < -b.radius) b.x = canvas.width + b.radius;
        if (b.x > canvas.width + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = canvas.height + b.radius;
        if (b.y > canvas.height + b.radius) b.y = -b.radius;

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, `hsla(${b.hue}, 90%, 65%, ${b.opacity})`);
        grad.addColorStop(1, `hsla(${b.hue}, 90%, 65%, 0)`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    initBlobs();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
