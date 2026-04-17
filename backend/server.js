import cors from "cors";
import express from "express";
import { getContent, initializeContent, refreshAllContent } from "./contentService.js";

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.use(cors());
app.use(express.json());

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
});
