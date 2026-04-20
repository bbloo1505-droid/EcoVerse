import type { Article, Event, Membership, Opportunity } from "../types";
import { articles, events, memberships, opportunities } from "../data/mockData";

type ContentResponse = {
  articles: Article[];
  opportunities: Opportunity[];
  events: Event[];
  memberships: Membership[];
  lastRefreshedAt: string | null;
  sourceErrors: Array<{ source: string; message: string }>;
};

/** In dev, prefer same-origin `/api` so Vite can proxy to the Express server (avoids cross-origin quirks). */
function contentEndpoint(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (explicit) return `${explicit}/api/content`;
  if (import.meta.env.DEV) return "/api/content";
  return "http://localhost:8787/api/content";
}

export async function fetchLiveContent(): Promise<ContentResponse> {
  try {
    const response = await fetch(contentEndpoint());
    if (!response.ok) {
      throw new Error(`Content request failed (${response.status})`);
    }
    return (await response.json()) as ContentResponse;
  } catch {
    return {
      articles,
      opportunities,
      events,
      memberships,
      lastRefreshedAt: null,
      sourceErrors: [{ source: "api", message: "Using local fallback content." }],
    };
  }
}
