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

    // Try Gemini first, fallback to OpenAI
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
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

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          const output =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No output";
          return NextResponse.json({ result: output });
        }
      } catch (geminiError) {
        console.error("Gemini API error:", geminiError);
        // Fall through to OpenAI
      }
    }

    // Fallback to OpenAI
    if (openaiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
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
      const output = data.choices?.[0]?.message?.content || "No output";
      return NextResponse.json({ result: output });
    }

    return NextResponse.json(
      { error: "No AI API keys configured" },
      { status: 500 }
    );
  } catch (err) {
    console.error("AI service error:", err);
    return NextResponse.json({ error: "AI service error" }, { status: 500 });
  }
}
