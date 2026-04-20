import { defaultWallKey, isAllowedWallKey } from "./tipWallKeys.js";
import { addTip, getTipsForWall } from "./tipsWallStore.js";

export async function handleTipsWallGet(req, res) {
  try {
    const q = req.query.wall || req.query.wallKey;
    const wallKey = typeof q === "string" && q.trim() && isAllowedWallKey(q.trim()) ? q.trim() : defaultWallKey();
    const data = await getTipsForWall(wallKey);
    res.json(data);
  } catch (e) {
    console.error("tipsWall GET:", e);
    res.status(500).json({ error: "internal", message: "Could not load tips." });
  }
}

export async function handleTipsWallPost(req, res) {
  try {
    const { wallKey, body, displayName, dreamRole, wallLabel } = req.body || {};
    if (!wallKey || typeof wallKey !== "string" || !isAllowedWallKey(wallKey.trim())) {
      res.status(400).json({ error: "invalid_wall", message: "Invalid or missing wallKey for this tip wall." });
      return;
    }
    const result = await addTip({
      wallKey: wallKey.trim(),
      body,
      displayName,
      dreamRole,
      wallLabel,
    });
    res.status(201).json({ tip: result.tip, wallKey: result.wallKey, wallLabel: result.wallLabel });
  } catch (e) {
    const code = e instanceof Error ? e.message : "unknown";
    if (code === "body_too_short") {
      res.status(400).json({ error: code, message: "Tip should be at least 15 characters — share something concrete you learned." });
      return;
    }
    if (code === "body_too_long") {
      res.status(400).json({ error: code, message: "Tip is too long (max 800 characters)." });
      return;
    }
    console.error("tipsWall POST:", e);
    res.status(500).json({ error: "internal", message: "Could not save your tip." });
  }
}
