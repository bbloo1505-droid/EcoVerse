import type { HeroPhotoRecord, TodayHeroPhotoResponse } from "@/types/heroPhoto";

function apiBase(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (import.meta.env.DEV) return "";
  return "http://localhost:8787";
}

/** Resolve `/uploads/...` paths against the API host when the app is not same-origin. */
export function resolvePublicMediaUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = apiBase();
  if (!base) return path;
  return `${base}${path}`;
}

function todayEndpoint(): string {
  const b = apiBase();
  return b ? `${b}/api/hero-photos/today` : "/api/hero-photos/today";
}

export async function fetchTodayHeroPhoto(): Promise<TodayHeroPhotoResponse & { imageUrl: string | null }> {
  const response = await fetch(todayEndpoint());
  const data = (await response.json()) as TodayHeroPhotoResponse;
  if (!response.ok) {
    return {
      imagePath: null,
      imageUrl: null,
      caption: null,
      credit: null,
      dayKeyUtc: null,
      hasPhoto: false,
    };
  }
  const imageUrl = data.hasPhoto && data.imagePath ? resolvePublicMediaUrl(data.imagePath) : null;
  return { ...data, imageUrl };
}

export async function submitHeroPhoto(form: FormData): Promise<{ ok: boolean; message?: string }> {
  const b = apiBase();
  const url = b ? `${b}/api/hero-photos` : "/api/hero-photos";
  const response = await fetch(url, { method: "POST", body: form });
  const data = (await response.json()) as { ok?: boolean; message?: string; error?: string };
  if (!response.ok) {
    throw new Error(data.message || data.error || `Upload failed (${response.status})`);
  }
  return { ok: Boolean(data.ok), message: data.message };
}

function adminHeaders(token: string): HeadersInit {
  return { "X-Admin-Token": token };
}

export async function adminListHeroPhotos(
  token: string,
  status: "pending" | "approved" | "rejected" | "all" = "pending",
): Promise<{ photos: HeroPhotoRecord[] }> {
  const b = apiBase();
  const q = new URLSearchParams({ status });
  const url = b ? `${b}/api/admin/hero-photos?${q}` : `/api/admin/hero-photos?${q}`;
  const response = await fetch(url, { headers: adminHeaders(token) });
  const data = (await response.json()) as { photos?: HeroPhotoRecord[]; message?: string; error?: string };
  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed (${response.status})`);
  }
  if (!Array.isArray(data.photos)) throw new Error("Invalid response.");
  return { photos: data.photos };
}

export async function adminApproveHeroPhoto(token: string, id: string): Promise<void> {
  const b = apiBase();
  const url = b ? `${b}/api/admin/hero-photos/${encodeURIComponent(id)}/approve` : `/api/admin/hero-photos/${encodeURIComponent(id)}/approve`;
  const response = await fetch(url, { method: "POST", headers: adminHeaders(token) });
  const data = (await response.json()) as { message?: string; error?: string };
  if (!response.ok) throw new Error(data.message || data.error || `Approve failed (${response.status})`);
}

export async function adminRejectHeroPhoto(token: string, id: string): Promise<void> {
  const b = apiBase();
  const url = b ? `${b}/api/admin/hero-photos/${encodeURIComponent(id)}/reject` : `/api/admin/hero-photos/${encodeURIComponent(id)}/reject`;
  const response = await fetch(url, { method: "POST", headers: adminHeaders(token) });
  const data = (await response.json()) as { message?: string; error?: string };
  if (!response.ok) throw new Error(data.message || data.error || `Reject failed (${response.status})`);
}
