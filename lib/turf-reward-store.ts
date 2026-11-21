"use client";
import { emptyRewards, readRewards, REWARD_KEY, type Rewards } from "./turf-rewards";
const serverRewards = emptyRewards();
let cachedRaw: string | null | undefined;
let cachedRewards = serverRewards;
let memoryOnly = false;
const changeEvent = "nottam-rewards-changed";
export function getRewards(): Rewards {
  if (typeof window === "undefined") return serverRewards;
  if (memoryOnly) return cachedRewards;
  try {
    const raw = localStorage.getItem(REWARD_KEY);
    if (raw !== cachedRaw) { cachedRaw = raw; cachedRewards = readRewards(raw); }
  } catch { memoryOnly = true; }
  return cachedRewards;
}
export function getServerRewards() { return serverRewards; }
export function subscribeRewards(notify: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === REWARD_KEY || event.key === null) notify(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(changeEvent, notify);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(changeEvent, notify); };
}
export function saveRewards(rewards: Rewards) {
  cachedRewards = rewards;
  cachedRaw = JSON.stringify(rewards);
  try { localStorage.setItem(REWARD_KEY, cachedRaw); memoryOnly = false; }
  catch { memoryOnly = true; }
  window.dispatchEvent(new Event(changeEvent));
  return !memoryOnly;
}
