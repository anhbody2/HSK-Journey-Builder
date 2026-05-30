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

function isDark() {
  return document.documentElement.classList.contains("dark");
}

const LIGHT_HUES = [0, 30, 60, 120, 180, 240, 280, 320];
const DARK_HUES  = [260, 280, 300, 200, 180, 320, 240, 220];

function makeBlobs(dark: boolean): Blob[] {
  const hues = dark ? DARK_HUES : LIGHT_HUES;
  return Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * (dark ? 0.45 : 0.6),
    vy: (Math.random() - 0.5) * (dark ? 0.45 : 0.6),
    radius: (dark ? 220 : 200) + Math.random() * 220,
    hue: hues[i % hues.length] + (Math.random() - 0.5) * 20,
    hueSpeed: (Math.random() - 0.5) * (dark ? 0.25 : 0.4),
    opacity: dark
      ? 0.32 + Math.random() * 0.18
      : 0.18 + Math.random() * 0.12,
  }));
}

export function FloatingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let blobs: Blob[] = makeBlobs(isDark());
    let dark = isDark();

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function draw() {
      if (!canvas || !ctx) return;

      if (dark) {
        ctx.fillStyle = "rgba(10, 10, 20, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      for (const b of blobs) {
        b.x += b.vx;
        b.y += b.vy;
        b.hue = (b.hue + b.hueSpeed + 360) % 360;

        if (b.x < -b.radius) b.x = canvas.width + b.radius;
        if (b.x > canvas.width + b.radius) b.x = -b.radius;
        if (b.y < -b.radius) b.y = canvas.height + b.radius;
        if (b.y > canvas.height + b.radius) b.y = -b.radius;

        const sat  = dark ? "100%" : "85%";
        const lit  = dark ? "55%"  : "68%";

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, `hsla(${b.hue}, ${sat}, ${lit}, ${b.opacity})`);
        grad.addColorStop(1, `hsla(${b.hue}, ${sat}, ${lit}, 0)`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    function onThemeChange() {
      const nowDark = isDark();
      if (nowDark !== dark) {
        dark = nowDark;
        blobs = makeBlobs(dark);
      }
    }

    const observer = new MutationObserver(onThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
      observer.disconnect();
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
