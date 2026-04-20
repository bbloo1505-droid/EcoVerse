/**
 * When RSS items have no media, fetch the listing page and read og/twitter image meta tags.
 * Positive results are cached in-memory for the process lifetime.
 */

const positiveCache = new Map();

function isAllowedFetchUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const u = new URL(url.trim());
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function firstMetaContent(html, patterns) {
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

/**
 * @param {string} pageUrl
 * @param {{ timeoutMs?: number }} [opts]
 * @returns {Promise<string | null>}
 */
export async function fetchOpenGraphImage(pageUrl, opts = {}) {
  const timeoutMs = opts.timeoutMs ?? 6500;
  if (!isAllowedFetchUrl(pageUrl)) return null;
  const key = pageUrl.trim();
  if (positiveCache.has(key)) return positiveCache.get(key);

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  let referer = "";
  try {
    referer = new URL(key).origin + "/";
  } catch {
    /* ignore */
  }
  try {
    const res = await fetch(key, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        ...(referer ? { Referer: referer } : {}),
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!/html|xml/i.test(ct) && ct && !ct.includes("text/")) {
      return null;
    }
    const buf = await res.arrayBuffer();
    const slice = buf.byteLength > 240_000 ? buf.slice(0, 240_000) : buf;
    const html = new TextDecoder("utf-8").decode(slice);

    const raw =
      firstMetaContent(html, [
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
        /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+name=["']twitter:image:src["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
        /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
      ]) || null;

    if (!raw) return null;
    let absolute;
    try {
      absolute = new URL(raw, key).href;
    } catch {
      return null;
    }
    if (!/^https?:\/\//i.test(absolute)) return null;
    if (/gravatar\.com\/avatar/i.test(absolute)) return null;
    positiveCache.set(key, absolute);
    return absolute;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

/**
 * @param {Array<{ url?: string; image?: string } & Record<string, unknown>>} rows
 * @param {(row: object, image: string) => void} apply
 * @param {{ max?: number; concurrency?: number }} [opts]
 */
export async function enrichRowsWithOpenGraphImages(rows, apply, opts = {}) {
  const max = opts.max ?? 45;
  const concurrency = opts.concurrency ?? 4;
  const need = rows.filter(
    (r) => r && typeof r === "object" && !r.image && r.url && isAllowedFetchUrl(String(r.url)),
  );
  const slice = need.slice(0, max);

  for (let off = 0; off < slice.length; off += concurrency) {
    const batch = slice.slice(off, off + concurrency);
    await Promise.all(
      batch.map(async (row) => {
        const img = await fetchOpenGraphImage(String(row.url));
        if (img) apply(row, img);
      }),
    );
  }
}
