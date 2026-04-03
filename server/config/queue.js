// import dotenv from "dotenv";
// dotenv.config();

// import { Queue } from "bullmq";
// import IORedis from "ioredis";

// const connection = new IORedis({
//   host: process.env.REDIS_HOST,
//   port: Number(process.env.REDIS_PORT),
//   username: "default",
//   password: process.env.REDIS_PASSWORD,
//   tls: {},
//   connectTimeout: 30000,
//   maxRetriesPerRequest: null,
// });

// export const pdfQueue = new Queue("pdf-processing", {
//   connection,
// });

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