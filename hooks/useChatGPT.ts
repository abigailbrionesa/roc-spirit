// src/hooks/useChatGPT.ts
import { useState } from "react";

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export function useChatGPT(systemPrompt: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------------
  // 1. SEND NORMAL CHAT MESSAGE (with full chat history)
  // ----------------------------------------------------------
  const sendToChatGPT = async (history: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...history,
          ],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("OpenAI error:", text);
        throw new Error("Failed to get AI response");
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? null;
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // 2. GENERATE INTRO MESSAGE (NPC speaks first)
  // ----------------------------------------------------------
  const generateIntroMessage = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content: `You are an NPC.\nThis is your personality:\n${systemPrompt}`,
            },
            {
              role: "user",
              content: "Introduce yourself in 1–2 short sentences.",
            },
          ],
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("OpenAI error:", text);
        throw new Error("Failed to get intro response");
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? null;
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendToChatGPT,
    generateIntroMessage,
    loading,
    error,
  };
}
