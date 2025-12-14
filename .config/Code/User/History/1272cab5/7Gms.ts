import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { text, mode } = await req.json();

    if (!text || !mode) {
      return NextResponse.json({ error: "Missing text or mode" }, { status: 400 });
    }

    // Construct prompt for AI
    const prompt =
      mode === "improve"
        ? `Improve the following text for clarity, grammar, and style. Output only the improved text.\n\n${text}`
        : mode === "summarize"
        ? `Summarize the following text into a concise paragraph or 5 bullet points. Output only the summary.\n\n${text}`
        : `Process the following text: ${text}`;

    // Use Gemini AI via GEMINI_API_KEY (no OpenAI fallback)
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      return NextResponse.json(
        { error: "No Gemini API key configured (GEMINI_API_KEY)" },
        { status: 500 }
      );
    }

    try {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!geminiResponse.ok) {
        const txt = await geminiResponse.text();
        console.error("Gemini API error:", txt);
        return NextResponse.json({ error: "Gemini API error" }, { status: 500 });
      }

      const geminiData = await geminiResponse.json();
      const output = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No output";
      return NextResponse.json({ result: output });
    } catch (err) {
      console.error("Gemini API exception:", err);
      return NextResponse.json({ error: "Gemini API exception" }, { status: 500 });
    }
  } catch (err) {
    console.error("AI service error:", err);
    return NextResponse.json({ error: "AI service error" }, { status: 500 });
  }
}
