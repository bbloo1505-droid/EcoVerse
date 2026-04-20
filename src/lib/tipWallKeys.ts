import { DREAM_ROLE_PRESETS, OTHER_PRESET } from "@/lib/dreamRoles";

export function slugifyWallKey(label: string): string {
  return String(label || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export const TIP_WALL_PRESETS = DREAM_ROLE_PRESETS.filter((l) => l !== OTHER_PRESET).map((label) => ({
  key: slugifyWallKey(label),
  label,
}));

export const DEFAULT_TIP_WALL_KEY = TIP_WALL_PRESETS[0]?.key ?? "environmental-consultant";

export function wallKeyForCustomRole(customRole: string): string {
  const base = slugifyWallKey(customRole);
  const suffix = (base || "role").slice(0, 44);
  return `custom-${suffix}`;
}

export function isValidWallKey(key: string | undefined): boolean {
  if (!key) return false;
  if (TIP_WALL_PRESETS.some((w) => w.key === key)) return true;
  return /^custom-[a-z0-9-]{2,50}$/.test(key);
}

export function labelForWallKey(key: string, wallLabels?: Record<string, string>): string {
  const preset = TIP_WALL_PRESETS.find((w) => w.key === key);
  if (preset) return preset.label;
  if (key.startsWith("custom-") && wallLabels?.[key]) return wallLabels[key];
  if (key.startsWith("custom-")) {
    return key
      .slice("custom-".length)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return key;
}
