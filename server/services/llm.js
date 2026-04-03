import { grokClient } from "../config/grok.js";

export const askGrok = async (context, query) => {
  try {
    const res = await grokClient.post("/chat/completions", {
     model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI. Answer ONLY using given context.",
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${query}`,
        },
      ],
    });

    return res.data.choices[0].message.content;

  } catch (error) {
    console.error("LLM error:", error.response?.data || error.message);
    return "Error generating answer.";
  }
};