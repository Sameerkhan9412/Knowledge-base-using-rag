import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { retrieveDocs } from "./retrieval.js";
import { askGrok } from "./llm.js";

export const handleChat = async (
  userId,
  chatId,
  query
) => {
  let chat;

  // Create chat if not exists
  if (!chatId) {
    chat = await Chat.create({
      userId,
      title: query.slice(0, 30),
    });
  } else {
    chat = await Chat.findById(chatId);
  }

  // Save user message
 await Message.create({
  chatId: chat._id,
  userId, // ADD THIS
  role: "user",
  content: query,
});

  // Retrieve context
  const context = await retrieveDocs(query, userId);

  // LLM call
  const answer = await askGrok(query, context);

  // Save AI response
  await Message.create({
  chatId: chat._id,
  userId, // ADD THIS
  role: "assistant",
  content: answer,
});

  return {
    chatId: chat._id,
    answer,
  };
};