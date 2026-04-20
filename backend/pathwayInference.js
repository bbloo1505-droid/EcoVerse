import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

let cachedCategories = null;

function loadCategories() {
  if (cachedCategories) return cachedCategories;
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const fp = path.join(__dirname, "..", "src", "data", "environmentalPathways.json");
  const raw = JSON.parse(fs.readFileSync(fp, "utf8"));
  cachedCategories = raw.categories || [];
  return cachedCategories;
}

/** @returns {string[]} pathway ids (same ids as frontend career pathway filters). */
export function inferPathwayIds(title, summary) {
  const text = `${title || ""} ${summary || ""}`.toLowerCase();
  const ids = [];
  for (const c of loadCategories()) {
    if (!c.keywords?.length) continue;
    if (c.keywords.some((kw) => text.includes(String(kw).toLowerCase()))) {
      ids.push(c.id);
    }
  }
  return ids;
}
