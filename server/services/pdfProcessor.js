import fs from "fs";
// import pdf from "pdf-parse";
import { chunkText } from "../utils/chunking.js";
import { getEmbedding } from "./embedding.js";
import { qdrant } from "../config/qdrant.js";
import Document from "../models/Document.js";

const pdfParse = await import("pdf-parse");

const pdf = pdfParse.default;

export const processPDF = async (filePath, docId) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);

    const chunks = chunkText(data.text);

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i]);

      await qdrant.upsert(process.env.QDRANT_COLLECTION, {
        points: [
          {
            id: `${docId}_${i}`,
            vector: embedding,
            payload: {
              text: chunks[i],
              docId,
            },
          },
        ],
      });
    }

    await Document.findByIdAndUpdate(docId, {
      status: "completed",
    });
  } catch (error) {
    await Document.findByIdAndUpdate(docId, {
      status: "failed",
    });

    console.error("PDF processing error:", error);
  }
};