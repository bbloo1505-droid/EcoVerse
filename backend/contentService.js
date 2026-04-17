import fs from "node:fs/promises";
import path from "node:path";
import Parser from "rss-parser";
import { seedContent } from "./seedData.js";

const parser = new Parser({
  timeout: 10000,
});

const cachePath = path.resolve("backend", "cache", "content.json");

const FEED_CONFIG = {
  articles: [
    { name: "Mongabay", url: "https://news.mongabay.com/feed/" },
    { name: "The Guardian Environment", url: "https://www.theguardian.com/environment/rss" },
    { name: "UNEP", url: "https://www.unep.org/rss.xml" },
  ],
  opportunities: [
    { name: "Environmentjob", url: "https://www.environmentjob.co.uk/rss" },
    { name: "Conservation Careers", url: "https://www.conservation-careers.com/feed/" },
  ],
  events: [
    { name: "IUCN News", url: "https://www.iucn.org/rss/news.xml" },
    { name: "WWF Australia", url: "https://www.wwf.org.au/news.rss" },
  ],
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80";

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

function detectOpportunityType(title, summary) {
  const text = `${title} ${summary}`.toLowerCase();
  if (text.includes("intern")) return "Internship";
  if (text.includes("graduate")) return "Graduate";
  if (text.includes("fellow")) return "Fellowship";
  if (text.includes("research")) return "Research";
  if (text.includes("volunteer")) return "Volunteer";
  return "Entry";
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

async function refreshArticles() {
  const entries = [];
  for (const feed of FEED_CONFIG.articles) {
    const parsed = await fetchFeed(feed);
    if (!parsed?.items?.length) continue;
    for (const item of parsed.items.slice(0, 8)) {
      entries.push({
        id: `article-${Buffer.from((item.link || item.title || "").slice(0, 40)).toString("base64url")}`,
        title: item.title || "Environmental update",
        source: feed.name,
        lastVerified: relativeVerified(item.pubDate),
        image: DEFAULT_IMAGE,
        summary: toSummary(item.contentSnippet || item.content || item.title),
        url: item.link || "",
        publishedAt: item.pubDate || new Date().toISOString(),
      });
    }
  }
  entries.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  contentState.articles = entries.slice(0, 40);
}

async function refreshOpportunities() {
  const entries = [];
  for (const feed of FEED_CONFIG.opportunities) {
    const parsed = await fetchFeed(feed);
    if (!parsed?.items?.length) continue;
    for (const item of parsed.items.slice(0, 12)) {
      const summary = toSummary(item.contentSnippet || item.content || item.title);
      const title = item.title || "Environmental opportunity";
      entries.push({
        id: `opp-${Buffer.from((item.link || title).slice(0, 40)).toString("base64url")}`,
        title,
        organization: feed.name,
        location: "Australia / Remote",
        type: detectOpportunityType(title, summary),
        deadline: "Apply soon",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
        summary,
        tags: ["Live listing", "External source"],
        url: item.link || "",
        source: feed.name,
        publishedAt: item.pubDate || new Date().toISOString(),
      });
    }
  }

  const merged = [...entries, ...seedContent.opportunities];
  contentState.opportunities = merged.slice(0, 40);
}

async function refreshEvents() {
  const entries = [];
  for (const feed of FEED_CONFIG.events) {
    const parsed = await fetchFeed(feed);
    if (!parsed?.items?.length) continue;
    for (const item of parsed.items.slice(0, 10)) {
      const summary = toSummary(item.contentSnippet || item.content || item.title);
      const title = item.title || "Environmental event update";
      entries.push({
        id: `event-${Buffer.from((item.link || title).slice(0, 40)).toString("base64url")}`,
        title,
        host: feed.name,
        date: item.pubDate ? new Date(item.pubDate).toLocaleDateString("en-AU") : "Date TBA",
        format: inferFormat(summary),
        location: "Australia / Online",
        image:
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
        summary,
        url: item.link || "",
        source: feed.name,
        publishedAt: item.pubDate || new Date().toISOString(),
      });
    }
  }
  const merged = [...entries, ...seedContent.events];
  contentState.events = merged.slice(0, 40);
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
  contentState.lastRefreshedAt = new Date().toISOString();
  await writeCache();
  return getContent();
}

export function getContent() {
  return { ...contentState };
}
