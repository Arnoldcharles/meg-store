"use client";

import { useState, useRef, useEffect } from "react";

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

  useEffect(() => {
    // Welcome message
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
      const data = await res.json();
      const reply = data?.reply || "Sorry, I couldn't generate a response.";
      const assistantMsg: Message = { id: `a-${Date.now()}`, role: "assistant", text: reply };
      setMessages((m) => [...m, assistantMsg]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { id: `a-err-${Date.now()}`, role: "assistant", text: "There was an error contacting the AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") send();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-4">
      <h2 className="text-2xl font-semibold mb-4">AI Assistant</h2>
      <div
        ref={listRef}
        className="h-64 overflow-y-auto border rounded-md p-3 space-y-3 bg-gray-50"
      >
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block px-3 py-2 rounded-lg text-sm ${
                m.role === "user" ? "bg-green-600 text-white" : "bg-white text-gray-800"
              } shadow`}
            >
              {m.text}
            </div>
          </div>
        ))}
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
      </div>
    </div>
  );
}
