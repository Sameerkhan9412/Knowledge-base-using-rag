"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import FileUpload from "./FileUpload";

export default function ChatSidebar() {
  const [chats, setChats] = useState<any[]>([]);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchChats = async () => {
      const res = await api.get(`/chat/history`, {
        headers: { "x-user-id": user?.id },
      });
      setChats(res.data);
    };

    fetchChats();
  }, [user]);

  return (
    <div className="h-full flex flex-col p-4 gap-4">

      {/* Title */}
      <h1 className="text-xl font-semibold">📄 PDF Chat</h1>

      {/* Upload */}
      <div className="bg-gray-900 p-3 rounded-xl">
        <FileUpload />
      </div>

      {/* New Chat */}
      <button
        className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
        onClick={() => router.push("/dashboard")}
      >
        + New Chat
      </button>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer text-sm"
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