export const REWARD_KEY = "nottam-kickoff-rewards-v1";
export const BADGES = [
  { id: "first-goal", name: "First goal", hint: "Score your first goal" },
  { id: "hat-trick", name: "Hat trick", hint: "Score 3 goals in one round" },
  { id: "perfect-five", name: "Perfect five", hint: "Score all 5 shots" },
] as const;
export type Rewards = { total: number; best: number; badges: string[] };
export const emptyRewards = (): Rewards => ({ total: 0, best: 0, badges: [] });
export function readRewards(raw: string | null): Rewards {
  try {
    const value = JSON.parse(raw ?? "null");
    if (!value || !Number.isSafeInteger(value.total) || value.total < 0 || !Number.isSafeInteger(value.best) || value.best < 0 || value.best > 1000 || !Array.isArray(value.badges)) return emptyRewards();
    return { total: value.total, best: value.best, badges: BADGES.filter(b => value.badges.includes(b.id)).map(b => b.id) };
  } catch { return emptyRewards(); }
}
export function awardShot(previous: Rewards, roundPoints: number, streak: number, goal: boolean, goals: number, shots: number) {
  const nextStreak = goal ? streak + 1 : 0;
  const earned = (goal ? 100 + (nextStreak - 1) * 25 : 0) + (shots === 5 ? 50 + (goals === 5 ? 200 : 0) : 0);
  const points = roundPoints + earned;
  const unlocked = BADGES.filter(b => !previous.badges.includes(b.id) && (
    b.id === "first-goal" && goals >= 1 || b.id === "hat-trick" && goals >= 3 || b.id === "perfect-five" && shots === 5 && goals === 5
  ));
  return { earned, points, streak: nextStreak, unlocked, rewards: {
    total: previous.total + earned,
    best: shots === 5 ? Math.max(previous.best, points) : previous.best,
    badges: [...previous.badges, ...unlocked.map(b => b.id)],
  } };
}
