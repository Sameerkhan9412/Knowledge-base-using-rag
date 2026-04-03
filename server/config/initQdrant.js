import { qdrant } from "./qdrant.js";

export const initQdrant = async () => {
  try {
    const collections = await qdrant.getCollections();

    const exists = collections.collections.some(
      (c) => c.name === process.env.QDRANT_COLLECTION
    );

    if (!exists) {
      await qdrant.createCollection(process.env.QDRANT_COLLECTION, {
        vectors: {
          size: 384,
          distance: "Cosine",
        },
      });
    }

//     const info = await qdrant.getCollection(process.env.QDRANT_COLLECTION);
// console.log("Collection info:", info);


    // ADD THIS (VERY IMPORTANT)
    await qdrant.createPayloadIndex(process.env.QDRANT_COLLECTION, {
      field_name: "userId",
      field_schema: "keyword",
    });

    console.log("Qdrant ready");
  } catch (err) {
    console.error(err);
  }
};