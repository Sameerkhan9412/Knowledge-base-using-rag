import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    userId: {
      type: String, // Clerk userId
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    // Optional: store context used for answer (RAG debug)
    context: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);