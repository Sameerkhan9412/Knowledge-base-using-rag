"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function ChatWindow() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      const res = await api.get(`/chat/${chatId}`, {
        headers: { "x-user-id": user?.id },
      });
      setMessages(res.data);
    };

    loadMessages();
  }, [chatId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post(
        `/chat`,
        { query: input, chatId },
        {
          headers: { "x-user-id": user?.id },
        }
      );

      const aiMessage = {
        role: "assistant",
        content: res.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            Upload a PDF and start chatting 📄
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl max-w-[70%] text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">
            AI is thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-[#020617]">
        <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-xl">
          <input
            className="flex-1 bg-transparent outline-none px-2 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything from your PDF..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}