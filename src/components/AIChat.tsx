"use client";

import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { uniqueId } from "@/lib/uid";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};
export default function AIChat({ full }: { full?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [backupMessages, setBackupMessages] = useState<Message[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingClearType, setPendingClearType] = useState<
    "all" | "results" | null
  >(null);
  const [backupResults, setBackupResults] = useState<string | null>(null);
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

    const userMsg: Message = { id: uniqueId("u"), role: "user", text };
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
      const ingredients = Array.isArray(data?.ingredients)
        ? data.ingredients
        : undefined;

      // If structured results are returned, append them as a special assistant message
      if (ingredients && ingredients.length > 0) {
        const assistantMsg: Message = {
          id: uniqueId("a"),
          role: "assistant",
          text: reply,
        };
        setMessages((m) => [...m, assistantMsg]);
        setTimeout(() => {
          setMessages((m) => [
            ...m,
            {
              id: uniqueId("ing"),
              role: "assistant",
              text: JSON.stringify({ ingredients }),
            },
          ]);
        }, 50);
      } else if (Array.isArray(data?.results) && data.results.length > 0) {
        const assistantMsg: Message = {
          id: uniqueId("a"),
          role: "assistant",
          text: reply,
        };
        setMessages((m) => [...m, assistantMsg]);
        // Append a pseudo-message for results (client will render results from latest API response state)
        setTimeout(() => {
          setMessages((m) => [
            ...m,
            {
              id: uniqueId("r"),
              role: "assistant",
              text: JSON.stringify(data.results),
            },
          ]);
        }, 50);
      } else {
        const assistantMsg: Message = {
          id: uniqueId("a"),
          role: "assistant",
          text: reply,
        };
        setMessages((m) => [...m, assistantMsg]);
      }
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        {
          id: uniqueId("a-err"),
          role: "assistant",
          text: err?.message || "There was an error contacting the AI service.",
        },
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
      // open custom modal to confirm
      setPendingClearType("all");
      setShowModal(true);
      return;
    }
    // backup for undo
    setBackupMessages(messages);
    setMessages([]);
    try {
      localStorage.removeItem("meg_ai_messages");
      localStorage.removeItem("meg_ai_results");
    } catch (e) {
      // ignore
    }
    setShowToast(true);
    // auto-dismiss toast after 6s
    setTimeout(() => setShowToast(false), 6000);
  };

  const clearResultsOnly = (confirmFirst = true) => {
    if (confirmFirst) {
      setPendingClearType("results");
      setShowModal(true);
      return;
    }
    // backup results (store as string) for undo
    try {
      const raw = localStorage.getItem("meg_ai_results");
      setBackupResults(raw);
      localStorage.removeItem("meg_ai_results");
    } catch (e) {
      setBackupResults(null);
    }
    setShowToast(true);
    // auto-dismiss
    setTimeout(() => setShowToast(false), 6000);
  };

  const undoClear = () => {
    if (backupMessages) {
      setMessages(backupMessages);
      try {
        localStorage.setItem("meg_ai_messages", JSON.stringify(backupMessages));
      } catch (e) {}
    }
    setBackupMessages(null);
    setShowToast(false);
  };

  const undoClearResults = () => {
    if (backupResults) {
      try {
        localStorage.setItem("meg_ai_results", backupResults);
      } catch (e) {}
    }
    setBackupResults(null);
    setShowToast(false);
  };

  const hasConversation = () => {
    // treat presence of messages beyond the welcome message as a conversation
    if (!messages || messages.length === 0) return false;
    if (messages.length > 1) return true;
    // sometimes welcome message has id 'm-0'
    return messages.some((m) => m.role === "assistant" && m.id !== "m-0");
  };

  const hasResults = () => {
    // check messages for parsed results/ingredients or localStorage
    try {
      for (const m of messages) {
        if (m.role !== "assistant") continue;
        try {
          const parsed = JSON.parse(m.text);
          if (Array.isArray(parsed)) return true;
          if (
            parsed &&
            (Array.isArray(parsed.results) || Array.isArray(parsed.ingredients))
          )
            return true;
        } catch (e) {
          // not JSON
        }
      }
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("meg_ai_results");
        if (raw) return true;
      }
    } catch (e) {
      // ignore
    }
    return false;
  };

  const rootClass = full
    ? "w-full min-h-[calc(100vh-64px)] p-4 bg-white dark:bg-gray-800"
    : "max-w-3xl mx-auto bg-white rounded-lg shadow p-4";

  return (
    <div className={rootClass}>
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
            <div
              key={m.id}
              className={m.role === "user" ? "text-right" : "text-left"}
            >
              <div
                className={`inline-block px-3 py-2 rounded-lg text-sm ${
                  m.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-800"
                } shadow`}
              >
                {isResults ? "Search results:" : m.text}
              </div>

              {isResults && (
                <>
                  {/* If the parsed message contains ingredients specifically, render ingredient chips first */}
                  {Array.isArray(results) &&
                    results.length > 0 &&
                    results[0]?.qty && (
                      <div className="mb-3 grid grid-cols-1 gap-2">
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => {
                              // add all ingredients to cart
                              for (const ing of results) {
                                try {
                                  // add with parsed qty: if qty contains a number, use it, otherwise default 1
                                  const numMatch = String(ing.qty).match(
                                    /(\d+)/
                                  );
                                  const q = numMatch
                                    ? Math.max(1, Number(numMatch[1]))
                                    : 1;
                                  addToCart(
                                    {
                                      id: ing.id,
                                      name: ing.name,
                                      image: ing.image || "",
                                      description: ing.name,
                                      price: ing.price,
                                      category: ing.category,
                                      stock: ing.stock,
                                    } as any,
                                    q
                                  );
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
                          <div
                            key={ing.id}
                            className="flex items-center gap-3 bg-white p-2 rounded shadow-sm"
                          >
                            <div className="w-10 h-10 relative">
                              <Image
                                src={ing.image || "/file.svg"}
                                alt={ing.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{ing.name}</div>
                              <div className="text-xs text-gray-500">
                                {ing.qty} • ₦{ing.price}
                              </div>
                            </div>
                            <Link
                              href={`/products/${ing.id}`}
                              className="text-green-600 underline"
                            >
                              View
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.map((r) => (
                      <div
                        key={r.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden flex"
                      >
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
                            <div className="font-semibold text-gray-800">
                              {r.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {r.category}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-50 text-green-700 font-bold px-2 py-1 rounded">
                                ₦{r.price}
                              </div>
                              <div className="text-xs text-gray-400">
                                stock: {r.stock}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/products/${r.id}`}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                              >
                                View product
                              </Link>
                              <a
                                href={`/products/${r.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-gray-500 underline"
                              >
                                Open
                              </a>
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

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
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
          className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-60 w-full sm:w-auto"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
        {/* Show clear buttons only when there's conversation/results */}
        {hasConversation() && (
          <button
            onClick={() => clearHistory(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto"
          >
            Clear history
          </button>
        )}
        {hasResults() && (
          <button
            onClick={() => clearResultsOnly(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 w-full sm:w-auto"
          >
            Clear results only
          </button>
        )}
      </div>
      {/* Toast for undo */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2 rounded shadow-lg flex items-center gap-3 transition-opacity duration-300 ease-in-out opacity-100">
          <div>Cleared</div>
          {pendingClearType === "results" ? (
            <>
              <button
                onClick={undoClearResults}
                className="bg-white text-gray-900 px-2 py-1 rounded text-sm"
              >
                Undo
              </button>
            </>
          ) : (
            <>
              <button
                onClick={undoClear}
                className="bg-white text-gray-900 px-2 py-1 rounded text-sm"
              >
                Undo
              </button>
            </>
          )}
          <button
            onClick={() => setShowToast(false)}
            className="text-gray-300 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-40"
            onClick={() => setShowModal(false)}
          />
          <div className="bg-white rounded-lg p-6 z-50 shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirm</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to clear{" "}
              {pendingClearType === "results"
                ? "the saved results"
                : "your chat history"}
              ? This action can be undone briefly with Undo.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPendingClearType(null);
                }}
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  if (pendingClearType === "results") clearResultsOnly(false);
                  else clearHistory(false);
                  setPendingClearType(null);
                }}
                className="px-3 py-1 rounded bg-red-600 text-white"
              >
                Yes, clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
