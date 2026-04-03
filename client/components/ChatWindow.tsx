"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

export default function ChatWindow() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  // Load previous messages
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      const res = await api.get(`/chat/${chatId}`);
      setMessages(res.data);
      console.log("res chat", res.data);
    };
    loadMessages();
  }, [chatId]);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    console.log("conent", input, chatId);
    try {
      const res = await api.post(`http://localhost:5000/api/chat`, {
        query: input,
        chatId,
      });

      const aiMessage = {
        role: "assistant",
        content: res.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setInput("");
    } catch (error) {
      console.log("error",error)
    }
  };

  return (
    <div className="flex flex-col h-full bg-green-600">
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block p-2 rounded">
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something from your PDFs..."
        />
        <button className="bg-black text-white px-4" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
