"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import FileUpload from "./FileUpload"; // ✅ IMPORT

export default function ChatSidebar() {
  const [chats, setChats] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
       const res = await api.get(
          `http://localhost:5000/api/chat/history`,
        );
        setChats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="p-4 flex flex-col h-full">
      
      {/* 🔥 Upload Section */}
      <div className="mb-4">
        <FileUpload />
      </div>

      <h2 className="font-bold mb-4">Chats</h2>

      <button
        className="mb-4 bg-black text-white px-3 py-1"
        onClick={() => router.push("/dashboard")}
      >
        + New Chat
      </button>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className="p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() =>
              router.push(`/dashboard/chat?chatId=${chat._id}`)
            }
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
}