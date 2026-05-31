import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  angle: number;
  turnRate: number;
  speed: number;
  baseRadius: number;
  radiusPhase: number;
  radiusAmp: number;
  hue: number;
  hueSpeed: number;
  opacity: number;
  opacityPhase: number;
  t: number;
}

function isDark() {
  return document.documentElement.classList.contains("dark");
}

const LIGHT_HUES = [0, 30, 55, 100, 160, 200, 250, 280, 320, 345, 130, 70];
const DARK_HUES  = [260, 280, 200, 180, 300, 240, 320, 150, 220, 190, 340, 60];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeBlobs(dark: boolean): Blob[] {
  const hues = dark ? DARK_HUES : LIGHT_HUES;
  return Array.from({ length: 12 }, (_, i) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    angle: Math.random() * Math.PI * 2,
    turnRate: rand(-0.012, 0.012),
    speed: dark ? rand(0.3, 1.1) : rand(0.4, 1.4),
    baseRadius: dark ? rand(200, 380) : rand(180, 340),
    radiusPhase: Math.random() * Math.PI * 2,
    radiusAmp: rand(30, 90),
    hue: hues[i % hues.length] + rand(-15, 15),
    hueSpeed: dark ? rand(0.08, 0.35) : rand(0.12, 0.45),
    opacity: dark ? rand(0.28, 0.48) : rand(0.14, 0.26),
    opacityPhase: Math.random() * Math.PI * 2,
    t: Math.random() * 1000,
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
        ctx.fillStyle = "rgba(8, 8, 18, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      for (const b of blobs) {
        b.t += 0.016;

        b.angle += b.turnRate + Math.sin(b.t * 0.7) * 0.006;
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;

        b.hue = (b.hue + b.hueSpeed) % 360;

        const r = b.baseRadius + Math.sin(b.t * 0.9 + b.radiusPhase) * b.radiusAmp;
        const op = b.opacity + Math.sin(b.t * 0.5 + b.opacityPhase) * (b.opacity * 0.3);

        if (b.x < -r * 1.5) b.x = canvas.width + r;
        if (b.x > canvas.width + r * 1.5) b.x = -r;
        if (b.y < -r * 1.5) b.y = canvas.height + r;
        if (b.y > canvas.height + r * 1.5) b.y = -r;

        const sat = dark ? "100%" : "88%";
        const lit = dark ? "58%"  : "65%";

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        grad.addColorStop(0,   `hsla(${b.hue}, ${sat}, ${lit}, ${Math.min(op * 1.4, 1)})`);
        grad.addColorStop(0.4, `hsla(${b.hue}, ${sat}, ${lit}, ${op})`);
        grad.addColorStop(1,   `hsla(${b.hue}, ${sat}, ${lit}, 0)`);

        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
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
