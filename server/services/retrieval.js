import { getEmbedding } from "./embedding.js";
import { qdrant } from "../config/qdrant.js";

export const retrieveDocs = async (query, userId) => {
  try {
    const embedding = await getEmbedding(query);

    const results = await qdrant.search(
      process.env.QDRANT_COLLECTION,
      {
        vector: embedding,
        limit: 5,
        filter: {
          must: [
            {
              key: "userId",
              match: { value: userId },
            },
          ],
        },
      }
    );

    if (!results || results.length === 0) {
      return "No relevant documents found.";
    }

    return results
      .map((r) => r.payload?.text || "")
      .filter(Boolean)
      .join("\n");

  } catch (error) {
    console.error("Retrieval error:", error);
    return "Error retrieving documents.";
  }
};