import type { EventItem, Opportunity } from "./loveableData";
import { sortByLocation } from "./locationTokens";
import pathwayData from "../data/environmentalPathways.json";

export type IndustryCategory = {
  id: string;
  label: string;
  /** Match if any keyword appears in title, org, description, or tags (case-insensitive). */
  keywords: string[];
};

/** Curated environmental career pathways — keywords synced with `environmentalPathways.json` (used by the API too). */
export const INDUSTRY_CATEGORIES: IndustryCategory[] = pathwayData.categories;

function opportunityHaystack(o: Opportunity): string {
  const pathwayExtra = (o.pathwayIds || []).join(" ");
  return `${o.title} ${o.org} ${o.description} ${o.tags.join(" ")} ${pathwayExtra}`.toLowerCase();
}

export function matchesIndustryCategory(o: Opportunity, categoryId: string): boolean {
  if (!categoryId || categoryId === "all") return true;
  /** When the API inferred pathways, trust that list — keyword fallback matches boilerplate too often. */
  if (o.pathwayIds?.length) {
    return o.pathwayIds.includes(categoryId);
  }
  const cat = INDUSTRY_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return false;
  const text = opportunityHaystack(o);
  return cat.keywords.some((kw) => text.includes(kw.toLowerCase()));
}

/** First matching sector label for sorting; uncategorized last. */
export function primarySectorLabel(o: Opportunity): string {
  if (o.pathwayIds?.length) {
    const first = INDUSTRY_CATEGORIES.find((c) => o.pathwayIds?.includes(c.id));
    if (first) return first.label;
  }
  const text = opportunityHaystack(o);
  for (const cat of INDUSTRY_CATEGORIES) {
    if (cat.keywords.some((kw) => text.includes(kw.toLowerCase()))) return cat.label;
  }
  return "Other";
}

export function matchesListingBoard(o: Opportunity, boardId: string): boolean {
  if (boardId === "all") return true;
  const a = (o.listingBoard || "").trim().toLowerCase();
  const b = boardId.trim().toLowerCase();
  return a === b;
}

export type OpportunitySort =
  | "default"
  | "location-asc"
  | "location-desc"
  | "sector-asc"
  | "sector-desc";

export function sortOpportunitiesBy(items: Opportunity[], sort: OpportunitySort): Opportunity[] {
  if (sort === "sector-asc" || sort === "sector-desc") {
    const copy = [...items];
    copy.sort((a, b) => {
      const cmp = primarySectorLabel(a).localeCompare(primarySectorLabel(b), "en-AU");
      return sort === "sector-asc" ? cmp : -cmp;
    });
    return copy;
  }
  return sortByLocation(items, sort);
}

function eventHaystack(ev: EventItem): string {
  return `${ev.title} ${ev.host} ${ev.description} ${ev.tags.join(" ")}`.toLowerCase();
}

export function matchesIndustryEvent(ev: EventItem, categoryId: string): boolean {
  if (!categoryId || categoryId === "all") return true;
  const cat = INDUSTRY_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return false;
  const text = eventHaystack(ev);
  return cat.keywords.some((kw) => text.includes(kw.toLowerCase()));
}

function primarySectorLabelEvent(ev: EventItem): string {
  const text = eventHaystack(ev);
  for (const cat of INDUSTRY_CATEGORIES) {
    if (cat.keywords.some((kw) => text.includes(kw.toLowerCase()))) return cat.label;
  }
  return "Other";
}

export function sortEventsBy(items: EventItem[], sort: OpportunitySort): EventItem[] {
  if (sort === "sector-asc" || sort === "sector-desc") {
    const copy = [...items];
    copy.sort((a, b) => {
      const cmp = primarySectorLabelEvent(a).localeCompare(primarySectorLabelEvent(b), "en-AU");
      return sort === "sector-asc" ? cmp : -cmp;
    });
    return copy;
  }
  return sortByLocation(items, sort);
}
