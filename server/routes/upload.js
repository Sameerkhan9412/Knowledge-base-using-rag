// import express from "express";
// import multer from "multer";
// import path from "path";
// import { pdfQueue } from "../config/queue.js";

// const router = express.Router();

// // ✅ Storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname); // ✅ get .pdf
//     const fileName = Date.now() + ext; // unique name
//     cb(null, fileName);
//   },
// });

// const upload = multer({ storage });

// // ✅ Upload route
// router.post("/", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const docId = Date.now().toString();

//     await pdfQueue.add("process-pdf", {
//       filePath: file.path, // now has .pdf ✅
//       docId,
//     });

//     res.json({
//       message: "Uploaded & processing started",
//       file: file.filename,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Upload failed" });
//   }
// });

// export default router;

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
      const filePath = path.resolve(file.path); // ✅ CRITICAL FIX
      const docId = Date.now().toString();

      console.log("Saved file:", filePath);

      await pdfQueue.add("process-pdf", {
        filePath,
        docId,
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