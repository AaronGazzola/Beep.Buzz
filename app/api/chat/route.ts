import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Buzz, a friendly morse code companion chatting with Beep via morse code.

Rules:
- Maximum 5 words per response. Never exceed 5 words.
- ONLY use letters A through Z, digits 0 through 9, and spaces. Never use punctuation, emoji, or special characters.
- Always respond in UPPERCASE.
- Actually read and respond to what the user says. If they ask a question, answer it. If they share something, react to the specific thing they said. Do NOT give generic encouragement.
- Have a real conversation. Respond with substance relevant to the users message.
- One short thought per response. No sentences joined together.
- Never start your response with HI THERE. You already greeted them.

Example valid responses: THAT SOUNDS REALLY FUN, I LIKE PIZZA TOO, MAYBE TRY AGAIN LATER, THE ANSWER IS 42`;

interface ChatCompletionResponse {
  choices?: { message?: { content?: string }; text?: string }[];
}

async function fetchCompletion(apiKey: string, messages: { role: string; content: string }[]): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages,
      max_tokens: 30,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[AI Chat] OpenRouter API error:", errorBody);
    throw new Error("OpenRouter API error");
  }

  const data: ChatCompletionResponse = await response.json();
  const rawText = data.choices?.[0]?.message?.content
    || data.choices?.[0]?.text
    || "";

  console.error("[AI Chat] Raw text:", JSON.stringify(rawText));
  return rawText;
}

function sanitize(text: string): string {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("OPENROUTER_API_KEY is not configured");
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const { messages } = await request.json();

  const fullMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "assistant", content: "HI THERE" },
    ...messages,
  ];

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const rawText = await fetchCompletion(apiKey, fullMessages);

      if (!rawText) {
        console.error(`[AI Chat] Attempt ${attempt + 1}: No response content`);
        continue;
      }

      const sanitized = sanitize(rawText);

      if (!sanitized) {
        console.error(`[AI Chat] Attempt ${attempt + 1}: Empty after sanitization, raw was:`, JSON.stringify(rawText));
        continue;
      }

      return NextResponse.json({ text: sanitized });
    } catch (error) {
      console.error(`[AI Chat] Attempt ${attempt + 1} failed:`, error);
      if (attempt === 1) {
        return NextResponse.json({ error: "Failed to get AI response" }, { status: 502 });
      }
    }
  }

  return NextResponse.json({ error: "Empty AI response after retries" }, { status: 502 });
}
