import { QdrantClient } from "@qdrant/js-client-rest";

// export const qdrant = new QdrantClient({
//   url: process.env.QDRANT_URL,
//   apiKey: process.env.QDRANT_API_KEY,
// });


// export const qdrant = new QdrantClient({
//     url: 'https://578c1fb6-38bc-4c58-b2f2-ce4d8673fb04.sa-east-1-0.aws.cloud.qdrant.io',
//     apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOlt7ImNvbGxlY3Rpb24iOiJwZGZfY2h1bmtzIiwiYWNjZXNzIjoicncifV0sInN1YmplY3QiOiJhcGkta2V5OjQ5ODhhMjg5LTkzMjAtNDFjOC05YzE5LTIwMDQ0ZmUwZWNmMSJ9.2Zqad9SjRTzTnXAYX3tWSzB-Bk9wfwQg3OW_aSO-n1M',
// });
export const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY
});

try {
    const result = await qdrant.getCollections();
    console.log('List of collections:', result.collections);
} catch (err) {
    console.error('Could not get collections:', err);
}