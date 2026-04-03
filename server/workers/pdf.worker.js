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
    const { filePath, docId,userId } = job.data;
    console.log("Processing:", filePath);
    await processPDF(filePath, docId,userId);
  },
  { connection }
);