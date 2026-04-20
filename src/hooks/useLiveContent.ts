import { useEffect, useState } from "react";
import { articles, events, memberships, opportunities } from "../data/mockData";
import { fetchLiveContent } from "../lib/api";
import type { Article, Event, Membership, Opportunity } from "../types";

type LiveContentState = {
  articles: Article[];
  opportunities: Opportunity[];
  events: Event[];
  memberships: Membership[];
  lastRefreshedAt: string | null;
  sourceErrors: Array<{ source: string; message: string }>;
  isLoading: boolean;
};

const fallbackState: LiveContentState = {
  articles,
  opportunities,
  events,
  memberships,
  lastRefreshedAt: null,
  sourceErrors: [],
  isLoading: true,
};

export function useLiveContent() {
  const [state, setState] = useState<LiveContentState>(fallbackState);

  useEffect(() => {
    let mounted = true;
    const loadContent = () => {
      fetchLiveContent().then((content) => {
        if (!mounted) return;
        setState({
          ...content,
          isLoading: false,
        });
      });
    };

    loadContent();
    const interval = window.setInterval(loadContent, 1000 * 60 * 3);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return state;
}
