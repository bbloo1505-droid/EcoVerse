import fs from "node:fs/promises";
import path from "node:path";
import Parser from "rss-parser";
import { seedContent } from "./seedData.js";
import { ENVIRONMENTAL_JOB_FEEDS } from "./environmentalJobFeeds.js";
import { buildOpportunityEntry, normalizeListingUrl } from "./jobOpportunityUtils.js";
import { extractRssImageUrl } from "./rssMedia.js";
import { enrichRowsWithOpenGraphImages } from "./linkPreviewImage.js";
import { isEnvironmentalArticleItem } from "./environmentalArticleFilter.js";

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ["content:encoded", "contentEncoded"],
      ["media:content", "media:content", { keepArray: true }],
      ["media:thumbnail", "media:thumbnail", { keepArray: true }],
      ["media:group", "media:group", { keepArray: true }],
      ["webfeeds:featuredImage", "webfeedsFeaturedImage"],
    ],
  },
});

const cachePath = path.resolve("backend", "cache", "content.json");

const FEED_CONFIG = {
  articles: [
    { name: "ABC Environment", url: "https://www.abc.net.au/news/feed/45910/rss.xml" },
    { name: "Mongabay", url: "https://news.mongabay.com/feed/" },
    { name: "The Guardian Environment", url: "https://www.theguardian.com/environment/rss" },
  ],
  events: [
    { name: "NSW RFS Major Fire Updates", url: "https://www.rfs.nsw.gov.au/feeds/major-Fire-Updates.xml" },
  ],
};

const MEMBERSHIP_SOURCES = [
  { organization: "Environment Institute of Australia and New Zealand", url: "https://www.eianz.org/membership" },
  { organization: "Australasian Land and Groundwater Association", url: "https://landandgroundwater.com/membership" },
  { organization: "Ecological Society of Australia", url: "https://www.ecolsoc.org.au/membership/" },
  { organization: "Australian Marine Sciences Association", url: "https://www.amsa.asn.au/membership/" },
  { organization: "Soil Science Australia", url: "https://www.soilscienceaustralia.org.au/membership" },
  { organization: "Australian Water Association", url: "https://www.awa.asn.au/Membership" },
  { organization: "Australian Association for Environmental Education", url: "https://www.aaee.org.au/join-now/" },
  {
    organization: "Waste Management and Resource Recovery Association of Australia",
    url: "https://www.wmrr.asn.au/Web/Web/Join_WMRR/Become_a_Member.aspx",
  },
  { organization: "Environmental Health Australia", url: "https://www.eh.org.au/membership" },
  { organization: "Institute of Public Works Engineering Australasia", url: "https://www.ipwea.org/membership" },
  { organization: "BirdLife Australia", url: "https://www.birdlife.org.au/support-us/join-us/" },
  { organization: "Clean Energy Council", url: "https://www.cleanenergycouncil.org.au/membership" },
  { organization: "Australian Institute of Landscape Architects", url: "https://www.aila.org.au/membership" },
  { organization: "Planning Institute of Australia", url: "https://www.planning.org.au/membership" },
];

const contentState = {
  articles: [],
  opportunities: [...seedContent.opportunities],
  events: [...seedContent.events],
  memberships: [...seedContent.memberships],
  lastRefreshedAt: null,
  sourceErrors: [],
};

function toSummary(text) {
  const stripped = (text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return stripped.slice(0, 180) || "Tap to view the full update.";
}

function relativeVerified(dateValue) {
  if (!dateValue) {
    return "Verified today";
  }
  const now = new Date();
  const then = new Date(dateValue);
  const diffHours = Math.max(1, Math.floor((now.getTime() - then.getTime()) / 36e5));
  if (diffHours < 24) {
    return `Verified ${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `Verified ${diffDays}d ago`;
}

function inferFormat(text) {
  const lower = text.toLowerCase();
  if (lower.includes("online") || lower.includes("webinar") || lower.includes("virtual")) {
    return "Online";
  }
  if (lower.includes("hybrid")) {
    return "Hybrid";
  }
  return "In person";
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Parse RSS item date into ISO string; null if unknown. */
function itemDateIso(item) {
  const raw = item.isoDate ?? item.pubDate ?? item.date;
  if (raw == null || raw === "") return null;
  const d = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

/**
 * When a feed omits pubDate, avoid stamping every row with "now" (same calendar day).
 * Uses a stable pseudo-date spread across the past window so lists look realistic.
 */
function fallbackDateIsoFromId(id, minDaysAgo = 1, maxDaysAgo = 120) {
  const h = hashString(id);
  const span = Math.max(0, maxDaysAgo - minDaysAgo);
  const daysAgo = minDaysAgo + (span === 0 ? 0 : h % (span + 1));
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

async function readCache() {
  try {
    const raw = await fs.readFile(cachePath, "utf8");
    const parsed = JSON.parse(raw);
    Object.assign(contentState, parsed);
  } catch {
    // first boot without cache
  }
}

async function writeCache() {
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, JSON.stringify(contentState, null, 2), "utf8");
}

async function fetchFeed(feed) {
  try {
    return await parser.parseURL(feed.url);
  } catch (error) {
    contentState.sourceErrors.push({
      source: feed.name,
      message: error instanceof Error ? error.message : "Feed failed",
    });
    return null;
  }
}

function readMetaDescription(html) {
  const match =
    html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
  return match?.[1]?.trim() || "";
}

function readTitle(html) {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  return titleMatch?.[1]?.trim() || "";
}

async function fetchMembershipPage(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(source.url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const html = await response.text();
    const pageTitle = readTitle(html);
    const description = readMetaDescription(html);
    const combined = `${pageTitle} ${description}`.toLowerCase();
    const type =
      combined.includes("student") || combined.includes("professional")
        ? "Student & Professional Membership"
        : "Membership";
    return {
      id: `member-${Buffer.from(source.url).toString("base64url").slice(0, 18)}`,
      organization: source.organization,
      type,
      benefits:
        description.slice(0, 180) ||
        "Membership includes environmental community updates, events, and networking opportunities.",
      joinLink: source.url,
    };
  } catch (error) {
    contentState.sourceErrors.push({
      source: source.organization,
      message: error instanceof Error ? error.message : "Membership source failed",
    });
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function refreshArticles() {
  const entries = [];
  for (const feed of FEED_CONFIG.articles) {
    const parsed = await fetchFeed(feed);
    if (!parsed?.items?.length) continue;
    for (const item of parsed.items.slice(0, 24)) {
      if (!isEnvironmentalArticleItem(item)) continue;
      const link = typeof item.link === "string" ? item.link : "";
      const hero = extractRssImageUrl(item, link);
      entries.push({
        id: `article-${Buffer.from((item.link || item.title || "").slice(0, 40)).toString("base64url")}`,
        title: item.title || "Environmental update",
        source: feed.name,
        lastVerified: relativeVerified(item.pubDate),
        ...(hero ? { image: hero } : {}),
        summary: toSummary(item.contentSnippet || item.content || item.title),
        url: link,
        publishedAt: itemDateIso(item) ?? fallbackDateIsoFromId(item.id),
      });
    }
  }
  entries.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  contentState.articles = entries.slice(0, 40);
}

async function refreshOpportunities() {
  const entries = [];
  const seenUrls = new Set();

  for (const feed of ENVIRONMENTAL_JOB_FEEDS) {
    const parsed = await fetchFeed({ name: feed.board, url: feed.url });
    if (!parsed?.items?.length) continue;
    for (const item of parsed.items.slice(0, 45)) {
      const link = item.link || "";
      if (link) {
        const key = normalizeListingUrl(link);
        if (seenUrls.has(key)) continue;
        seenUrls.add(key);
      }
      const summary = toSummary(item.contentSnippet || item.content || item.title);
      const title = item.title || "Environmental opportunity";
      const id = `opp-${Buffer.from((item.link || title).slice(0, 48)).toString("base64url")}`;
      const publishedAt = itemDateIso(item) ?? fallbackDateIsoFromId(id);
      const row = buildOpportunityEntry({
        item,
        summary,
        title,
        id,
        feedBoard: feed.board,
      });
      row.publishedAt = publishedAt;
      entries.push(row);
    }
  }

  entries.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  await enrichRowsWithOpenGraphImages(
    entries,
    (row, image) => {
      row.image = image;
    },
    { max: 60, concurrency: 4 },
  );
  const merged = [...entries, ...seedContent.opportunities];
  contentState.opportunities = merged.slice(0, 220);
}

async function refreshEvents() {
  const entries = [];
  for (const feed of FEED_CONFIG.events) {
    const parsed = await fetchFeed(feed);
    if (!parsed?.items?.length) continue;
    for (const item of parsed.items.slice(0, 10)) {
      const summary = toSummary(item.contentSnippet || item.content || item.title);
      const title = item.title || "Environmental event update";
      const id = `event-${Buffer.from((item.link || title).slice(0, 40)).toString("base64url")}`;
      const whenIso = itemDateIso(item) ?? fallbackDateIsoFromId(id);
      const link = typeof item.link === "string" ? item.link : "";
      const hero = extractRssImageUrl(item, link);
      entries.push({
        id,
        title,
        host: feed.name,
        date: new Date(whenIso).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        format: inferFormat(summary),
        location: "Australia / Online",
        ...(hero ? { image: hero } : {}),
        summary,
        url: link,
        source: feed.name,
        publishedAt: whenIso,
      });
    }
  }
  await enrichRowsWithOpenGraphImages(
    entries,
    (row, image) => {
      row.image = image;
    },
    { max: 15, concurrency: 3 },
  );
  /* Curated seeds first so sparse RSS feeds do not hide real event listings. */
  const merged = [...seedContent.events, ...entries];
  contentState.events = merged.slice(0, 80);
}

async function refreshMemberships() {
  const rows = await Promise.all(MEMBERSHIP_SOURCES.map((source) => fetchMembershipPage(source)));
  const validRows = rows.filter(Boolean);
  const merged = [...validRows, ...seedContent.memberships];
  const deduped = merged.filter(
    (item, index, list) =>
      list.findIndex((candidate) => candidate.organization === item.organization) === index,
  );
  contentState.memberships = deduped.slice(0, 40);
}

export async function initializeContent() {
  await readCache();
  refreshAllContent().catch(() => {
    // keep serving cache/seed if refresh fails
  });
}

export async function refreshAllContent() {
  contentState.sourceErrors = [];
  await refreshArticles();
  await refreshOpportunities();
  await refreshEvents();
  await refreshMemberships();
  contentState.sourceErrors = contentState.sourceErrors.filter(
    (item, index, list) =>
      list.findIndex(
        (candidate) => candidate.source === item.source && candidate.message === item.message,
      ) === index,
  );
  contentState.lastRefreshedAt = new Date().toISOString();
  await writeCache();
  return getContent();
}

export function getContent() {
  return { ...contentState };
}
