// import { Worker } from "bullmq";
// import IORedis from "ioredis";
// import { processPDF } from "../services/pdfProcessor.js";
// import dotenv from "dotenv"
// dotenv.config();
// console.log("redis port",process.env.REDIS_PORT)
// const connection = new IORedis({
//   host: process.env.REDIS_HOST,
//   port: parseInt(process.env.REDIS_PORT, 10), // 🔥 FIX
//   username: process.env.REDIS_USERNAME,
//   password: process.env.REDIS_PASSWORD,
//   tls: {},
//   maxRetriesPerRequest: null, // 🔥 REQUIRED
// });

// new Worker(
//   "pdf-processing",
//   async (job) => {
//     const { filePath, docId } = job.data;
//     await processPDF(filePath, docId);
//   },
//   { connection }
// );

import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { processPDF } from "../services/pdfProcessor.js";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("Worker connected to Redis");
});

new Worker(
  "pdf-processing",
  async (job) => {
    const { filePath, docId } = job.data;
    console.log("Processing:", filePath);
    await processPDF(filePath, docId);
  },
  { connection }
);