"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

// Trace the shield so its dark enamel stays solid while the spaces between
// the laurels, crown and lettering show the animated sky.
const shieldOutline = [[350,450],[455,430],[516,426],[584,432],[671,450],[670,698],[654,750],[605,799],[560,834],[511,858],[456,831],[405,795],[365,747],[351,708]];

export function HeroCrest() {
  const host = useRef<HTMLDivElement>(null);
  const bounds = useRef<DOMRect | null>(null);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);

  useEffect(() => {
    const container = host.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      bounds.current = container.getBoundingClientRect();
    });
    observer.observe(container);
    bounds.current = container.getBoundingClientRect();

    let disposed = false;
    const artwork = new Image();
    artwork.onload = () => {
      if (disposed) return;
      const face = document.createElement("canvas");
      face.width = face.height = 1020;
      const ctx = face.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(artwork, 0, 0, 1020, 1020);
      const pixels = ctx.getImageData(0, 0, 1020, 1020);
      ctx.beginPath();
      shieldOutline.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath();
      for (let y = 0; y < 1020; y++) {
        for (let x = 0; x < 1020; x++) {
          const offset = (1020 * y + x) * 4;
          const red = pixels.data[offset];
          if (x < 125 || x > 900 || y < 155 || y > 870) pixels.data[offset + 3] = 0;
          else if (red < 103 && !(x >= 348 && x <= 673 && y >= 425 && y <= 860 && ctx.isPointInPath(x, y))) {
            pixels.data[offset + 3] = Math.max(0, (red - 68) * 255 / 35);
          }
        }
      }
      ctx.putImageData(pixels, 0, 0);
      const gold = ctx.createLinearGradient(0, 882, 0, 936);
      gold.addColorStop(0, "#fff0a8");
      gold.addColorStop(1, "#d6a341");
      ctx.fillStyle = gold;
      ctx.font = "bold 62px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("NOTTAM INFOTECH", face.width / 2, 932, 740);
      setArtworkUrl(face.toDataURL("image/png"));
    };
    artwork.src = "/nottam-logo.jpeg";

    return () => {
      disposed = true;
      observer.disconnect();
      artwork.onload = null;
    };
  }, []);

  const moveReflection = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    const y = Math.max(-1, Math.min(1, 1 - ((event.clientY - rect.top) / rect.height) * 2));
    const element = event.currentTarget;
    element.style.setProperty("--tilt-x", `${-y * 4}deg`);
    element.style.setProperty("--tilt-y", `${x * 6}deg`);
    element.style.setProperty("--light-x", `${(x + 1) * 50}%`);
    element.style.setProperty("--light-y", `${(1 - y) * 50}%`);
  };

  const resetReflection = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    element.style.setProperty("--tilt-x", "0deg");
    element.style.setProperty("--tilt-y", "0deg");
    element.style.setProperty("--light-x", "50%");
    element.style.setProperty("--light-y", "42%");
  };

  const style = {
    "--crest-image": artworkUrl ? `url("${artworkUrl}")` : 'url("/nottam-logo.jpeg")',
  } as CSSProperties;

  return (
    <div
      ref={host}
      role="img"
      aria-label="Nottam InfoTech gold crest"
      className="hero-crest-stage aspect-square w-full max-w-[17rem] md:max-w-[27rem]"
      style={style}
      onPointerMove={moveReflection}
      onPointerLeave={resetReflection}
    >
      <span className="hero-crest-art" aria-hidden="true" />
      <span className="hero-crest-reflection" aria-hidden="true" />
    </div>
  );
}
