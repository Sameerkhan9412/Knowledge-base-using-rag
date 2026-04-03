import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { pdfQueue } from "../config/queue.js";

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.resolve("uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + ext;
    cb(null, fileName);
  },
});

//  MULTIPLE FILE SUPPORT
const upload = multer({ storage });

// FIXED ROUTE
router.post("/", upload.array("file"), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    for (const file of files) {
      const filePath = path.resolve(file.path);
      const docId = Date.now().toString();

      console.log("Saved file:", filePath);

      await pdfQueue.add("process-pdf", {
        filePath,
        docId,
        userId:"demo-user"
      });
    }

    res.json({
      success: true,
      message: "Files uploaded & processing started",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;