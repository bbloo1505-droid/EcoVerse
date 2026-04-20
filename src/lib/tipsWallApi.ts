import type { CommunityTipNote } from "@/types/communityTip";

function tipsWallBase(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (explicit) return `${explicit}/api/tips-wall`;
  if (import.meta.env.DEV) return "/api/tips-wall";
  return "http://localhost:8787/api/tips-wall";
}

export async function fetchTipsWall(wallKey: string): Promise<{
  tips: CommunityTipNote[];
  wallKey: string;
  wallLabel: string;
  wallLabels?: Record<string, string>;
}> {
  const url = `${tipsWallBase()}?wall=${encodeURIComponent(wallKey)}`;
  const response = await fetch(url);
  let data: {
    tips?: CommunityTipNote[];
    wallKey?: string;
    wallLabel?: string;
    wallLabels?: Record<string, string>;
    message?: string;
    error?: string;
  } = {};
  try {
    data = (await response.json()) as typeof data;
  } catch {
    throw new Error(`Tips wall request failed (${response.status})`);
  }
  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed (${response.status})`);
  }
  if (!Array.isArray(data.tips)) throw new Error("Invalid response.");
  return {
    tips: data.tips,
    wallKey: data.wallKey || wallKey,
    wallLabel: data.wallLabel || wallKey,
    wallLabels: data.wallLabels,
  };
}

export async function postTipWall(input: {
  wallKey: string;
  body: string;
  displayName?: string;
  dreamRole?: string;
  wallLabel?: string;
}): Promise<{ tip: CommunityTipNote; wallKey: string; wallLabel: string }> {
  const response = await fetch(tipsWallBase(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  let data: {
    tip?: CommunityTipNote;
    wallKey?: string;
    wallLabel?: string;
    message?: string;
    error?: string;
  } = {};
  try {
    data = (await response.json()) as typeof data;
  } catch {
    throw new Error(`Could not save tip (${response.status})`);
  }
  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed (${response.status})`);
  }
  if (!data.tip) throw new Error("No tip returned.");
  return { tip: data.tip, wallKey: data.wallKey || input.wallKey, wallLabel: data.wallLabel || input.wallKey };
}
