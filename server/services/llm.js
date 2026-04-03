import { grokClient } from "../config/grok.js";

export const askGrok = async (query, context) => {
  try {
    // ✅ Handle empty context early
    if (!context || context.trim().length === 0) {
      return "I don't know based on the provided documents.";
    }

    // ✅ Better structured prompt
    const systemPrompt = `
You are a highly accurate AI assistant for question answering using provided documents.

STRICT RULES:
1. Answer ONLY from the given context.
2. If answer is not clearly present, say:
   "I don't know based on the provided documents."
3. Do NOT hallucinate or assume anything.
4. Keep answers concise, clear, and well-structured.
5. If possible, use bullet points or short paragraphs.
`;

    const userPrompt = `
CONTEXT:
"""
${context}
"""

QUESTION:
${query}

INSTRUCTIONS:
- Extract the exact answer from context
- Do not add external knowledge
- If partial info exists, answer only that part
`;

    const res = await grokClient.post("/chat/completions", {
      model: "llama-3.1-8b-instant",
      temperature: 0.1, // 🔥 more deterministic
      max_tokens: 500,  // 🔥 control output size
      top_p: 0.9,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const answer = res.data?.choices?.[0]?.message?.content?.trim();

    // ✅ Safe fallback
    if (!answer) {
      return "I don't know based on the provided documents.";
    }

    return answer;

  } catch (error) {
    console.error("LLM error:", error.response?.data || error.message);

    return "Error generating answer. Please try again.";
  }
};