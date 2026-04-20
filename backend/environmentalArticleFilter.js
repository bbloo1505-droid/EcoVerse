/**
 * Keep only RSS items that are clearly environment / climate / nature / conservation related.
 * Uses URL hints (trusted paths) plus keyword matching on title + description.
 */

function stripHtml(s) {
  return (s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeCategories(categories) {
  if (!categories) return [];
  const list = Array.isArray(categories) ? categories : [categories];
  return list
    .map((c) => (typeof c === "string" ? c : c?._ || c || ""))
    .filter(Boolean)
    .join(" ");
}

/**
 * Major outlets: path-only signals (no body text needed).
 */
function urlIndicatesEnvironmentalNews(url) {
  if (!url || typeof url !== "string") return false;
  const u = url.toLowerCase();

  if (u.includes("theguardian.com/environment")) return true;
  if (u.includes("mongabay.com")) return true;

  if (/\/environment\//.test(u) || /\/environment\?/.test(u)) return true;
  if (/\/climate-change\//.test(u) || /\/climate\//.test(u)) return true;
  if (/\/conservation\//.test(u) || /\/biodiversity\//.test(u)) return true;
  if (/\/topic\/environment\//.test(u) || /\/topics\/environment\//.test(u)) return true;

  if (u.includes("abc.net.au")) {
    if (
      /\/news\/topic\/environment|\/news\/environment|\/news\/.*environment|\/news\/.*climate|\/news\/.*bushfire|\/news\/.*biodiversity|\/news\/.*wildlife|\/news\/.*reef|\/news\/.*barrier|\/news\/.*renewable|\/news\/.*energy|\/news\/.*water|\/news\/.*flood|\/news\/.*drought|\/news\/.*weather|\/news\/.*pollution|\/news\/.*waste|\/news\/.*recycl|\/news\/.*conservation|\/news\/.*natural-/i.test(
        u,
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Keyword / phrase match on title + summary + RSS categories.
 */
/** Built from stems that rarely appear outside environment / climate / nature coverage. */
const ENV_TOPIC_RE = new RegExp(
  [
    "climate",
    "conservation",
    "biodiversity",
    "wildlife",
    "ecosystem",
    "environmental?",
    "ecolog",
    "emissions?",
    "carbon",
    "renewable",
    "sustainab",
    "deforestation",
    "extinction",
    "pollution",
    "fossil fuels?",
    "methane",
    "net[\\s-]?zero",
    "greenhouse",
    "paris agreement",
    "cop\\s?[0-9]{2}",
    "great barrier reef",
    "barrier reef",
    "coral",
    "\\breef\\b",
    "marine",
    "\\bocean\\b",
    "estuary",
    "wetland",
    "rainforest",
    "\\bforest\\b",
    "habitat",
    "threatened species",
    "invasive species",
    "rewild",
    "deforest",
    "land clearing",
    "bushfire",
    "wildfire",
    "drought",
    "\\bflood",
    "cyclone",
    "heatwave",
    "sea level",
    "el niño",
    "la niña",
    "permafrost",
    "glacier",
    "ice sheet",
    "tundra",
    "desertification",
    "soil carbon",
    "blue carbon",
    "organic farming",
    "agroecolog",
    "overfish",
    "aquaculture",
    "water quality",
    "clean energy",
    "solar power",
    "wind farm",
    "battery storage",
    "electric vehicles?",
    "circular economy",
    "recycling",
    "compost",
    "landfill",
    "plastic waste",
    "air quality",
    "\\bozone\\b",
    "protected areas?",
    "national parks?",
    "indigenous rangers?",
    "landcare",
    "restoration",
    "regenerat",
    "nature[- ]based",
    "natural capital",
    "\\besg\\b",
    "environmental science",
    "flora",
    "fauna",
  ].join("|"),
  "i",
);

function textIndicatesEnvironmentalTopic(text) {
  if (!text || typeof text !== "string") return false;
  return ENV_TOPIC_RE.test(text);
}

/**
 * @param {{ title?: string; summary?: string; categories?: unknown; link?: string; contentSnippet?: string; content?: string }} item
 * @returns {boolean}
 */
export function isEnvironmentalArticleItem(item) {
  const link = typeof item.link === "string" ? item.link : "";
  if (urlIndicatesEnvironmentalNews(link)) return true;

  const title = item.title || "";
  const body = stripHtml(item.contentSnippet || item.content || "");
  const cats = normalizeCategories(item.categories);
  const blob = `${title}\n${body}\n${cats}`.slice(0, 8000);

  return textIndicatesEnvironmentalTopic(blob);
}
