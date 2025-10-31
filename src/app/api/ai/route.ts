import { NextResponse } from "next/server";
import { getProducts, searchProducts } from "@/lib/products";

type Body = {
  message?: string;
};

function buildProductContext() {
  // Expose a compact product summary to the AI: id, name, price, category, description, stock
  const products = getProducts()
    .slice(0, 50)
    .map((p) => ({ id: p.id, name: p.name, price: p.price, category: p.category, description: p.description, stock: p.stock }));
  return JSON.stringify(products, null, 2);
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const message = body.message || "";
    console.log("/api/ai POST message:", message);

    // If OPENAI_API_KEY is set, proxy to OpenAI Chat Completions and provide product context
    const key = process.env.OPENAI_API_KEY;
    const productContext = buildProductContext();
    if (key) {
      const systemPrompt = `You are Meg Store assistant. Use the provided product catalog to answer user questions about products, prices, availability, and recommendations. Be factual and only reference products that exist in the catalog. Product catalog JSON:\n${productContext}`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          max_tokens: 400,
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

    // Fallback: use local product search to answer simple queries when no API key is configured
    const localMatches = searchProducts(message);
    if (localMatches.length > 0) {
      const top = localMatches.slice(0, 6);
      const lines = top.map((p) => `- ${p.name} — ₦${p.price} — category: ${p.category} — stock: ${p.stock} — /products/${p.id}`);
      const reply = `I found ${localMatches.length} matching product(s):\n${lines.join("\n")}`;
      return NextResponse.json({ reply });
    }

    const fallback = `I don't have access to the external AI service in this environment. You asked: "${message}". I couldn't find matching products; try asking about categories (e.g., 'show me oil products') or product names.`;
    return NextResponse.json({ reply: fallback });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

// Simple GET handler so visiting /api/ai in a browser or health checks work
export async function GET() {
  return NextResponse.json({ status: "ok", message: "AI API endpoint (POST) is available" });
}
