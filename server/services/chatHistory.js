import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const getUserChats = async (userId) => {
  return Chat.find({ userId }).sort({ updatedAt: -1 });
};

export const getChatMessages = async (chatId) => {
  return Message.find({ chatId }).sort({ createdAt: 1 });
};