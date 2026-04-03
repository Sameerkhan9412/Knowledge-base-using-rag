import express from "express";
import { handleChat } from "../services/chatService.js";
import {
  getUserChats,
  getChatMessages,
} from "../services/chatHistory.js";

const router = express.Router();

/**
 * Send Message (Main Chat API)
 */
router.post("/", async (req, res) => {
  try {
    const { query, chatId } = req.body;
    console.log("query",query,chatId)

    // TEMP userId (replace with Clerk middleware later)
    const userId = req.headers["x-user-id"] || "demo-user";

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const result = await handleChat(userId, chatId, query);

    res.json({
      success: true,
      chatId: result.chatId,
      answer: result.answer,
    });
  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

/**
 * Get All Chats (Sidebar)
 */
router.get("/history", async (req, res) => {
  try {
    console.log("user id")
    const userId = req.headers["x-user-id"] || "demo-user";
    console.log("user id",userId)

    const chats = await getUserChats(userId);

    res.json(chats);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ message: "Error fetching chats" });
  }
});

/**
 *  Get Messages of a Chat
 */
router.get("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await getChatMessages(chatId);

    res.json(messages);
  } catch (error) {
    console.error("Messages error:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});



export default router;