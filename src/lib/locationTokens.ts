/** Tokens that match almost every AU listing via substring — exclude from picker / use strict match. */
const GENERIC_LOCATION_TOKENS = new Set(
  [
    "australia",
    "australia-wide",
    "au",
    "national",
    "nationwide",
    "remote",
    "hybrid",
    "on-site",
    "onsite",
    "online",
    "nz",
    "new zealand",
    "aotearoa",
  ].map((s) => s.toLowerCase()),
);

/**
 * When the user picks a city/region token, match any of these substrings in the listing location.
 * Keys are lowercase (see `matchesLocationToken`).
 */
const REGION_ALIASES: Record<string, readonly string[]> = {
  brisbane: ["brisbane", "qld", "queensland"],
  "gold coast": ["gold coast", "qld", "queensland"],
  "sunshine coast": ["sunshine coast", "qld", "queensland"],
  toowoomba: ["toowoomba", "qld", "queensland"],
  qld: ["brisbane", "qld", "queensland", "gold coast", "sunshine coast"],
  queensland: ["brisbane", "qld", "queensland"],
  sydney: ["sydney", "nsw", "new south wales"],
  newcastle: ["newcastle", "nsw", "new south wales"],
  wollongong: ["wollongong", "nsw", "new south wales"],
  nsw: ["sydney", "nsw", "new south wales", "newcastle", "wollongong"],
  melbourne: ["melbourne", "vic", "victoria"],
  geelong: ["geelong", "vic", "victoria"],
  vic: ["melbourne", "vic", "victoria", "geelong"],
  victoria: ["melbourne", "vic", "victoria"],
  adelaide: ["adelaide", "sa", "south australia"],
  sa: ["adelaide", "sa", "south australia"],
  "south australia": ["adelaide", "sa", "south australia"],
  perth: ["perth", "wa", "western australia"],
  wa: ["perth", "wa", "western australia"],
  "western australia": ["perth", "wa", "western australia"],
  hobart: ["hobart", "tas", "tasmania"],
  launceston: ["launceston", "tas", "tasmania"],
  tas: ["hobart", "tas", "tasmania", "launceston"],
  tasmania: ["hobart", "tas", "tasmania"],
  darwin: ["darwin", "nt", "northern territory"],
  nt: ["darwin", "nt", "northern territory"],
  "northern territory": ["darwin", "nt", "northern territory"],
  canberra: ["canberra", "act", "australian capital territory"],
  act: ["canberra", "act", "australian capital territory"],
};

function isGenericLocationToken(token: string): boolean {
  return GENERIC_LOCATION_TOKENS.has(token.trim().toLowerCase());
}

/** Split typical AU listing strings ("Sydney, NSW · Hybrid") into filter tokens. */
export function collectLocationTokens(locations: string[]): string[] {
  const seen = new Map<string, string>(); // lowercase -> display (first-seen casing)
  for (const raw of locations) {
    const t = raw.trim();
    if (!t) continue;
    const parts = t
      .split(/[,\u00B7|/&]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1);
    if (parts.length > 0) {
      for (const p of parts) {
        if (!isGenericLocationToken(p)) {
          const key = p.toLowerCase();
          if (!seen.has(key)) seen.set(key, p);
        }
      }
    } else if (!isGenericLocationToken(t)) {
      const key = t.toLowerCase();
      if (!seen.has(key)) seen.set(key, t);
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b, "en-AU"));
}

/**
 * Location filter: substring match for specific places (state, city).
 * Generic tokens (e.g. "Australia") must match the whole string only, otherwise
 * "Australia" would match every "Australia (NSW) - on-site" row.
 */
export function matchesLocationToken(haystack: string, token: string): boolean {
  if (!token || token === "all") return true;
  const t = token.trim();
  const h = haystack.trim();
  if (!h) return false;
  const hl = h.toLowerCase();
  const tl = t.toLowerCase();
  if (isGenericLocationToken(t)) {
    return hl === tl || hl.replace(/\s+/g, " ") === tl;
  }
  const aliases = REGION_ALIASES[tl];
  if (aliases) {
    return aliases.some((a) => hl.includes(a));
  }
  return hl.includes(tl);
}

export type LocationSort = "default" | "location-asc" | "location-desc";

export function sortByLocation<T extends { location: string }>(items: T[], sort: LocationSort): T[] {
  if (sort === "default") return items;
  const copy = [...items];
  if (sort === "location-asc") {
    copy.sort((a, b) => a.location.localeCompare(b.location, "en-AU"));
  } else {
    copy.sort((a, b) => b.location.localeCompare(a.location, "en-AU"));
  }
  return copy;
}
