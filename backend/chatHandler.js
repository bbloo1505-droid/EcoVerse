/**
 * OpenAI-compatible Chat Completions proxy — API key stays on the server only.
 * Use OPENAI_API_KEY or GROQ_API_KEY (not VITE_*).
 */

import { getLlmConfig } from "./llmConfig.js";
import { openAiErrorToUserMessage } from "./openAiErrors.js";

const SYSTEM_PROMPT = `You are EcoVerse Assistant, a helpful guide for people building careers in environmental work in Australia and Aotearoa New Zealand.

You help with:
- Career pathways: how to move into roles (e.g. ecology, environmental consulting, conservation, climate, water, policy, bush regeneration, marine science) given the user's background and experience level.
- Practical steps: study, volunteering, networking, professional bodies, certifications, and job-search tips.
- General questions about the environmental sector: trends, skills, and terminology.

Guidelines:
- Be encouraging, specific, and structured (use short headings or bullet steps when helpful).
- You are not a lawyer, migration agent, or medical professional — do not give legal, visa, or health advice; suggest consulting qualified professionals when relevant.
- When giving salary ranges or hiring practices, say they vary by employer and year and should be verified.
- If the user asks something outside environment/careers, answer briefly if harmless, then gently steer back to environmental careers when appropriate.
- Do not claim to have access to the user's EcoVerse account, saved jobs, or live job listings unless the app explicitly passes that context (it usually does not).`;

export async function handleChatPost(req, res) {
  const cfg = getLlmConfig();
  if (!cfg) {
    res.status(503).json({
      error: "not_configured",
      message:
        "The AI assistant is not configured. Add GROQ_API_KEY (free testing) or OPENAI_API_KEY to .env — see .env.example.",
    });
    return;
  }
  const { apiKey, baseUrl, model, provider } = cfg;

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "invalid_body", message: "Expected a non-empty messages array." });
    return;
  }

  const sanitized = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-24)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 12000) }));

  if (sanitized.length === 0) {
    res.status(400).json({ error: "invalid_messages", message: "No valid user/assistant messages." });
    return;
  }

  try {
    const r = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...sanitized],
        temperature: 0.65,
        max_tokens: 1800,
      }),
    });

    const raw = await r.text();
    if (!r.ok) {
      console.error("OpenAI error:", r.status, raw.slice(0, 500));
      const friendly = openAiErrorToUserMessage(r.status, raw, { provider });
      res.status(502).json({
        error: "upstream",
        message: friendly,
      });
      return;
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      res.status(502).json({ error: "parse", message: "Invalid response from AI service." });
      return;
    }

    const text = data.choices?.[0]?.message?.content?.trim() || "";
    if (!text) {
      res.status(502).json({ error: "empty", message: "No reply from the model." });
      return;
    }

    res.json({ message: text, model: data.model || model });
  } catch (e) {
    console.error("Chat handler:", e);
    res.status(500).json({
      error: "internal",
      message: e instanceof Error ? e.message : "Chat request failed.",
    });
  }
}
