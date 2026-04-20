import { inferPathwayIds } from "./pathwayInference.js";
import { extractRssImageUrl } from "./rssMedia.js";

const AU_STATES = [
  "NSW",
  "VIC",
  "QLD",
  "WA",
  "SA",
  "TAS",
  "NT",
  "ACT",
  "Australian Capital Territory",
  "New South Wales",
  "Victoria",
  "Queensland",
  "Western Australia",
  "South Australia",
  "Tasmania",
  "Northern Territory",
];

export function normalizeListingUrl(url) {
  try {
    const u = new URL(url);
    u.hash = "";
    u.searchParams.sort();
    return `${u.hostname.toLowerCase()}${u.pathname.replace(/\/$/, "")}${u.search}`;
  } catch {
    return (url || "").toLowerCase().trim();
  }
}

export function inferEmployerFromTitle(title) {
  const t = (title || "").trim();
  if (!t) return null;
  const seps = [" | ", " — ", " – ", " - ", " at "];
  for (const sep of seps) {
    const idx = t.indexOf(sep);
    if (idx === -1) continue;
    const a = t.slice(0, idx).trim();
    const b = t.slice(idx + sep.length).trim();
    if (!a || !b) continue;
    const candidates = [a, b];
    for (const c of candidates) {
      if (c.length >= 2 && c.length <= 80 && !/^[\d$€£]/.test(c)) {
        const lower = c.toLowerCase();
        if (!/^(intern|volunteer|graduate|job|role|position)/.test(lower)) return c;
      }
    }
  }
  return null;
}

export function inferLocationFromText(text) {
  const t = (text || "").toLowerCase();
  if (/\bremote\b|\bwork from home\b|\banywhere\b/.test(t)) return "Australia / Remote";
  for (const s of AU_STATES) {
    if (t.includes(s.toLowerCase())) {
      if (s.length <= 3) return `Australia (${s})`;
      return "Australia";
    }
  }
  if (/\baustralia\b|\bau\b|\bnz\b|\bnew zealand\b/.test(t)) return "Australia / NZ";
  if (/\buk\b|\bunited kingdom\b|\busa\b|\bunited states\b|\bcanada\b/.test(t)) return "International";
  return "Australia / Remote";
}

export function detectOpportunityType(title, summary) {
  const text = `${title} ${summary}`.toLowerCase();
  if (text.includes("grant") || text.includes("fellowship fund") || text.includes("scholarship")) return "Grant";
  if (text.includes("intern")) return "Internship";
  if (
    text.includes("graduate program") ||
    text.includes("graduate intake") ||
    text.includes("grad program") ||
    text.includes("vacation program") ||
    text.includes("summer program")
  ) {
    return "Graduate";
  }
  if (text.includes("graduate") || /\bgrad\b/.test(text)) return "Graduate";
  if (text.includes("fellow")) return "Fellowship";
  if (text.includes("phd") || text.includes("postdoc") || text.includes("post-doctoral")) return "Research";
  if (text.includes("volunteer")) return "Volunteer";
  if (
    /\b(senior|principal|lead|manager|director|head of)\b/.test(text) &&
    !text.includes("graduate") &&
    !text.includes("intern")
  ) {
    return "Mid-senior";
  }
  if (text.includes("research")) return "Research";
  return "Entry";
}

export function buildOpportunityEntry({ item, summary, title, id, feedBoard }) {
  const employerGuess = inferEmployerFromTitle(title);
  const organization = employerGuess || feedBoard;
  const pathwayIds = inferPathwayIds(title, summary);

  const tags = ["Live listing", feedBoard];
  const link = typeof item.link === "string" ? item.link : "";
  const hero = extractRssImageUrl(item, link);

  return {
    id,
    title,
    organization,
    location: inferLocationFromText(`${title} ${summary}`),
    type: detectOpportunityType(title, summary),
    deadline: "Apply soon",
    ...(hero ? { image: hero } : {}),
    summary,
    tags,
    url: link,
    source: `${feedBoard} · RSS`,
    listingBoard: feedBoard,
    pathwayIds,
    publishedAt: null,
  };
}
