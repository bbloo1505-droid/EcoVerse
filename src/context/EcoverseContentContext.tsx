import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLiveContent } from "../hooks/useLiveContent";
import { mentors } from "../lib/loveableData";
import type { EventItem, Membership, NewsItem, Opportunity } from "../lib/loveableData";
import {
  toLoveableEvent,
  toLoveableMembership,
  toLoveableNews,
  toLoveableOpportunity,
} from "../lib/loveableAdapters";

export type EcoverseContentValue = {
  opportunities: Opportunity[];
  events: EventItem[];
  news: NewsItem[];
  memberships: Membership[];
  mentors: typeof mentors;
  isLoading: boolean;
  lastRefreshedAt: string | null;
  sourceErrors: Array<{ source: string; message: string }>;
};

const EcoverseContentContext = createContext<EcoverseContentValue | null>(null);

export function EcoverseContentProvider({ children }: { children: ReactNode }) {
  const live = useLiveContent();
  const value = useMemo<EcoverseContentValue>(
    () => ({
      opportunities: live.opportunities.map(toLoveableOpportunity),
      events: live.events.map(toLoveableEvent),
      news: live.articles.map(toLoveableNews),
      memberships: live.memberships.map(toLoveableMembership),
      mentors,
      isLoading: live.isLoading,
      lastRefreshedAt: live.lastRefreshedAt,
      sourceErrors: live.sourceErrors,
    }),
    [live],
  );
  return <EcoverseContentContext.Provider value={value}>{children}</EcoverseContentContext.Provider>;
}

export function useEcoverseContent() {
  const ctx = useContext(EcoverseContentContext);
  if (!ctx) throw new Error("useEcoverseContent must be used within EcoverseContentProvider");
  return ctx;
}
