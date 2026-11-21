"use client";

import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; dx: number; dy: number; vx: number; vy: number; heat: number };

export function FooterWordmark() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const stencil = document.createElement("canvas");
    const ink = stencil.getContext("2d", { willReadFrequently: true });
    if (!ctx || !ink) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let dots: Dot[] = [];
    let frame = 0, last = 0, radius = 2, width = 1, height = 1;
    let previous: { x: number; y: number } | null = null;
    function paint() {
      if (!ctx) return;
      // Clear the full backing bitmap, including fractional-DPR edge pixels.
      ctx.save();
      ctx.resetTransform();
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
      for (const d of dots) {
        const t = Math.min(1, d.heat);
        ctx.fillStyle = t < .015 ? "#241607" : `rgb(${36+Math.round(219*t)},${22+Math.round(217*t)},${7+Math.round(187*t)})`;
        ctx.beginPath();
        ctx.arc(d.x+d.dx, d.y+d.dy, radius, 0, Math.PI*2);
        ctx.fill();
      }
    }
    function tick(now: number) {
      const step = Math.min(2, (now-last)/16.67);
      last = now;
      let moving = false;
      for (const d of dots) {
        d.vx = (d.vx - d.dx*.045*step)*Math.pow(.84,step);
        d.vy = (d.vy - d.dy*.045*step)*Math.pow(.84,step);
        d.dx += d.vx*step;
        d.dy += d.vy*step;
        d.heat *= Math.pow(.96,step);
        if (Math.abs(d.dx)+Math.abs(d.dy)+Math.abs(d.vx)+Math.abs(d.vy)+d.heat > .03) moving = true;
      }
      paint();
      frame = moving ? requestAnimationFrame(tick) : 0;
    }
    function layout() {
      if (!canvas || !ink || !ctx) return;
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      const ratio = Math.min(2, devicePixelRatio);
      canvas.width = Math.round(width*ratio);
      canvas.height = Math.round(height*ratio);
      ctx.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);
      stencil.width = width;
      stencil.height = height;
      const lines = ["NOTTAM", "INFOTECH"];
      ink.font = "900 100px Arial";
      const longest = Math.max(...lines.map(line => ink.measureText(line).width));
      const size = Math.min(width*.96*100/longest, height*.99/lines.length);
      ink.font = `900 ${size}px Arial`;
      ink.textAlign = "center";
      const cap = ink.measureText("H").actualBoundingBoxAscent;
      lines.forEach((line,i) => ink.fillText(line,width/2,height/2+cap/2+(i-(lines.length-1)/2)*size));
      const mask = ink.getImageData(0,0,width,height).data;
      const pitch = Math.max(3, Math.round(size / 30));
      radius = pitch * 0.45;
      dots = [];
      for(let y=pitch; y<height; y+=pitch) for(let x=pitch; x<width; x+=pitch) {
        if(mask[(y*width+x)*4+3]>100) dots.push({x,y,dx:0,dy:0,vx:0,vy:0,heat:0});
      }
      previous = null;
      paint();
      canvas.dataset.ready = "true";
    }
    function interact(e: PointerEvent) {
      if (!canvas || motion.matches) return;
      const box = canvas.getBoundingClientRect();
      const x = e.clientX-box.left, y = e.clientY-box.top;
      const start = previous ?? {x,y};
      const sx = x-start.x, sy = y-start.y;
      const reach = Math.min(105, width*.15);
      for(const d of dots) {
        const fraction = Math.max(0,Math.min(1,((d.x-start.x)*sx+(d.y-start.y)*sy)/(sx*sx+sy*sy || 1)));
        const ax = d.x-start.x-fraction*sx, ay = d.y-start.y-fraction*sy;
        const distance = Math.hypot(ax,ay);
        if(distance >= reach) continue;
        const push = (1-distance/reach)*8;
        d.vx = Math.max(-16, Math.min(16,d.vx+push*ax/(distance || 1)));
        d.vy = Math.max(-16, Math.min(16,d.vy+push*ay/(distance || 1)));
        d.heat = 1;
      }
      previous = {x,y};
      if(!frame) { last = performance.now(); frame = requestAnimationFrame(tick); }
    }
    const reset = () => { previous = null; };
    const observer = new ResizeObserver(layout);
    observer.observe(canvas);
    layout();
    canvas.addEventListener("pointermove", interact);
    canvas.addEventListener("pointerdown", interact);
    canvas.addEventListener("pointerleave", reset);
    canvas.addEventListener("pointercancel", reset);
    canvas.addEventListener("pointerup", reset);
    motion.addEventListener("change", layout);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      motion.removeEventListener("change", layout);
      canvas.removeEventListener("pointermove", interact);
      canvas.removeEventListener("pointerdown", interact);
      canvas.removeEventListener("pointerleave", reset);
      canvas.removeEventListener("pointercancel", reset);
      canvas.removeEventListener("pointerup", reset);
    };
  }, []);
  return <div className="footer-signature" role="img" aria-label="NOTTAM INFOTECH">
    <canvas ref={ref} aria-hidden="true" />
    <span aria-hidden="true">NOTTAM INFOTECH</span>
  </div>;
}
