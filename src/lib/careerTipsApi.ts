import type { EcoverseProfile } from "@/types/profile";

function careerTipsEndpoint(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (explicit) return `${explicit}/api/career-tips`;
  if (import.meta.env.DEV) return "/api/career-tips";
  return "http://localhost:8787/api/career-tips";
}

export async function fetchCareerTips(profile: EcoverseProfile): Promise<{ markdown: string }> {
  const response = await fetch(careerTipsEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile }),
  });
  let data: { markdown?: string; message?: string; error?: string } = {};
  try {
    data = (await response.json()) as { markdown?: string; message?: string; error?: string };
  } catch {
    throw new Error(`Career tips request failed (${response.status})`);
  }
  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed (${response.status})`);
  }
  if (!data.markdown) throw new Error("No content returned.");
  return { markdown: data.markdown };
}
