/** Prevent open redirects from ?next= (must be same-origin path). */
export function safeAuthRedirectPath(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return "/home";
  const t = next.trim();
  if (!t.startsWith("/") || t.startsWith("//") || t.includes("://")) return "/home";
  return t;
}

export function authCallbackUrl(nextPath: string = "/home"): string {
  const n = encodeURIComponent(safeAuthRedirectPath(nextPath));
  return `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?next=${n}`;
}
