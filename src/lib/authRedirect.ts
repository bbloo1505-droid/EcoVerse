export function authCallbackUrl(): string {
  return `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`;
}
