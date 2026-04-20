import { useEffect, useState } from "react";
import { fetchTodayHeroPhoto } from "@/lib/heroPhotoApi";

export type TodayHeroState = {
  imageUrl: string | null;
  credit: string | null;
  caption: string | null;
  dayKeyUtc: string | null;
  loaded: boolean;
};

export function useTodayHeroBackground(): TodayHeroState {
  const [state, setState] = useState<TodayHeroState>({
    imageUrl: null,
    credit: null,
    caption: null,
    dayKeyUtc: null,
    loaded: false,
  });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const r = await fetchTodayHeroPhoto();
        if (cancelled) return;
        setState({
          imageUrl: r.imageUrl,
          credit: r.credit,
          caption: r.caption,
          dayKeyUtc: r.dayKeyUtc,
          loaded: true,
        });
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loaded: true }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
