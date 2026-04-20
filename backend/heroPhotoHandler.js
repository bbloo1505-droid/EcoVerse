import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { randomUUID } from "node:crypto";
import {
  HERO_UPLOAD_DIR,
  createPendingPhoto,
  listPhotos,
  getPhotoById,
  setPhotoStatus,
  pickPhotoForUtcDay,
} from "./heroPhotoStore.js";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const allowedMime = new Set(["image/jpeg", "image/png", "image/webp"]);

function extForMime(mime) {
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return ".jpg";
}

export const heroPhotoUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      fs.mkdirSync(HERO_UPLOAD_DIR, { recursive: true });
      cb(null, HERO_UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
      const id = randomUUID();
      const ext = extForMime(file.mimetype);
      cb(null, `${id}${ext}`);
    },
  }),
  limits: { fileSize: MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!allowedMime.has(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, or WebP images are allowed."));
      return;
    }
    cb(null, true);
  },
}).single("photo");

function adminTokenOk(req) {
  const expected = process.env.ECOVERSE_ADMIN_TOKEN;
  if (!expected) return false;
  const got = req.headers["x-admin-token"];
  return typeof got === "string" && got === expected;
}

export async function handleHeroPhotoTodayGet(_req, res) {
  try {
    const photo = await pickPhotoForUtcDay();
    if (!photo) {
      res.json({
        imagePath: null,
        caption: null,
        credit: null,
        dayKeyUtc: null,
        hasPhoto: false,
      });
      return;
    }
    const d = new Date();
    const dayKeyUtc = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    res.json({
      imagePath: `/uploads/hero/${photo.storageName}`,
      caption: photo.caption || null,
      credit: photo.submitterName ? `Photo: ${photo.submitterName}` : "Community photo",
      dayKeyUtc,
      hasPhoto: true,
      photoId: photo.id,
    });
  } catch (e) {
    console.error("heroPhoto today:", e);
    res.status(500).json({ error: "internal", message: "Could not load hero photo." });
  }
}

export async function handleHeroPhotoSubmitPost(req, res) {
  try {
    if (!req.file) {
      res.status(400).json({ error: "missing_file", message: "Please attach a photo (JPEG, PNG, or WebP, max 5 MB)." });
      return;
    }
    const storageName = req.file.filename;
    const id = path.parse(storageName).name;
    const caption = typeof req.body?.caption === "string" ? req.body.caption : "";
    const submitterName = typeof req.body?.submitterName === "string" ? req.body.submitterName : "";
    const record = await createPendingPhoto({ id, storageName, caption, submitterName });
    res.status(201).json({
      ok: true,
      message: "Thanks — your photo is pending review. If it’s approved, it may appear as a future homepage background.",
      id: record.id,
    });
  } catch (e) {
    console.error("heroPhoto submit:", e);
    res.status(500).json({ error: "internal", message: "Could not save submission." });
  }
}

export function handleHeroPhotoSubmitMiddleware(req, res, next) {
  heroPhotoUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          res.status(400).json({ error: "too_large", message: "File must be 5 MB or smaller." });
          return;
        }
      }
      const msg = err instanceof Error ? err.message : "Upload failed.";
      res.status(400).json({ error: "upload", message: msg });
      return;
    }
    next();
  });
}

export async function handleAdminHeroPhotosGet(req, res) {
  if (!process.env.ECOVERSE_ADMIN_TOKEN) {
    res.status(503).json({
      error: "not_configured",
      message: "Set ECOVERSE_ADMIN_TOKEN on the API server to use the photo admin.",
    });
    return;
  }
  if (!adminTokenOk(req)) {
    res.status(401).json({ error: "unauthorized", message: "Invalid or missing X-Admin-Token header." });
    return;
  }
  try {
    const status = typeof req.query.status === "string" ? req.query.status : "pending";
    const allowed = new Set(["pending", "approved", "rejected", "all"]);
    const filter = allowed.has(status) ? status : "pending";
    const photos = await listPhotos(filter === "all" ? undefined : filter);
    res.json({ photos });
  } catch (e) {
    console.error("admin hero list:", e);
    res.status(500).json({ error: "internal", message: "Could not list photos." });
  }
}

export async function handleAdminHeroPhotoApprovePost(req, res) {
  if (!process.env.ECOVERSE_ADMIN_TOKEN) {
    res.status(503).json({ error: "not_configured", message: "Admin not configured." });
    return;
  }
  if (!adminTokenOk(req)) {
    res.status(401).json({ error: "unauthorized", message: "Invalid or missing X-Admin-Token header." });
    return;
  }
  try {
    const { id } = req.params;
    const existing = await getPhotoById(id);
    if (!existing) {
      res.status(404).json({ error: "not_found", message: "Photo not found." });
      return;
    }
    if (existing.status !== "pending") {
      res.status(400).json({ error: "bad_state", message: "Only pending photos can be approved." });
      return;
    }
    const updated = await setPhotoStatus(id, "approved");
    res.json({ ok: true, photo: updated });
  } catch (e) {
    console.error("admin approve:", e);
    res.status(500).json({ error: "internal", message: "Could not approve." });
  }
}

export async function handleAdminHeroPhotoRejectPost(req, res) {
  if (!process.env.ECOVERSE_ADMIN_TOKEN) {
    res.status(503).json({ error: "not_configured", message: "Admin not configured." });
    return;
  }
  if (!adminTokenOk(req)) {
    res.status(401).json({ error: "unauthorized", message: "Invalid or missing X-Admin-Token header." });
    return;
  }
  try {
    const { id } = req.params;
    const existing = await getPhotoById(id);
    if (!existing) {
      res.status(404).json({ error: "not_found", message: "Photo not found." });
      return;
    }
    if (existing.status !== "pending") {
      res.status(400).json({ error: "bad_state", message: "Only pending photos can be rejected." });
      return;
    }
    const updated = await setPhotoStatus(id, "rejected");
    res.json({ ok: true, photo: updated });
  } catch (e) {
    console.error("admin reject:", e);
    res.status(500).json({ error: "internal", message: "Could not reject." });
  }
}
