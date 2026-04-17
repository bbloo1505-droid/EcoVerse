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

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

export async function fetchLiveContent(): Promise<ContentResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/content`);
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
