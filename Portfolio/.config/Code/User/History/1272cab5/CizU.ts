import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "edge"; // or "nodejs" if you prefer

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { text, mode } = body;

  if (!text) return NextResponse.json({ error: "Missing text" }, { status: 400 });

  const prompt =
    mode === "improve"
      ? `Improve the following text for clarity, grammar, and style. Output only the improved text.\n\n${text}`
      : `Summarize the following text into a concise paragraph or 5 bullet points. Output only the summary.\n\n${text}`;

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini", // choose a model you have access to
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI error", text);
      return NextResponse.json({ error: "OpenAI error" }, { status: 500 });
    }

    const j = await response.json();
    const output = j.choices?.[0]?.message?.content || j.choices?.[0]?.text || "No output";
    return NextResponse.json({ output });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI service error" }, { status: 500 });
  }
}
