import { useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

type ActivityRow = {
  user_identifier: string;
  saved_item_ids: string[];
  applied_opportunity_ids: string[];
  live_mentorship_requests: number;
};

type CloudActivity = {
  savedItemIds: string[];
  setSavedItemIds: Dispatch<SetStateAction<string[]>>;
  appliedOpportunityIds: string[];
  setAppliedOpportunityIds: Dispatch<SetStateAction<string[]>>;
  liveMentorshipRequests: number;
  setLiveMentorshipRequests: Dispatch<SetStateAction<number>>;
  cloudStatusLabel: string;
};

const USER_KEY = "ecoverse:user-id";

function getLocalUserIdentifier() {
  const existing = localStorage.getItem(USER_KEY);
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(USER_KEY, created);
  return created;
}

export function useCloudActivity(): CloudActivity {
  const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
  const [appliedOpportunityIds, setAppliedOpportunityIds] = useState<string[]>([]);
  const [liveMentorshipRequests, setLiveMentorshipRequests] = useState(3);
  const [cloudStatusLabel, setCloudStatusLabel] = useState(
    hasSupabaseConfig ? "Connecting to Supabase..." : "Local mode",
  );
  const userIdentifierRef = useRef("");
  const initializedRef = useRef(false);

  const payload = useMemo(
    () => ({
      saved_item_ids: savedItemIds,
      applied_opportunity_ids: appliedOpportunityIds,
      live_mentorship_requests: liveMentorshipRequests,
    }),
    [appliedOpportunityIds, liveMentorshipRequests, savedItemIds],
  );

  useEffect(() => {
    userIdentifierRef.current = getLocalUserIdentifier();
    if (!hasSupabaseConfig || !supabase) {
      initializedRef.current = true;
      return;
    }

    const client = supabase;

    client
      .from("user_activity")
      .select("user_identifier,saved_item_ids,applied_opportunity_ids,live_mentorship_requests")
      .eq("user_identifier", userIdentifierRef.current)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setCloudStatusLabel("Cloud sync unavailable");
          initializedRef.current = true;
          return;
        }

        if (data) {
          const row = data as ActivityRow;
          setSavedItemIds(row.saved_item_ids ?? []);
          setAppliedOpportunityIds(row.applied_opportunity_ids ?? []);
          setLiveMentorshipRequests(row.live_mentorship_requests ?? 3);
        }
        setCloudStatusLabel("Synced with Supabase");
        initializedRef.current = true;
      });
  }, []);

  useEffect(() => {
    if (!initializedRef.current || !hasSupabaseConfig || !supabase) {
      return;
    }

    const client = supabase;
    const timeout = window.setTimeout(() => {
      client
        .from("user_activity")
        .upsert(
          {
            user_identifier: userIdentifierRef.current,
            ...payload,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_identifier" },
        )
        .then(({ error }) => {
          setCloudStatusLabel(error ? "Cloud sync error" : "Synced with Supabase");
        });
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [payload]);

  return {
    savedItemIds,
    setSavedItemIds,
    appliedOpportunityIds,
    setAppliedOpportunityIds,
    liveMentorshipRequests,
    setLiveMentorshipRequests,
    cloudStatusLabel,
  };
}
