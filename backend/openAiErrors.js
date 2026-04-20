/**
 * Turn upstream (OpenAI-compatible) JSON error body into a short message for the app (no secrets).
 * @param {number} status HTTP status from upstream
 * @param {string} raw Response body text
 * @param {{ provider?: 'openai' | 'groq' }} [opts]
 */
export function openAiErrorToUserMessage(status, raw, opts = {}) {
  const provider = opts.provider || "openai";
  const billingHint =
    provider === "groq"
      ? "Open console.groq.com and check your account limits or billing."
      : "Open platform.openai.com → Billing, add a payment method or buy credits, then try again.";

  let type = "";
  let msg = "";
  try {
    const j = JSON.parse(raw);
    type = j?.error?.type || j?.error?.code || "";
    msg = typeof j?.error?.message === "string" ? j.error.message : "";
  } catch {
    /* ignore */
  }

  if (status === 401) {
    return "The API rejected the API key (invalid or revoked). Check your key in .env and create a new one if needed.";
  }
  if (status === 429 && (type === "insufficient_quota" || /insufficient_quota|quota/i.test(raw))) {
    return `Your account has no credits or billing may be required. ${billingHint}`;
  }
  if (status === 429) {
    return "Rate limit — try again in a minute.";
  }
  if (msg && msg.length < 400) {
    return msg;
  }
  return "The AI service returned an error. Try again in a moment.";
}
