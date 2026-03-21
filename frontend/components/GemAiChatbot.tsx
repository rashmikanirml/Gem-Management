"use client";

import { FormEvent, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";

type Gem = {
  id: string;
  title: string;
  type: string;
  origin: string;
  color: string;
  clarity: string;
  price: string;
  weightCarats: string;
  imageUrl?: string | null;
};

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const TYPE_KEYWORDS = [
  "sapphire",
  "ruby",
  "emerald",
  "tourmaline",
  "diamond",
  "opal",
  "tanzanite",
  "topaz",
  "aquamarine",
];

export default function GemAiChatbot() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gems, setGems] = useState<Gem[]>([]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi, I am Gem AI Guide. Tell me your budget (like $5000) and preferred stone type, and I will suggest the best options.",
    },
  ]);

  const quickPrompts = useMemo(
    () => [
      "My budget is $5000",
      "I want a sapphire under $10000",
      "Show me the best emerald near $15000",
    ],
    [],
  );

  async function ensureGemsLoaded() {
    if (gems.length > 0 || loading) {
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest<Gem[]>("/gems");
      setGems(data);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I could not load marketplace gems right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function parseBudget(text: string): number | null {
    const normalized = text.replace(/,/g, "");
    const match = normalized.match(/(\d+(?:\.\d+)?)/);
    if (!match) {
      return null;
    }

    const value = Number(match[1]);
    if (Number.isNaN(value) || value <= 0) {
      return null;
    }

    return value;
  }

  function parseType(text: string): string | null {
    const lower = text.toLowerCase();
    const found = TYPE_KEYWORDS.find((type) => lower.includes(type));
    return found ?? null;
  }

  function recommend(text: string): string {
    if (gems.length === 0) {
      return "I am still loading gem listings. Please ask again in a second.";
    }

    const budget = parseBudget(text);
    const desiredType = parseType(text);

    if (!budget) {
      return "Please include your budget in numbers, for example: I have 7000 dollars and prefer ruby.";
    }

    const typedPool = desiredType
      ? gems.filter((g) => g.type.toLowerCase().includes(desiredType))
      : gems;

    if (typedPool.length === 0) {
      return `I could not find ${desiredType} listings right now. Try another type or ask without type preference.`;
    }

    const withinBudget = typedPool
      .map((g) => ({ ...g, numericPrice: Number(g.price) }))
      .filter((g) => g.numericPrice <= budget)
      .sort((a, b) => b.numericPrice - a.numericPrice)
      .slice(0, 3);

    if (withinBudget.length === 0) {
      const nearest = typedPool
        .map((g) => ({ ...g, numericPrice: Number(g.price) }))
        .sort((a, b) => a.numericPrice - b.numericPrice)[0];

      return `No exact match under $${budget.toLocaleString()}. Closest option is ${nearest.title} at $${nearest.numericPrice.toLocaleString()} (${nearest.weightCarats} ct, ${nearest.origin}, ${nearest.clarity} clarity).`;
    }

    const lines = withinBudget.map(
      (g, index) =>
        `${index + 1}. ${g.title} - $${g.numericPrice.toLocaleString()} (${g.weightCarats} ct, ${g.color}, ${g.origin})`,
    );

    return [
      `Great choice. Here are my top picks within $${budget.toLocaleString()}${desiredType ? ` for ${desiredType}` : ""}:`,
      ...lines,
      "Tip: prioritize certification and clarity first, then maximize carat within your budget.",
    ].join("\n");
  }

  async function onOpen() {
    setOpen(true);
    await ensureGemsLoaded();
  }

  async function submitPrompt(promptText?: string) {
    const text = (promptText ?? input).trim();
    if (!text) {
      return;
    }

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    await ensureGemsLoaded();

    const result = recommend(text);
    setMessages((prev) => [...prev, { role: "assistant", text: result }]);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitPrompt();
  }

  return (
    <>
      <button type="button" className="gem-ai-fab" onClick={open ? () => setOpen(false) : onOpen}>
        {open ? "Close Guide" : "Gem AI Guide"}
      </button>

      {open ? (
        <aside className="gem-ai-panel" aria-label="Gem AI assistant">
          <div className="gem-ai-header">
            <strong>Gem AI Guide</strong>
            <span>{loading ? "Loading listings..." : "Ready"}</span>
          </div>

          <div className="gem-ai-messages">
            {messages.map((message, index) => (
              <p key={`${message.role}-${index}`} className={`gem-ai-message ${message.role}`}>
                {message.text}
              </p>
            ))}
          </div>

          <div className="gem-ai-quick-prompts">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" className="gem-ai-chip" onClick={() => void submitPrompt(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="gem-ai-form">
            <input
              className="input"
              placeholder="Example: Budget 9000, want sapphire"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="submit" className="btn">
              Ask
            </button>
          </form>
        </aside>
      ) : null}
    </>
  );
}
