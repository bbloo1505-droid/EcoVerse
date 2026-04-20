/**
 * Personalised career pathway tips — uses OpenAI with profile JSON (key stays server-side).
 */

import { getLlmConfig } from "./llmConfig.js";
import { openAiErrorToUserMessage } from "./openAiErrors.js";

const SYSTEM_PROMPT = `You are EcoVerse Career Coach, helping students and early-career people in Australia and Aotearoa New Zealand enter environmental careers.

You synthesise widely shared career advice from how people describe pathways online (forums, university sites, professional bodies, LinkedIn-style narratives, Landcare and volunteer networks, etc.). You do NOT claim to have scraped the live web or accessed private data.

Your response must use clear Markdown with exactly these top-level sections (use ## headings):

## Volunteering & early experience
Concrete types of roles, programs, or activities (e.g. Landcare, Bushcare, citizen science, local council programs), tailored to their location and target career.

## Networking & meeting the right people
Who to meet (e.g. professional bodies, meetups, conferences, alumni, LinkedIn), how to approach cold outreach respectfully, and student/early-career friendly events.

## Stepping stones
A realistic sequence: study/credentials if relevant, entry roles, projects, or certifications that commonly help — without guaranteeing any outcome.

## What you need to know
Skills, tools, regulatory/context awareness (e.g. EPBC at high level if relevant), and mindset — specific to their goal.

## Your next steps (this month)
3–5 bullet actions they can do immediately.

Rules:
- Be practical, encouraging, and honest about competition and variability.
- If the profile is thin, still give useful general guidance and say what they should add to their profile for better tailoring.
- No legal, migration, or medical advice.
- Do not invent specific job URLs or guarantee salaries.`;

export async function handleCareerTipsPost(req, res) {
  const cfg = getLlmConfig();
  if (!cfg) {
    res.status(503).json({
      error: "not_configured",
      message:
        "AI is not configured. Add GROQ_API_KEY (free testing) or OPENAI_API_KEY to .env — see .env.example.",
    });
    return;
  }
  const { apiKey, baseUrl, model, provider } = cfg;

  const { profile } = req.body || {};
  if (!profile || typeof profile !== "object") {
    res.status(400).json({ error: "invalid_body", message: "Expected profile object." });
    return;
  }

  const userContent = `Here is the student's profile as JSON. Generate the personalised career pathway plan as instructed.

${JSON.stringify(profile, null, 2)}`;

  try {
    const r = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        temperature: 0.65,
        max_tokens: 3500,
      }),
    });

    const raw = await r.text();
    if (!r.ok) {
      console.error("OpenAI career tips error:", r.status, raw.slice(0, 400));
      res.status(502).json({
        error: "upstream",
        message: openAiErrorToUserMessage(r.status, raw, { provider }),
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
      res.status(502).json({ error: "empty", message: "No content from the model." });
      return;
    }

    res.json({ markdown: text, model: data.model || model });
  } catch (e) {
    console.error("Career tips handler:", e);
    res.status(500).json({
      error: "internal",
      message: e instanceof Error ? e.message : "Request failed.",
    });
  }
}
