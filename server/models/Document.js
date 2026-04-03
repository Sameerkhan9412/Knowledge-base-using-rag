import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Clerk ID
      required: true,
    },
    fileName: String,
    filePath: String,
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);