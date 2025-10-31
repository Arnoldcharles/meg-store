import { NextResponse } from "next/server";

type Body = {
  message?: string;
};

export async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const message = body.message || "";
    console.log("/api/ai POST message:", message);

    // If OPENAI_API_KEY is set, proxy to OpenAI Chat Completions
    const key = process.env.OPENAI_API_KEY;
    if (key) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
          max_tokens: 300,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: text }, { status: 502 });
      }

      const json = await res.json();
      const reply = json?.choices?.[0]?.message?.content || "";
      return NextResponse.json({ reply });
    }

    // Fallback mock response when no API key
    const fallback = `I don't have access to the external AI service in this environment. You asked: "${message}". Try asking about product categories, prices, or features and I'll give suggestions based on the store data.`;
    return NextResponse.json({ reply: fallback });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

// Simple GET handler so visiting /api/ai in a browser or health checks work
export async function GET() {
  return NextResponse.json({ status: "ok", message: "AI API endpoint (POST) is available" });
}
