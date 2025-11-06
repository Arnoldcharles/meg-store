import { NextResponse } from "next/server";
import { getProducts, searchProducts, getProductById } from "@/lib/products";

type Body = {
  message?: string;
};

function buildProductContext() {
  // Expose a compact product summary to the AI: id, name, price, category, description, stock
  const products = getProducts()
    .slice(0, 50)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      description: p.description,
      stock: p.stock,
    }));
  return JSON.stringify(products, null, 2);
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const message = body.message || "";
    console.log("/api/ai POST message:", message);

    // Basic intent detection for local handling (before calling OpenAI)
    const low = message.toLowerCase();

    // Recipe intent detection: if user asks for ingredients/recipe for a dish, assemble ingredients from product DB
    const recipeMatch = low.match(
      /ingredients? (for|to make) (.+)|recipe (for) (.+)|what do i need to (make|cook) (.+)/i
    );
    let dishName = "";
    if (recipeMatch) {
      // find the non-empty capture
      dishName = (recipeMatch[2] || recipeMatch[4] || recipeMatch[5] || "")
        .trim()
        .toLowerCase();
    } else {
      // also match simple patterns like 'ingredients for rice'
      const m = low.match(/ingredients? for (\w+)/i);
      if (m) dishName = (m[1] || "").toLowerCase();
    }

    if (dishName) {
      // Extended keyword map for common dishes
      const recipeKeywords: Record<string, string[]> = {
        rice: [
          "rice",
          "salt",
          "oil",
          "red oil",
          "groundnut",
          "crayfish",
          "stockfish",
        ],
        white: ["rice", "salt", "oil"],
        jollof: ["rice", "tomato", "red oil", "stockfish", "salt", "crayfish"],
        "fried rice": [
          "rice",
          "tomato",
          "red oil",
          "stockfish",
          "salt",
          "crayfish",
        ],
        stew: ["tomato", "red oil", "salt", "crayfish", "stockfish"],
        "pepper soup": ["stockfish", "crayfish", "salt"],
        "egusi soup": [
          "egusi",
          "stockfish",
          "crayfish",
          "salt",
          "waterleaf",
          "ugu",
        ],
        porridge: ["rice", "salt", "oil"],
      };

      // servings heuristic: parse 'for N people' or 'for N' from the message
      let servings = 2;
      const sv =
        message.match(/for\s*(\d+)\s*(people|persons|guests)?/i) ||
        message.match(/servings?\s*(\d+)/i);
      if (sv && sv[1]) servings = Math.max(1, Number(sv[1]));

      const keywords = recipeKeywords[dishName] ?? [dishName];
      const found: any[] = [];
      for (const kw of keywords) {
        const matches = searchProducts(kw);
        if (matches.length > 0) {
          const p = matches[0];
          // Quantity heuristics based on category and name
          let qty = "1 unit";
          const cat = (p.category || "").toLowerCase();
          const name = (p.name || "").toLowerCase();
          if (cat.includes("oil") || name.includes("oil")) {
            qty = servings <= 2 ? "200ml" : `${200 * servings}ml`;
          } else if (
            cat.includes("fish") ||
            name.includes("stockfish") ||
            name.includes("crayfish")
          ) {
            qty =
              servings <= 2 ? "1 pack" : `${Math.ceil(servings / 2)} pack(s)`;
          } else if (
            cat.includes("condiments") ||
            name.includes("salt") ||
            name.includes("egusi")
          ) {
            qty =
              servings <= 2
                ? "1 small pack"
                : `${Math.ceil(servings)} small pack(s)`;
          } else if (cat.includes("vegetables") || name.includes("leaf")) {
            qty = servings <= 2 ? "1 bunch" : `${servings} bunch(es)`;
          } else if (name.includes("rice")) {
            // approximate cups of rice per serving
            const cups = Math.max(1, Math.round(servings * 0.9));
            qty = `${cups} cup(s)`;
          }

          found.push({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            stock: p.stock,
            image: p.image,
            qty,
          });
        }
      }
      if (found.length > 0) {
        const reply = `Suggested ingredients for ${dishName} (for ${servings} people):`;
        // return structured ingredients and results so client can render links and actions
        return NextResponse.json({ reply, ingredients: found, results: found });
      }
      // if none found, fallthrough to normal behavior
    }

    // Recommendation intent (e.g. "recommend", "suggest", "what should I buy")
    const recommendMatch = low.match(
      /\b(recommend|suggest|what should i buy|best|top)\b/
    );
    if (recommendMatch) {
      // Try to extract a price ceiling like 'under 3000' or 'below 3000'
      const priceMatch = low.match(/under\s*(\d+)|below\s*(\d+)/);
      const priceLimit = priceMatch
        ? Number(priceMatch[1] || priceMatch[2])
        : undefined;
      // Try to detect a category word by scanning existing categories
      const categories = Array.from(
        new Set(getProducts().map((p) => p.category.toLowerCase()))
      );
      const category = categories.find((c) => low.includes(c)) || undefined;

      // Filter products: prefer bestSellers then by stock and price
      let candidates = getProducts().filter((p) => p.stock > 0);
      if (category)
        candidates = candidates.filter(
          (p) => p.category.toLowerCase() === category
        );
      if (priceLimit)
        candidates = candidates.filter((p) => p.price <= priceLimit);
      // sort by bestSeller then price ascending
      candidates.sort(
        (a, b) =>
          (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0) || a.price - b.price
      );
      const top = candidates
        .slice(0, 6)
        .map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          stock: p.stock,
          image: p.image || "",
        }));
      if (top.length > 0) {
        const reply = `Here are some recommendations${
          category ? ` in ${category}` : ""
        }${priceLimit ? ` under ${priceLimit}` : ""}:`;
        return NextResponse.json({ reply, results: top });
      }
    }

    // Help/site-usage intent
    const helpMatch = low.match(
      /how do i|how to |how can i|where is|how do you|help|checkout|login|cart/
    );
    if (helpMatch && !process.env.OPENAI_API_KEY) {
      // provide local help text when OpenAI isn't available
      const helpText = `Site help:\n- Search products: visit /products or use the search on the products page.\n- View product details: click a product or open /products/[id].\n- Add to cart: click 'Add to Cart' on a product page.\n- View cart & checkout: visit /cart and follow checkout prompts.\n- Login: go to /login to sign in.\nIf you tell me what you want to do (search, buy, or manage account) I can guide you.`;
      return NextResponse.json({ reply: helpText });
    }

    // If OPENAI_API_KEY is set, proxy to OpenAI Chat Completions and provide product context
    const key = process.env.OPENAI_API_KEY;
    const productContext = buildProductContext();
    if (key) {
      // Instruct the model to return a JSON object with a 'reply' string and an optional 'results' array
      const systemPrompt = `You are Meg Store assistant. Use the provided product catalog to answer user questions about products, prices, availability, and recommendations. Be factual and only reference products that exist in the catalog. When appropriate, return a JSON object ONLY (no extra text) with this shape:\n{\n  "reply": string,\n  "results": [ { "id": string, "name": string, "price": number, "category": string, "stock": number } ]\n}\nIf you cannot produce results, return { "reply": string }. Product catalog JSON:\n${productContext}`;

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
      const raw = json?.choices?.[0]?.message?.content || "";

      // Try to parse JSON from the model reply. Models sometimes add stray text; attempt to extract the JSON block.
      let parsed: any = null;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        // Attempt to extract JSON substring
        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
          const candidate = raw.slice(start, end + 1);
          try {
            parsed = JSON.parse(candidate);
          } catch (_) {
            parsed = null;
          }
        }
      }

      if (parsed && typeof parsed.reply === "string") {
        // Validate results shape if present
        if (Array.isArray(parsed.results)) {
          const validResults = parsed.results
            .filter((r: any) => r && typeof r.id === "string")
            .map((r: any) => {
              const id = String(r.id);
              const product = getProductById(id);
              return {
                id,
                name: String(r.name || (product?.name ?? "")),
                price: Number(r.price ?? product?.price ?? 0),
                category: String(r.category || (product?.category ?? "")),
                stock: Number(r.stock ?? product?.stock ?? 0),
                image: product?.image || "",
              };
            });
          return NextResponse.json({
            reply: parsed.reply,
            results: validResults,
          });
        }
        return NextResponse.json({ reply: parsed.reply });
      }

      // If parsing failed, return raw reply as fallback
      return NextResponse.json({ reply: raw });
    }

    // Fallback: use local product search to answer simple queries when no API key is configured
    const localMatches = searchProducts(message);
    if (localMatches.length > 0) {
      const top = localMatches.slice(0, 6);
      const lines = top.map(
        (p) =>
          `- ${p.name} — ₦${p.price} — category: ${p.category} — stock: ${p.stock}`
      );
      const reply = `I found ${
        localMatches.length
      } matching product(s):\n${lines.join("\n")}`;
      // Return structured results so client can render links
      const results = top.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        stock: p.stock,
        image: p.image || "",
      }));
      return NextResponse.json({ reply, results });
    }

    const fallback = `I don't have access to the external AI service in this environment. You asked: "${message}". I couldn't find matching products; try asking about categories (e.g., 'show me oil products') or product names.`;
    return NextResponse.json({ reply: fallback });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}

// Simple GET handler so visiting /api/ai in a browser or health checks work
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "AI API endpoint (POST) is available",
  });
}
