import dotenv from "dotenv";
dotenv.config();

import { Queue } from "bullmq";
import IORedis from "ioredis";

// Local Redis connection
const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("Connected to Local Redis");
});

connection.on("error", (err) => {
  console.error("Redis Error:", err);
});

export const pdfQueue = new Queue("pdf-processing", {
  connection,
});