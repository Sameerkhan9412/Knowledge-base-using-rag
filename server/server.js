import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";

// Start Worker (Queue Consumer)
import "./workers/pdf.worker.js";
import { initQdrant } from "./config/initQdrant.js";
dotenv.config();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect DB
    await connectDB();
    await initQdrant();

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();