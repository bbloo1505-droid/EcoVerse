/** Mentor headshot fallbacks only — news / jobs / events use images from RSS feeds (see `backend/rssMedia.js`). */

function hashString(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pickFromPool(id: string, pool: readonly string[]): string {
  return pool[hashString(id) % pool.length]!;
}

const MENTOR_HEADSHOTS = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
] as const;

export function mentorHeadshotImage(id: string, direct?: string | null): string {
  const u = direct?.trim();
  if (u) return u;
  return pickFromPool(id, MENTOR_HEADSHOTS);
}
