import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv"
dotenv.config();

// Routes
import uploadRoutes from "./routes/upload.js";
import chatRoutes from "./routes/chat.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger (dev)
app.use(morgan("dev"));

// Health Check
app.get("/", (req, res) => {
  res.send("PDF RAG API is running...");
});

// API Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;