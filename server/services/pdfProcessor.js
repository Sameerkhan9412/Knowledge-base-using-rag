import fs from "fs";
import { chunkText } from "../utils/chunking.js";
import { getEmbedding } from "./embedding.js";
import { qdrant } from "../config/qdrant.js";
import Document from "../models/Document.js";
import { extractTextFromPDF } from "../config/extractTextFromPDF.js";
import { v4 as uuidv4 } from "uuid";

const pdfParse = await import("pdf-parse");
const pdf = pdfParse.default;

export const processPDF = async (filePath, docId, userId) => {
  try {
    console.log("Processing:", filePath);
    console.log("Starting PDF parse...");
const text = await extractTextFromPDF(filePath);
console.log("PDF parsed");

console.log("Text length:", text.length);


    const chunks = chunkText(text).slice(0, 20);
console.log("Chunks:", chunks.length);

    for (let i = 0; i < chunks.length; i++) {
  const embedding = await getEmbedding(chunks[i]);

  console.log("Storing chunk:", i);

  try {
    const store = await qdrant.upsert(process.env.QDRANT_COLLECTION, {
      points: [
        {
          id: uuidv4(),
          vector: embedding,
          payload: {
            text: chunks[i],
            docId,
            userId,
          },
        },
      ],
    });

    console.log("Stored:", store);
  } catch (err) {
    console.error("Qdrant error:", err);
  }
}

    await Document.findByIdAndUpdate(docId, {
      status: "completed",
    });

    console.log("PDF processing completed");

  } catch (error) {
    await Document.findByIdAndUpdate(docId, {
      status: "failed",
    });

    console.error("PDF processing error:", error);
  }
};