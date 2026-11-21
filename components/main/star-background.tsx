"use client";

import { useEffect, useRef } from "react";

// Transparent perspective star field. The page's existing warm backdrop shows through.
export function StarsCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1, height = 1, frame = 0, last = 0, angle = 0;
    let seed = 173;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const stars = Array.from({ length: 1100 }, () => ({ x: random() * 4 - 2, y: random() * 4 - 2, z: random() * 4 - 2, size: .35 + random() * .7, opacity: .25 + random() * .65 }));
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cos = Math.cos(angle), sin = Math.sin(angle);
      const focal = Math.max(width, height) * .65;
      for (const star of stars) {
        const x = star.x * cos - star.z * sin;
        const z = star.x * sin + star.z * cos + 2.8;
        const px = width / 2 + x * focal / z;
        const py = height / 2 + star.y * focal / z;
        if (px < -4 || py < -4 || px > width + 4 || py > height + 4) continue;
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
        ctx.beginPath(); ctx.arc(px, py, Math.min(1.8, star.size * 1.5 / z), 0, Math.PI * 2); ctx.fill();
      }
    };
    const tick = (now: number) => {
      if (last) angle += Math.min((now - last) / 1000, .04) * .012;
      last = now; draw();
      frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      cancelAnimationFrame(frame); last = 0;
      if (document.hidden) return;
      draw();
      if (!motion.matches) frame = requestAnimationFrame(tick);
    };
    const observer = new ResizeObserver(() => {
      width = canvas.clientWidth; height = canvas.clientHeight;
      if (!width || !height) return;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      draw();
    });
    observer.observe(canvas);
    motion.addEventListener("change", resume);
    document.addEventListener("visibilitychange", resume);
    resume();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); motion.removeEventListener("change", resume); document.removeEventListener("visibilitychange", resume); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
