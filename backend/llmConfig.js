/**
 * Resolve API key, base URL, and model for chat-style LLM calls.
 * Priority: OPENAI_API_KEY (full OpenAI or any OpenAI-compatible endpoint) → GROQ_API_KEY (free-tier testing default).
 */

import { refreshEnvFromDotenv } from "./envRefresh.js";

const GROQ_DEFAULT_BASE = "https://api.groq.com/openai/v1";
const GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile";
const OPENAI_DEFAULT_BASE = "https://api.openai.com/v1";
const OPENAI_DEFAULT_MODEL = "gpt-4o-mini";

/**
 * @returns {{ apiKey: string, baseUrl: string, model: string, provider: 'openai' | 'groq' } | null}
 */
export function getLlmConfig() {
  refreshEnvFromDotenv();

  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (openaiKey) {
    const baseUrl = (process.env.OPENAI_BASE_URL || OPENAI_DEFAULT_BASE).replace(/\/$/, "");
    const model = process.env.OPENAI_MODEL?.trim() || OPENAI_DEFAULT_MODEL;
    return { apiKey: openaiKey, baseUrl, model, provider: "openai" };
  }

  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (groqKey) {
    const baseUrl = (process.env.GROQ_BASE_URL || process.env.OPENAI_BASE_URL || GROQ_DEFAULT_BASE).replace(
      /\/$/,
      "",
    );
    const model =
      process.env.GROQ_MODEL?.trim() || process.env.OPENAI_MODEL?.trim() || GROQ_DEFAULT_MODEL;
    return { apiKey: groqKey, baseUrl, model, provider: "groq" };
  }

  return null;
}
