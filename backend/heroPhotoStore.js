import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, "cache");
export const HERO_UPLOAD_DIR = path.join(CACHE_DIR, "hero_uploads");
const META_FILE = path.join(CACHE_DIR, "hero_photos_meta.json");

/** @typedef {'pending' | 'approved' | 'rejected'} HeroPhotoStatus */

/**
 * @typedef {{
 *   id: string;
 *   storageName: string;
 *   caption: string;
 *   submitterName: string;
 *   status: HeroPhotoStatus;
 *   submittedAt: string;
 *   reviewedAt: string | null;
 *   approvedAt: string | null;
 * }} HeroPhotoRecord
 */

async function ensureDirs() {
  await fs.mkdir(HERO_UPLOAD_DIR, { recursive: true });
}

async function loadMeta() {
  await ensureDirs();
  try {
    const raw = await fs.readFile(META_FILE, "utf8");
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.photos)) return { photos: [] };
    return { photos: data.photos };
  } catch {
    return { photos: [] };
  }
}

async function saveMeta(photos) {
  await ensureDirs();
  await fs.writeFile(META_FILE, JSON.stringify({ photos }, null, 2), "utf8");
}

/**
 * @param {{ id: string; storageName: string; caption: string; submitterName: string }} input
 */
export async function createPendingPhoto(input) {
  const photos = (await loadMeta()).photos;
  const record = {
    id: input.id,
    storageName: input.storageName,
    caption: String(input.caption || "")
      .replace(/<[^>]*>/g, "")
      .trim()
      .slice(0, 280),
    submitterName: String(input.submitterName || "")
      .replace(/<[^>]*>/g, "")
      .trim()
      .slice(0, 80),
    status: /** @type {const} */ ("pending"),
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    approvedAt: null,
  };
  photos.push(record);
  await saveMeta(photos);
  return record;
}

export async function listPhotos(filterStatus) {
  const { photos } = await loadMeta();
  if (!filterStatus || filterStatus === "all") return [...photos].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  return photos.filter((p) => p.status === filterStatus).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function getPhotoById(id) {
  const { photos } = await loadMeta();
  return photos.find((p) => p.id === id) || null;
}

export async function setPhotoStatus(id, status) {
  const { photos } = await loadMeta();
  const idx = photos.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  photos[idx] = {
    ...photos[idx],
    status,
    reviewedAt: now,
    approvedAt: status === "approved" ? now : null,
  };
  await saveMeta(photos);
  if (status === "rejected") {
    try {
      await fs.unlink(path.join(HERO_UPLOAD_DIR, photos[idx].storageName));
    } catch {
      /* file may already be missing */
    }
  }
  return photos[idx];
}

/** Stable hash for calendar day (UTC YYYY-MM-DD). */
function dayKeyUtc(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Pick which approved photo shows for a given instant (changes each UTC calendar day).
 * @param {Date} [when]
 * @returns {HeroPhotoRecord | null}
 */
export async function pickPhotoForUtcDay(when = new Date()) {
  const { photos } = await loadMeta();
  const approved = photos.filter((p) => p.status === "approved").sort((a, b) => a.id.localeCompare(b.id));
  if (approved.length === 0) return null;
  const key = dayKeyUtc(when);
  const idx = hashString(key) % approved.length;
  return approved[idx];
}
