export type ChatMessage = { role: "user" | "assistant"; content: string };

function chatEndpoint(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (explicit) return `${explicit}/api/chat`;
  if (import.meta.env.DEV) return "/api/chat";
  return "http://localhost:8787/api/chat";
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<{ message: string }> {
  const response = await fetch(chatEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  let data: { message?: string; error?: string } = {};
  try {
    data = (await response.json()) as { message?: string; error?: string };
  } catch {
    throw new Error(`Chat request failed (${response.status})`);
  }
  if (!response.ok) {
    const detail = data.message || data.error || `Request failed (${response.status})`;
    throw new Error(detail);
  }
  if (!data.message) throw new Error("No reply from assistant.");
  return { message: data.message };
}
