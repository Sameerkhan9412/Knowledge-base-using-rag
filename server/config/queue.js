import dotenv from "dotenv";
dotenv.config();

import { Queue } from "bullmq";
import IORedis from "ioredis";

// Local Redis connection
const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
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