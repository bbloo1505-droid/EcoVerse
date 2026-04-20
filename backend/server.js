import "./load-env.js";
import cors from "cors";
import express from "express";
import { handleChatPost } from "./chatHandler.js";
import { handleCareerTipsPost } from "./careerTipsHandler.js";
import { handleTipsWallGet, handleTipsWallPost } from "./tipsWallHandler.js";
import {
  handleHeroPhotoTodayGet,
  handleHeroPhotoSubmitPost,
  handleHeroPhotoSubmitMiddleware,
  handleAdminHeroPhotosGet,
  handleAdminHeroPhotoApprovePost,
  handleAdminHeroPhotoRejectPost,
} from "./heroPhotoHandler.js";
import { HERO_UPLOAD_DIR } from "./heroPhotoStore.js";
import { getContent, initializeContent, refreshAllContent } from "./contentService.js";

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.use(cors());
app.use(express.json());
app.use("/uploads/hero", express.static(HERO_UPLOAD_DIR));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "ecoverse-api", timestamp: new Date().toISOString() });
});

app.get("/api/content", (_req, res) => {
  res.json(getContent());
});

app.get("/api/news", (_req, res) => {
  res.json({ items: getContent().articles });
});

app.get("/api/opportunities", (_req, res) => {
  res.json({ items: getContent().opportunities });
});

app.get("/api/events", (_req, res) => {
  res.json({ items: getContent().events });
});

app.get("/api/memberships", (_req, res) => {
  res.json({ items: getContent().memberships });
});

app.post("/api/chat", (req, res) => {
  handleChatPost(req, res);
});

app.post("/api/career-tips", (req, res) => {
  handleCareerTipsPost(req, res);
});

app.get("/api/tips-wall", (req, res) => {
  void handleTipsWallGet(req, res);
});

app.post("/api/tips-wall", (req, res) => {
  void handleTipsWallPost(req, res);
});

app.get("/api/hero-photos/today", (req, res) => {
  void handleHeroPhotoTodayGet(req, res);
});

app.post("/api/hero-photos", handleHeroPhotoSubmitMiddleware, (req, res) => {
  void handleHeroPhotoSubmitPost(req, res);
});

app.get("/api/admin/hero-photos", (req, res) => {
  void handleAdminHeroPhotosGet(req, res);
});

app.post("/api/admin/hero-photos/:id/approve", (req, res) => {
  void handleAdminHeroPhotoApprovePost(req, res);
});

app.post("/api/admin/hero-photos/:id/reject", (req, res) => {
  void handleAdminHeroPhotoRejectPost(req, res);
});

app.post("/api/refresh", async (_req, res) => {
  try {
    const content = await refreshAllContent();
    res.json({ ok: true, refreshedAt: content.lastRefreshedAt, sourceErrors: content.sourceErrors });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error instanceof Error ? error.message : "Refresh failed",
    });
  }
});

initializeContent().then(() => {
  app.listen(port, () => {
    console.log(`EcoVerse API running on http://localhost:${port}`);
  });

  // Keep content fresh without manual refresh calls.
  setInterval(() => {
    refreshAllContent().catch((error) => {
      console.error("Scheduled refresh failed:", error);
    });
  }, 1000 * 60 * 60 * 6);
});
