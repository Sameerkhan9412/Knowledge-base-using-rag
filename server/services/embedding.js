// import axios from "axios";
// export const getEmbedding = async (text) => {
//   try {
//     const res = await axios.post(
//       "https://api.openai.com/v1/embeddings",
//       {
//         input: text,
//         model: "text-embedding-3-small",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.GROK_API_KEY}`,
//         },
//       }
//     );

//     return res.data.data[0].embedding;
//   } catch (error) {
//     console.error("Embedding error:", error);
//     throw error;
//   }
// };

import { pipeline } from "@xenova/transformers";

let extractor;

export const getEmbedding = async (text) => {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  const output = await extractor(text, { pooling: "mean", normalize: true });

  return Array.from(output.data);
};