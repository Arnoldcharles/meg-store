"use client";

import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    // Load persisted messages or show welcome
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meg_ai_messages");
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
          return;
        } catch (e) {
          // fallthrough to default
        }
      }
    }

    setMessages([
      {
        id: "m-0",
        role: "assistant",
        text: "Hi! I'm MegStore Assistant. Ask me about products, recommendations, or how to use the site.",
      },
    ]);
  }, []);

  useEffect(() => {
    // scroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    // persist
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("meg_ai_messages", JSON.stringify(messages));
      } catch (e) {
        // ignore
      }
    }
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) {
        const textErr = await res.text();
        throw new Error(`API error: ${res.status} ${textErr}`);
      }
      const data = await res.json();
  const reply = data?.reply || "Sorry, I couldn't generate a response.";
  const ingredients = Array.isArray(data?.ingredients) ? data.ingredients : undefined;

      // If structured results are returned, append them as a special assistant message
      if (ingredients && ingredients.length > 0) {
        const assistantMsg: Message = { id: `a-${Date.now()}`, role: "assistant", text: reply };
        setMessages((m) => [...m, assistantMsg]);
        setTimeout(() => {
          setMessages((m) => [
            ...m,
            { id: `ing-${Date.now()}`, role: "assistant", text: JSON.stringify({ ingredients }) },
          ]);
        }, 50);
      } else if (Array.isArray(data?.results) && data.results.length > 0) {
        const assistantMsg: Message = { id: `a-${Date.now()}`, role: "assistant", text: reply };
        setMessages((m) => [...m, assistantMsg]);
        // Append a pseudo-message for results (client will render results from latest API response state)
        setTimeout(() => {
          setMessages((m) => [
            ...m,
            { id: `r-${Date.now()}`, role: "assistant", text: JSON.stringify(data.results) },
          ]);
        }, 50);
      } else {
        const assistantMsg: Message = { id: `a-${Date.now()}`, role: "assistant", text: reply };
        setMessages((m) => [...m, assistantMsg]);
      }
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { id: `a-err-${Date.now()}`, role: "assistant", text: err?.message || "There was an error contacting the AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") send();
  };

  const clearHistory = (confirmFirst = true) => {
    if (confirmFirst) {
      try {
        const ok = window.confirm("Clear all AI chat history? This will remove saved messages.");
        if (!ok) return;
      } catch (e) {
        // if window.confirm isn't available, proceed
      }
    }
    setMessages([]);
    try {
      localStorage.removeItem("meg_ai_messages");
      localStorage.removeItem("meg_ai_results");
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-semibold mb-4">AI Assistant</h2>
      <div
        ref={listRef}
        className="h-64 overflow-y-auto border rounded-md p-3 space-y-3 bg-gray-50"
      >
        {messages.map((m) => {
          // detect pseudo result messages which are JSON arrays or objects with results/ingredients
          let isResults = false;
          let results: any[] = [];
          if (m.role === "assistant") {
            try {
              const parsed = JSON.parse(m.text);
              if (Array.isArray(parsed)) {
                isResults = true;
                results = parsed;
              } else if (parsed && Array.isArray(parsed.results)) {
                isResults = true;
                results = parsed.results;
              } else if (parsed && Array.isArray(parsed.ingredients)) {
                isResults = true;
                results = parsed.ingredients;
              }
            } catch (e) {
              // not JSON, render normally
            }
          }

          return (
            <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={`inline-block px-3 py-2 rounded-lg text-sm ${
                  m.role === "user" ? "bg-green-600 text-white" : "bg-white text-gray-800"
                } shadow`}
              >
                {isResults ? "Search results:" : m.text}
              </div>

              {isResults && (
                <>
                  {/* If the parsed message contains ingredients specifically, render ingredient chips first */}
                  {Array.isArray(results) && results.length > 0 && results[0]?.qty && (
                    <div className="mb-3 grid grid-cols-1 gap-2">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => {
                            // add all ingredients to cart
                            for (const ing of results) {
                              try {
                                // add with parsed qty: if qty contains a number, use it, otherwise default 1
                                const numMatch = String(ing.qty).match(/(\d+)/);
                                const q = numMatch ? Math.max(1, Number(numMatch[1])) : 1;
                                addToCart({ id: ing.id, name: ing.name, image: ing.image || "", description: ing.name, price: ing.price, category: ing.category, stock: ing.stock } as any, q);
                              } catch (e) {
                                // ignore add errors
                              }
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Add all ingredients to cart
                        </button>
                      </div>
                      {results.map((ing) => (
                        <div key={ing.id} className="flex items-center gap-3 bg-white p-2 rounded shadow-sm">
                          <div className="w-10 h-10 relative">
                            <Image src={ing.image || "/file.svg"} alt={ing.name} fill className="object-cover rounded" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{ing.name}</div>
                            <div className="text-xs text-gray-500">{ing.qty} • ₦{ing.price}</div>
                          </div>
                          <Link href={`/products/${ing.id}`} className="text-green-600 underline">View</Link>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.map((r) => (
                      <div key={r.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex">
                        <div className="w-28 h-28 relative">
                          <Image
                            src={r.image || "/file.svg"}
                            alt={r.name}
                            fill
                            sizes="(max-width: 768px) 96px, 112px"
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="font-semibold text-gray-800">{r.name}</div>
                            <div className="text-sm text-gray-500">{r.category}</div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-50 text-green-700 font-bold px-2 py-1 rounded">₦{r.price}</div>
                              <div className="text-xs text-gray-400">stock: {r.stock}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link href={`/products/${r.id}`} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">View product</Link>
                              <a href={`/products/${r.id}`} target="_blank" rel="noreferrer" className="text-xs text-gray-500 underline">Open</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about a product, e.g. 'show me wireless headphones under $50'"
        />
        <button
          onClick={send}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
        <button
          onClick={() => clearHistory(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Clear history
        </button>
      </div>
    </div>
  );
}
