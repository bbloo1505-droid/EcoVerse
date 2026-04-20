/**
 * Preset dream roles for tip walls — keep label strings in sync with `src/lib/dreamRoles.ts`.
 * (Backend cannot import TS; duplicate list here.)
 */
export const TIP_WALL_PRESET_LABELS = [
  "Environmental consultant",
  "Field ecologist / bush regen",
  "Marine scientist",
  "Climate policy analyst",
  "Sustainability / ESG advisor",
  "Environmental engineer",
  "Conservation NGO program officer",
  "Park ranger / land manager",
  "Environmental educator",
  "Waste / circular economy specialist",
  "Water quality scientist",
  "Renewable energy project developer",
];

export function slugifyWallKey(label) {
  return String(label || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export const TIP_WALL_PRESETS = TIP_WALL_PRESET_LABELS.map((label) => ({
  key: slugifyWallKey(label),
  label,
}));

export function defaultWallKey() {
  return TIP_WALL_PRESETS[0].key;
}

export function wallKeyForCustomRole(customRole) {
  const base = slugifyWallKey(customRole);
  const suffix = (base || "role").slice(0, 44);
  return `custom-${suffix}`;
}

export function isAllowedWallKey(key) {
  if (!key || typeof key !== "string") return false;
  if (TIP_WALL_PRESETS.some((w) => w.key === key)) return true;
  return /^custom-[a-z0-9-]{2,50}$/.test(key);
}

export function labelForWallKey(key, wallLabels) {
  const preset = TIP_WALL_PRESETS.find((w) => w.key === key);
  if (preset) return preset.label;
  if (key?.startsWith("custom-") && wallLabels && typeof wallLabels[key] === "string") {
    return wallLabels[key];
  }
  if (key?.startsWith("custom-")) {
    return key
      .slice("custom-".length)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return key || "Tip wall";
}
