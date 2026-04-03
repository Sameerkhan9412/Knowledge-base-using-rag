"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Search,
  Upload,
  FileText,
  MoreVertical,
  Trash2,
  Edit2,
  Loader2,
} from "lucide-react";
import FileUpload from "./FileUpload";

interface Chat {
  _id: string;
  title: string;
  updatedAt: string;
}

interface ChatSidebarProps {
  collapsed?: boolean;
}

export default function ChatSidebar({ collapsed = false }: ChatSidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentChatId = searchParams.get("chatId");

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/chat/history");
      setChats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createNewChat = () => {
    router.push("/dashboard");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center py-4 gap-2">
        <button
          onClick={createNewChat}
          className="w-12 h-12 rounded-xl bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors group"
          title="New Chat"
        >
          <Plus className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => setShowUpload(true)}
          className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
          title="Upload PDF"
        >
          <Upload className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
        </button>
        <div className="w-8 h-px bg-white/10 my-2" />
        {filteredChats.slice(0, 5).map((chat) => (
          <button
            key={chat._id}
            onClick={() => router.push(`/dashboard/chat?chatId=${chat._id}`)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              currentChatId === chat._id
                ? "bg-primary/20 text-primary"
                : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
            }`}
            title={chat.title}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Actions */}
      <div className="p-4 space-y-3">
        {/* New Chat Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={createNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-background font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </motion.button>

        {/* Upload Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowUpload(!showUpload)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <Upload className="w-5 h-5" />
          Upload PDF
        </motion.button>

        {/* Upload Panel */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <FileUpload onSuccess={() => setShowUpload(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-hide">
        <div className="px-2 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Chats
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No chats found" : "No chats yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a new conversation
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredChats.map((chat, index) => (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => router.push(`/dashboard/chat?chatId=${chat._id}`)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all group ${
                    currentChatId === chat._id
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      currentChatId === chat._id
                        ? "bg-primary/20"
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <MessageSquare
                      className={`w-5 h-5 ${
                        currentChatId === chat._id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p
                      className={`text-sm font-medium truncate ${
                        currentChatId === chat._id ? "text-primary" : "text-white"
                      }`}
                    >
                      {chat.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(chat.updatedAt)}
                    </p>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}