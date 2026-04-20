import type {
  Article,
  Event,
  Membership as DomainMembership,
  Opportunity as DomainOpportunity,
} from "../types";
import type { EventItem, NewsItem, Opportunity, Membership } from "./loveableData";
import { INDUSTRY_CATEGORIES } from "./industryCategories";
import { inferNewsTopic } from "./newsTopics";

function hashString(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Parse mixed API date strings to YYYY-MM-DD. */
function firstIsoDay(value: string | undefined): string | null {
  if (!value) return null;
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}

/** Closing date when unknown: spread after posted date so cards are not all identical. */
function stableCloseIsoFromPosted(id: string, postedIso: string | null): string {
  const base = postedIso ? new Date(postedIso.slice(0, 10) + "T12:00:00") : new Date();
  if (Number.isNaN(base.getTime())) {
    const d = new Date();
    d.setDate(d.getDate() + 14 + (hashString(id) % 60));
    return d.toISOString().slice(0, 10);
  }
  const add = 14 + (hashString(id) % 56);
  base.setDate(base.getDate() + add);
  return base.toISOString().slice(0, 10);
}

function mapRemote(o: DomainOpportunity): Opportunity["remote"] {
  const t = `${o.location} ${o.summary} ${o.tags.join(" ")}`.toLowerCase();
  if (/\bremote\b/.test(t)) return "remote";
  if (/\bhybrid\b/.test(t)) return "hybrid";
  return "on-site";
}

function mapOppType(o: DomainOpportunity): Opportunity["type"] {
  const t = o.type.toLowerCase();
  if (t.includes("volunteer")) return "volunteer";
  if (t.includes("intern")) return "internship";
  if (t.includes("grant")) return "grant";
  if (t.includes("research") || t.includes("fellow")) return "research";
  if (t.includes("mid") || t.includes("senior") || t.includes("professional")) return "mid-senior";
  if (t.includes("graduate") || t.includes("entry")) return "entry";
  return "entry";
}

function deadlineIso(o: DomainOpportunity): string {
  const raw = o.deadline?.trim() ?? "";
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const posted = firstIsoDay(o.publishedAt);
  return stableCloseIsoFromPosted(o.id, posted);
}

function pathwayLabelsFromIds(ids: string[] | undefined): string[] {
  if (!ids?.length) return [];
  return ids
    .map((id) => INDUSTRY_CATEGORIES.find((c) => c.id === id)?.label)
    .filter((x): x is string => Boolean(x))
    .slice(0, 3);
}

export function toLoveableOpportunity(o: DomainOpportunity): Opportunity {
  const pathwayIds = o.pathwayIds ?? [];
  const pathwayLabels = pathwayLabelsFromIds(pathwayIds);
  const baseTags = (o.tags || []).filter((t) => t !== "Live listing");
  const tags = [...pathwayLabels, ...baseTags];
  const listingBoard =
    o.listingBoard ??
    (() => {
      const s = o.source || "";
      if (/ecoverse|curated/i.test(s)) return "EcoVerse curated";
      const beforeSep = s.split("·")[0]?.trim();
      return beforeSep || "Listing";
    })();

  const img = o.image?.trim();
  return {
    id: o.id,
    title: o.title,
    org: o.organization,
    location: o.location || "Australia",
    remote: mapRemote(o),
    type: mapOppType(o),
    deadline: deadlineIso(o),
    tags: tags.length ? tags : ["Environment"],
    source: o.source || "EcoVerse",
    verified: Boolean(o.url || o.source),
    description: o.summary || "Details available on the listing page.",
    salary: undefined,
    listingBoard,
    pathwayIds: pathwayIds.length ? pathwayIds : undefined,
    ...(img ? { imageUrl: img } : {}),
  };
}

/** Prefer explicit event date; `publishedAt` is often the RSS post time, not when the event runs. */
function eventDateIso(e: Event): string {
  const fromEventField = firstIsoDay(e.date);
  if (fromEventField) return fromEventField;
  const fromPub = firstIsoDay(e.publishedAt);
  if (fromPub) return fromPub;
  const d = new Date();
  d.setDate(d.getDate() + 21 + (hashString(e.id) % 90));
  return d.toISOString().slice(0, 10);
}

function eventCategory(e: Event): EventItem["category"] {
  const s = `${e.title} ${e.summary}`.toLowerCase();
  if (s.includes("hackathon")) return "hackathon";
  if (s.includes("webinar") || e.format === "Online") return "webinar";
  if (s.includes("student")) return "student";
  if (s.includes("conference") || s.includes("summit")) return "conference";
  return "meetup";
}

export function toLoveableEvent(e: Event): EventItem {
  const online = e.format === "Online";
  const hybrid = e.format === "Hybrid";
  const img = e.image?.trim();
  return {
    id: e.id,
    title: e.title,
    date: eventDateIso(e),
    location: e.location || "Australia",
    online: online || hybrid,
    host: e.host || "Host TBC",
    category: eventCategory(e),
    tags: [e.format, e.location?.split(",")[0] || "AU"].filter(Boolean) as string[],
    description: e.summary || e.title,
    attendees: undefined,
    ...(img ? { imageUrl: img } : {}),
  };
}

function readMins(text: string): number {
  const w = text.split(/\s+/).length;
  return Math.max(2, Math.min(12, Math.round(w / 200) || 4));
}

export function toLoveableNews(a: Article): NewsItem {
  const pub =
    firstIsoDay(a.publishedAt) ??
    (() => {
      const d = new Date();
      d.setDate(d.getDate() - (hashString(a.id) % 30));
      return d.toISOString().slice(0, 10);
    })();
  const img = a.image?.trim();
  return {
    id: a.id,
    title: a.title,
    source: a.source || "EcoVerse",
    topic: inferNewsTopic(a.title, a.summary || ""),
    publishedAt: pub,
    verifiedAt: pub,
    excerpt: a.summary || a.title,
    readMins: readMins(a.summary || ""),
    ...(img ? { imageUrl: img } : {}),
  };
}

export function toLoveableMembership(m: DomainMembership): Membership {
  const benefits = m.benefits
    ? m.benefits.split(/[.;]/).map((b) => b.trim()).filter(Boolean)
    : ["Member benefits"];
  return {
    id: m.id,
    org: m.organization,
    category: m.type || "Membership",
    location: "Australia",
    price: "See website",
    benefits: benefits.length ? benefits : ["Community access"],
    eligibility: "See organisation website",
    link: m.joinLink || "#",
  };
}
