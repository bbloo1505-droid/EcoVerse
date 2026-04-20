import type { Opportunity } from "./loveableData";

/** Default filler tag added to many listings — including it makes text search match almost everything. */
const TAGS_OMITTED_FROM_SEARCH = new Set(["environment"]);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Text used for opportunity search (title, org, location, description, non-generic tags, pathways). */
export function opportunitySearchHaystack(o: Opportunity): string {
  const tags = o.tags.filter((t) => !TAGS_OMITTED_FROM_SEARCH.has(t.toLowerCase()));
  return `${o.title} ${o.org} ${o.location} ${o.description} ${tags.join(" ")} ${(o.pathwayIds || []).join(" ")}`.toLowerCase();
}

/**
 * True if `token` appears as its own word (or whole haystack for very short tokens).
 * Avoids "graduate" matching inside "postgraduate" via naive substring.
 */
function haystackHasWord(haystack: string, token: string): boolean {
  const t = token.trim().toLowerCase();
  if (!t) return true;
  if (t.length <= 2) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(t)}([^a-z0-9]|$)`, "i").test(haystack);
  }
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(t)}([^a-z0-9]|$)`, "i").test(haystack);
}

/**
 * AND semantics: every query token must match. Tokens are split on whitespace;
 * punctuation is stripped from each token.
 */
export function matchesOpportunitySearchQuery(o: Opportunity, rawQuery: string): boolean {
  const q = rawQuery.trim();
  if (!q) return true;
  const haystack = opportunitySearchHaystack(o);
  const tokens = q
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}-]+/gu, ""))
    .filter((w) => w.length > 0);
  if (tokens.length === 0) return true;
  for (const tok of tokens) {
    if (!haystackHasWord(haystack, tok)) return false;
  }
  return true;
}
