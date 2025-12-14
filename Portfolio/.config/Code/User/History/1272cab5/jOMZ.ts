// app/api/ai/summarize/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // or "nodejs" if you prefer

export async function POST(req: NextRequest) {
  const { text, mode } = await req.json();

  if (!text || !mode) {
    return NextResponse.json({ error: "Missing text or mode" }, { status: 400 });
  }

  // Construct prompt for AI
  const prompt =
    mode === "improve"
      ? `Improve the following text for clarity, grammar, and style. Output only the improved text.\n\n${text}`
      : `Summarize the following text into a concise paragraph or 5 bullet points. Output only the summary.\n\n${text}`;

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or gpt-4, gpt-4o if you have access
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI API error:", text);
      return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
    }

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || "No output";

    return NextResponse.json({ output });
  } catch (err) {
    console.error("AI service error:", err);
    return NextResponse.json({ error: "AI service error" }, { status: 500 });
  }
}
