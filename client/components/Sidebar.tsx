"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Sidebar() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await api.get(`http://localhost:5000/api/chat/history`);
      setChats(res.data);
    };

    fetchChats();
  }, []);

  return (
    <div className="p-4">
      <h2 className="font-bold mb-4">Chats</h2>

      {chats.map((chat: any) => (
        <div
          key={chat._id}
          className="p-2 hover:bg-gray-200 cursor-pointer"
        >
          {chat.title}
        </div>
      ))}
    </div>
  );
}