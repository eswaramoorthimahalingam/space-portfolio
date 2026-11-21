"use client";

import Image from "next/image";
import { awardShot, BADGES } from "@/lib/turf-rewards";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { getRewards, getServerRewards, saveRewards, subscribeRewards } from "@/lib/turf-reward-store";

type Vec = [number, number, number];

export function TurfGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef({ active: false, phase: "ready", aim: 0, elapsed: 0, flight: 0, target: 0, keeper: 0, shots: 0, goals: 0, points: 0, streak: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const rewards = useSyncExternalStore(subscribeRewards, getRewards, getServerRewards);
  const [round, setRound] = useState({ points: 0, streak: 0 });
  const [saved, setSaved] = useState(true);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [aim, setAim] = useState(0);
  const [score, setScore] = useState({ goals: 0, shots: 0 });
  const [message, setMessage] = useState("Five shots. Find the gap. Beat the keeper.");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let width = 400, height = 460, frame = 0, previous = 0, visible = false;
    const project = ([x, y, z]: Vec) => {
      const scale = Math.min(width * 1.65, height * 1.8) / (z + 8);
      return { x: width / 2 + x * scale, y: height * .25 + (3 - y) * scale, scale };
    };
    const line = (points: Vec[], color: string, weight = 1) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = weight;
      ctx.beginPath();
      points.forEach((point, i) => {
        const p = project(point);
        if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y);
      });
      ctx.stroke();
    };
    const draw = () => {
      const g = game.current;
      ctx.fillStyle = "#090b09";
      ctx.fillRect(0, 0, width, height);
      for (let z = 32; z >= -2; z -= 2) {
        const points: Vec[] = [[-14, 0, z], [14, 0, z], [14, 0, z + 2], [-14, 0, z + 2]];
        ctx.fillStyle = z % 4 === 0 ? "#19251b" : "#1d2b1f";
        ctx.beginPath();
        points.forEach((v, i) => { const p = project(v); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
        ctx.closePath(); ctx.fill();
      }
      line([[-8, 0, -2], [-8, 0, 24], [8, 0, 24], [8, 0, -2]], "#a4945866");
      line([[-6, .01, 14], [-6, .01, 5], [6, .01, 5], [6, .01, 14]], "#d7cb9b88");
      // A projected goal box with back, sides and roof netting.
      for (let x = -3.6; x <= 3.61; x += .4) {
        line([[x, 0, 15.5], [x, 2.4, 15.5], [x, 2.4, 14]], "#c5ba8a33");
      }
      for (let y = 0; y <= 2.41; y += .3) {
        line([[-3.6, y, 14], [-3.6, y, 15.5], [3.6, y, 15.5], [3.6, y, 14]], "#c5ba8a33");
      }
      line([[-3.6, 0, 14], [-3.6, 2.4, 14], [3.6, 2.4, 14], [3.6, 0, 14]], "#f4d47d", 3);
      const k = g.keeper;
      line([[k - .32, 0, 13.7], [k, .8, 13.7], [k + .32, 0, 13.7]], "#ddd9ce", 5);
      line([[k, .7, 13.7], [k, 1.35, 13.7]], "#d6aa45", 12);
      line([[k - .55, 1, 13.7], [k, 1.22, 13.7], [k + .55, 1, 13.7]], "#d6aa45", 5);
      const head = project([k, 1.65, 13.7]);
      ctx.fillStyle = "#edd7aa"; ctx.beginPath(); ctx.arc(head.x, head.y, head.scale * .17, 0, Math.PI * 2); ctx.fill();
      if (g.phase !== "flying") {
        const aimPoint = project([g.aim, .65, 14]);
        ctx.strokeStyle = "#ffdf7b"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(aimPoint.x, aimPoint.y, 8, 0, Math.PI * 2); ctx.stroke();
      }
      const t = g.phase === "ready" ? 0 : Math.min(1, g.flight / .85);
      const ball: Vec = [g.target * t, .22 + Math.sin(t * Math.PI) * 1.2 + t * .45, t * 14];
      const shadow = project([ball[0], .01, ball[2]]);
      ctx.fillStyle = "#0007"; ctx.beginPath(); ctx.ellipse(shadow.x, shadow.y, shadow.scale * .3, shadow.scale * .09, 0, 0, Math.PI * 2); ctx.fill();
      const b = project(ball), radius = b.scale * .22;
      const gradient = ctx.createRadialGradient(b.x - radius * .35, b.y - radius * .4, 0, b.x, b.y, radius);
      gradient.addColorStop(0, "#fff9e7"); gradient.addColorStop(1, "#99896a");
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(b.x, b.y, radius, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#22251d"; ctx.beginPath();
      for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5 + t * 7; const x = b.x + Math.cos(a) * radius * .45, y = b.y + Math.sin(a) * radius * .45; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.closePath(); ctx.fill();
    };
    const tick = (now: number) => {
      frame = 0;
      const dt = previous ? Math.min((now - previous) / 1000, .04) : 0;
      previous = now;
      const g = game.current;
      if (g.active && g.shots < 5) {
        g.elapsed += dt;
        g.keeper = Math.sin(g.elapsed * 1.8) * 2.7;
        if (g.phase === "flying") {
          g.flight += dt;
          if (g.flight >= .85) {
            const goal = Math.abs(g.target - g.keeper) > .65;
            g.shots++; if (goal) g.goals++;
            g.phase = "result";
            const award = awardShot(getRewards(), g.points, g.streak, goal, g.goals, g.shots);
            g.points = award.points; g.streak = award.streak;
            setRound({ points: g.points, streak: g.streak });
            setSaved(saveRewards(award.rewards));
            const rewardMessage = `${award.earned ? ` +${award.earned} points!` : ""}${award.unlocked.length ? ` Unlocked: ${award.unlocked.map(b => b.name).join(", ")}.` : ""}`;
            setScore({ goals: g.goals, shots: g.shots }); setBusy(false);
            setMessage((g.shots === 5 ? `Full time! ${g.goals} goals from 5 shots. Round total: ${g.points} points.` : goal ? "Goal! Pick your next corner." : "Saved! Try the other side.") + rewardMessage);
          }
        }
      }
      draw();
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      cancelAnimationFrame(frame); frame = 0; previous = 0;
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => {
      width = canvas.clientWidth; height = canvas.clientHeight;
      if (!width || !height) return;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0); draw();
    });
    resize.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
    observer.observe(panelRef.current ?? canvas);
    document.addEventListener("visibilitychange", resume);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", resume); };
  }, []);

  const start = () => {
    Object.assign(game.current, { active: true, phase: "ready", aim: 0, elapsed: 0, flight: 0, target: 0, keeper: 0, shots: 0, goals: 0, points: 0, streak: 0 });
    setRound({ points: 0, streak: 0 });
    setActive(true); setBusy(false); setAim(0); setScore({ goals: 0, shots: 0 }); setMessage("Aim left or right, then shoot when you see a gap.");
  };
  const shoot = () => {
    const g = game.current;
    if (!g.active || g.phase === "flying" || g.shots >= 5) return;
    g.target = g.aim; g.flight = 0; g.phase = "flying"; setBusy(true); setMessage("Shot on its way…");
  };
  return (
    <div ref={panelRef} className="overflow-hidden rounded-2xl border border-[#d3b77a]/30 bg-[#100e0a] text-[#f8efd9] shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3"><Image src="/nottam-logo.jpeg" alt="" width={36} height={36} className="rounded" /><div><p className="text-sm font-semibold">BookYourTurf · Kickoff</p><p className="text-[10px] uppercase tracking-widest text-[#d3b77a]">Penalty mini game</p></div></div>
        <p className="whitespace-nowrap font-mono text-sm">{score.goals} goals · {score.shots}/5</p>
      </div>
      <div className="grid grid-cols-3 gap-2 border-b border-white/10 px-5 py-3 text-center">
        {[{ label: "Round points", value: round.points }, { label: "Total points", value: rewards.total }, { label: "Best round", value: rewards.best }].map(item => <div key={item.label}><p className="font-mono text-lg text-[#e5bc60]">{item.value.toLocaleString()}</p><p className="text-[10px] uppercase tracking-wide text-[#a99c81]">{item.label}</p></div>)}
      </div>
      <canvas ref={canvasRef} role="img" aria-label="Perspective football pitch with a moving goalkeeper and ball" className="block aspect-video w-full" />
      <div className="grid gap-5 border-t border-white/10 p-5 md:grid-cols-2">
        <div className="space-y-4">
        <p role="status" aria-live="polite" className="min-h-10 text-sm text-[#e2d6bb]">{message}</p>
        {active && score.shots < 5 && <div><label htmlFor="turf-aim" className="mb-2 flex justify-between text-xs text-[#d3b77a]"><span>Aim left</span><span>Aim right</span></label><input id="turf-aim" aria-label="Shot direction" type="range" min="-3.15" max="3.15" step="0.05" value={aim} disabled={busy} onChange={e => { const value = Number(e.target.value); setAim(value); game.current.aim = value; }} className="h-11 w-full accent-[#e5bc60]" /></div>}
        <button type="button" onClick={!active || score.shots === 5 ? start : shoot} disabled={busy} className="min-h-12 w-full rounded-lg bg-[#e5bc60] px-5 py-3 font-semibold text-[#21180b] transition hover:bg-[#f3d58c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-50">{!active ? "Play penalty challenge" : score.shots === 5 ? "Play again" : busy ? "Shooting…" : "Shoot →"}</button>
        </div>
        <div className="rounded-lg border border-[#d3b77a]/20 p-3">
          <p className="mb-3 text-xs font-semibold text-[#e5bc60]">Trophy cabinet {round.streak > 1 ? `- ${round.streak}-goal streak` : ""}</p>
          <ul className="space-y-2">{BADGES.map(badge => <li key={badge.id} className="flex items-center justify-between gap-3 text-xs"><span className={rewards.badges.includes(badge.id) ? "text-[#e5bc60]" : "text-[#a99c81]"}>{badge.name}</span><span className="text-right text-[#a99c81]">{rewards.badges.includes(badge.id) ? "Unlocked" : badge.hint}</span></li>)}</ul>
          <details className="mt-3 text-xs leading-5 text-[#a99c81]"><summary className="cursor-pointer text-[#e2d6bb]">How rewards work</summary><p className="mt-2">Goal: 100 points. Each consecutive goal adds another 25-point bonus. Finish 5 shots: +50. Perfect round: +200. A save resets your streak. Best score updates after a full round.</p></details>
          <p className="mt-3 text-[11px] leading-4 text-[#a99c81]">{saved ? "Progress saved in this browser." : "Storage unavailable. Rewards last for this visit."} Game points only; no cash value or booking credit.</p>
        </div>
        <p className="text-center text-[11px] text-[#a99c81] md:col-span-2">Use the slider or arrow keys to aim. Enter on Shoot to kick.</p>
      </div>
    </div>
  );
}

