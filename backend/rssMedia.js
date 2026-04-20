/**
 * Pull hero/thumbnail URLs from RSS/Atom items (media tags, enclosures, or HTML in descriptions).
 */

function isHttpUrl(s) {
  if (!s || typeof s !== "string") return false;
  const t = s.trim();
  return /^https?:\/\//i.test(t) && !/^https?:\/\/$/i.test(t);
}

function absolutize(href, baseUrl) {
  if (!href || typeof href !== "string") return null;
  const h = href.trim();
  if (/^https?:\/\//i.test(h)) return h;
  if (h.startsWith("//")) return `https:${h}`;
  if (!baseUrl) return null;
  try {
    return new URL(h, baseUrl).href;
  } catch {
    return null;
  }
}

function isTrackingPixel(url) {
  return (
    /\/(spacer|pixel|track|beacon|1x1)[./]/i.test(url) ||
    /gravatar\.com\/avatar/i.test(url) ||
    /[?&]w=\d{1,2}\b/i.test(url)
  );
}

/** Skip favicons, tiny icons, spinners — keep real article/hero photos. */
function isLikelyDecorativeImage(url) {
  const u = (url || "").toLowerCase();
  if (!u) return true;
  if (/favicon|apple-touch-icon|icon\.png|icon\.ico|logo-small|logo_small|spinner|loading\.gif|placeholder|emoji|badge-/.test(u))
    return true;
  if (/\b(16|24|32|48|64)x(16|24|32|48|64)\b/.test(u)) return true;
  return false;
}

function isImageMime(t) {
  if (!t || typeof t !== "string") return true;
  const l = t.toLowerCase();
  if (l.includes("video") || l.includes("audio")) return false;
  return l.includes("image") || l.includes("jpeg") || l.includes("png") || l.includes("webp") || l === "";
}

function looksLikeImageFile(url) {
  return /\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(url || "");
}

function walkMediaNode(node) {
  if (!node) return null;
  if (typeof node === "string" && isHttpUrl(node)) return node.trim();
  if (typeof node === "object") {
    const medium = (node.$?.medium || node.medium || "").toString().toLowerCase();
    if (medium === "video" || medium === "audio") {
      if (Array.isArray(node)) {
        for (const x of node) {
          const u = walkMediaNode(x);
          if (u) return u;
        }
      }
      return null;
    }
    if (node.url && isHttpUrl(node.url)) return node.url.trim();
    if (node.$?.url && isHttpUrl(node.$.url)) return node.$.url.trim();
    if (node.$?.href && isHttpUrl(node.$.href)) return node.$.href.trim();
    if (node.href && isHttpUrl(node.href)) return node.href.trim();
    if (Array.isArray(node)) {
      for (const x of node) {
        const u = walkMediaNode(x);
        if (u) return u;
      }
    } else {
      for (const k of Object.keys(node)) {
        if (k === "$") continue;
        const child = node[k];
        if (child && typeof child === "object") {
          const u = walkMediaNode(child);
          if (u) return u;
        }
      }
    }
  }
  return null;
}

function itemLinkHref(item) {
  const L = item?.link;
  if (typeof L === "string") return L;
  if (L && typeof L === "object" && typeof L.href === "string") return L.href;
  const g = item?.guid;
  if (typeof g === "string" && /^https?:/i.test(g)) return g;
  return "";
}

/**
 * Collect image URL candidates from HTML snippets (order = preference).
 * @param {string} html
 * @param {string} baseUrl
 * @returns {string[]}
 */
export function collectImageUrlsFromHtml(html, baseUrl) {
  if (!html || typeof html !== "string") return [];
  const out = [];
  const seen = new Set();

  function pushRaw(raw) {
    if (!raw || typeof raw !== "string") return;
    const u = absolutize(raw.trim(), baseUrl);
    if (!u || !isHttpUrl(u)) return;
    if (seen.has(u)) return;
    seen.add(u);
    out.push(u);
  }

  const ogPatterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/gi,
    /<meta[^>]+name=["']twitter:image(?:\:src)?["'][^>]+content=["']([^"']+)["']/gi,
    /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/gi,
  ];
  for (const re of ogPatterns) {
    let m;
    const r = new RegExp(re.source, re.flags);
    while ((m = r.exec(html)) !== null) {
      pushRaw(m[1]);
    }
  }

  const bgRe = /background-image\s*:\s*url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  let bm;
  while ((bm = bgRe.exec(html)) !== null) {
    pushRaw(bm[1]);
  }

  const imgTagRe = /<img\b[^>]*>/gi;
  let im;
  while ((im = imgTagRe.exec(html)) !== null) {
    const tag = im[0];
    const attrs = [
      /\bsrc\s*=\s*["']([^"']+)["']/i,
      /\bsrc\s*=\s*([^\s>]+)/i,
      /\bdata-src\s*=\s*["']([^"']+)["']/i,
      /\bdata-lazy-src\s*=\s*["']([^"']+)["']/i,
      /\bdata-original\s*=\s*["']([^"']+)["']/i,
      /\bdata-srcset\s*=\s*["']([^"']+)["']/i,
      /\bsrcset\s*=\s*["']([^"']+)["']/i,
    ];
    for (const ar of attrs) {
      const mm = tag.match(ar);
      if (mm?.[1]) {
        let val = mm[1].trim();
        if (ar.source.includes("srcset")) {
          val = val.split(",")[0]?.trim().split(/\s+/)[0] || val;
        }
        pushRaw(val);
        break;
      }
    }
  }

  return out;
}

function pickBestImageUrl(candidates, baseUrl) {
  for (const raw of candidates) {
    const u = absolutize(typeof raw === "string" ? raw : raw?.url, baseUrl);
    if (!u || !isHttpUrl(u)) continue;
    if (isTrackingPixel(u)) continue;
    if (isLikelyDecorativeImage(u)) continue;
    return u;
  }
  for (const raw of candidates) {
    const u = absolutize(typeof raw === "string" ? raw : raw?.url, baseUrl);
    if (!u || !isHttpUrl(u)) continue;
    if (isTrackingPixel(u)) continue;
    return u;
  }
  return null;
}

function firstImageFromHtml(html, baseUrl) {
  const urls = collectImageUrlsFromHtml(html, baseUrl);
  return pickBestImageUrl(urls, baseUrl);
}

/**
 * @param {Record<string, unknown>} item - rss-parser item
 * @param {string} [link] - item link for resolving relative URLs
 * @returns {string | null}
 */
export function extractRssImageUrl(item, link) {
  const baseStr = link || itemLinkHref(item) || "";

  const directFeatured =
    (typeof item?.webfeedsFeaturedImage === "string" && item.webfeedsFeaturedImage) ||
    (typeof item?.["webfeeds:featuredImage"] === "string" && item["webfeeds:featuredImage"]) ||
    "";
  if (directFeatured && isHttpUrl(directFeatured)) {
    const abs = absolutize(directFeatured, baseStr);
    if (abs) return abs;
  }

  const enc = item?.enclosure;
  if (enc) {
    const list = Array.isArray(enc) ? enc : [enc];
    for (const e of list) {
      if (e?.url && isImageMime(e.type)) {
        const u = absolutize(e.url, baseStr);
        if (u && (looksLikeImageFile(u) || e.type?.toLowerCase().includes("image"))) return u;
      }
    }
    for (const e of list) {
      if (e?.url && looksLikeImageFile(e.url)) {
        const u = absolutize(e.url, baseStr);
        if (u) return u;
      }
    }
  }

  const mediaKeys = [
    "media:content",
    "media:thumbnail",
    "media:group",
    "itunes:image",
    "webfeeds:featuredImage",
    "webfeedsFeaturedImage",
    "featured_image",
  ];
  for (const k of mediaKeys) {
    const raw = item?.[k];
    const u = walkMediaNode(raw);
    if (u) {
      const abs = absolutize(u, baseStr);
      if (abs) return abs;
    }
  }

  const html =
    (typeof item?.content === "string" && item.content) ||
    (typeof item?.contentEncoded === "string" && item.contentEncoded) ||
    (typeof item?.["content:encoded"] === "string" && item["content:encoded"]) ||
    (typeof item?.contentSnippet === "string" && item.contentSnippet) ||
    (typeof item?.summary === "string" && item.summary) ||
    "";
  const fromHtml = firstImageFromHtml(html, baseStr);
  if (fromHtml) return fromHtml;

  if (item?.image && typeof item.image === "object" && item.image.url) {
    const u = absolutize(item.image.url, baseStr);
    if (u) return u;
  }
  if (typeof item?.image === "string" && isHttpUrl(item.image)) {
    return item.image.trim();
  }

  return null;
}
