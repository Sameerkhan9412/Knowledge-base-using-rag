"use client";

import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r">
        <ChatSidebar />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  );
}