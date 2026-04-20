import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import {
  TIP_WALL_PRESETS,
  defaultWallKey,
  isAllowedWallKey,
  labelForWallKey,
  slugifyWallKey,
  wallKeyForCustomRole,
} from "./tipWallKeys.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, "cache");
const FILE = path.join(CACHE_DIR, "community_tips.json");
const MAX_TIPS_PER_WALL = 250;

/** @typedef {{ id: string; body: string; displayName: string | null; createdAt: string; colorIndex: number; dreamRole?: string }} TipNote */

const SEED_WALLS = {
  "environmental-consultant": [
    {
      id: "seed-eco-consult",
      dreamRole: "Environmental consultant",
      body: "I shadowed a senior consultant for a day through a uni alumni intro — worth asking your careers office who might host a student for coffee. Bring one thoughtful question about a recent project they published.",
      displayName: "Alex",
      createdAt: "2025-03-02T10:00:00.000Z",
      colorIndex: 0,
    },
  ],
  "field-ecologist-bush-regen": [
    {
      id: "seed-field",
      dreamRole: "Field ecologist",
      body: "Weekend Bushcare + iNaturalist uploads gave me stories in interviews that grades alone couldn’t. Show you can ID common local species and follow safety on site.",
      displayName: "Jordan",
      createdAt: "2025-03-08T14:30:00.000Z",
      colorIndex: 2,
    },
  ],
  "climate-policy-analyst": [
    {
      id: "seed-policy",
      dreamRole: "Climate policy analyst",
      body: "I wrote a one-page brief on one bill in plain English and sent it to two NGOs — one replied and I ended up volunteering on submissions. Start small and specific.",
      displayName: "Ravi",
      createdAt: "2025-03-12T09:15:00.000Z",
      colorIndex: 4,
    },
  ],
};

function sanitizeLine(s, max) {
  return String(s || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function inferWallKeyFromDreamRole(dreamRole) {
  const d = (dreamRole || "").trim().toLowerCase();
  for (const p of TIP_WALL_PRESETS) {
    if (d === p.label.toLowerCase()) return p.key;
  }
  for (const p of TIP_WALL_PRESETS) {
    const pl = p.label.toLowerCase();
    const head = pl.slice(0, Math.min(18, pl.length));
    if (head && d.includes(head)) return p.key;
  }
  return wallKeyForCustomRole(dreamRole || "general");
}

/**
 * Migrate legacy flat array to v2 { version, wallLabels, walls }.
 * @param {unknown} raw
 */
function normalizeStore(raw) {
  if (raw && typeof raw === "object" && !Array.isArray(raw) && raw.walls && typeof raw.walls === "object") {
    return {
      version: 2,
      wallLabels: typeof raw.wallLabels === "object" && raw.wallLabels ? raw.wallLabels : {},
      walls: raw.walls,
    };
  }
  if (Array.isArray(raw)) {
    const walls = {};
    const wallLabels = {};
    for (const tip of raw) {
      if (!tip || typeof tip !== "object") continue;
      const wk = inferWallKeyFromDreamRole(tip.dreamRole || "");
      if (!walls[wk]) walls[wk] = [];
      walls[wk].push(tip);
      if (wk.startsWith("custom-") && tip.dreamRole && !wallLabels[wk]) {
        wallLabels[wk] = String(tip.dreamRole).slice(0, 120);
      }
    }
    return { version: 2, wallLabels, walls };
  }
  return { version: 2, wallLabels: {}, walls: { ...SEED_WALLS } };
}

async function readStore() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    const normalized = normalizeStore(parsed);
    if (Array.isArray(parsed)) {
      await writeStore(normalized).catch(() => {});
    }
    return normalized;
  } catch {
    return { version: 2, wallLabels: {}, walls: { ...SEED_WALLS } };
  }
}

async function ensureStore() {
  try {
    await fs.access(FILE);
  } catch {
    const initial = { version: 2, wallLabels: {}, walls: { ...SEED_WALLS } };
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function writeStore(store) {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function getTipsForWall(wallKey) {
  await ensureStore();
  const store = await readStore();
  const key = isAllowedWallKey(wallKey) ? wallKey : defaultWallKey();
  const tips = Array.isArray(store.walls[key]) ? store.walls[key] : [];
  return {
    tips: [...tips].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    wallKey: key,
    wallLabel: labelForWallKey(key, store.wallLabels),
    wallLabels: store.wallLabels,
  };
}

/**
 * @param {{ wallKey: string; body: string; displayName?: string; dreamRole?: string; wallLabel?: string }} input
 */
export async function addTip(input) {
  const wallKeyRaw = sanitizeLine(input.wallKey, 70);
  const wallKey = isAllowedWallKey(wallKeyRaw) ? wallKeyRaw : defaultWallKey();
  const body = sanitizeLine(input.body, 800);
  const displayName = sanitizeLine(input.displayName || "", 50) || null;
  const dreamRole = sanitizeLine(input.dreamRole || "", 120) || null;
  const wallLabel = sanitizeLine(input.wallLabel || "", 120) || null;

  if (body.length < 15) throw new Error("body_too_short");
  if (body.length > 800) throw new Error("body_too_long");

  const store = await readStore();
  if (!store.wallLabels) store.wallLabels = {};
  if (!store.walls) store.walls = {};

  if (wallKey.startsWith("custom-") && wallLabel && wallLabel.length >= 2) {
    store.wallLabels[wallKey] = wallLabel;
  }

  const note = {
    id: randomUUID(),
    dreamRole: dreamRole || labelForWallKey(wallKey, store.wallLabels),
    body,
    displayName,
    createdAt: new Date().toISOString(),
    colorIndex: Math.floor(Math.random() * 6),
  };

  const existing = Array.isArray(store.walls[wallKey]) ? store.walls[wallKey] : [];
  const next = [note, ...existing].slice(0, MAX_TIPS_PER_WALL);
  store.walls[wallKey] = next;
  await writeStore(store);
  return { tip: note, wallKey, wallLabel: labelForWallKey(wallKey, store.wallLabels) };
}
