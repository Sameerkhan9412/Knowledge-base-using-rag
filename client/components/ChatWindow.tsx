"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  FileText,
  MessageSquare,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const { user } = useUser();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load previous messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!chatId) {
        setMessages([]);
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);
        const res = await api.get(`/chat/${chatId}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadMessages();
  }, [chatId]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", {
        query: input,
        chatId,
      }, {
        headers: {
          "x-user-id": user?.id || "demo-user",
        },
      });

      const aiMessage: Message = {
        role: "assistant",
        content: res.data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Update URL with new chatId if this was a new chat
      if (!chatId && res.data.chatId) {
        window.history.pushState({}, "", `/dashboard/chat?chatId=${res.data.chatId}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Empty state
  if (!chatId && messages.length === 0 && !initialLoading) {
    return (
      <div className="flex flex-col h-full bg-background">
        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-8"
            >
              <Sparkles className="w-12 h-12 text-primary" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              How can I help you <span className="gradient-text">today?</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mb-8"
            >
              Ask questions about your uploaded PDFs and get instant AI-powered answers.
            </motion.p>

            {/* Suggestion Cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-2 gap-4 mb-8"
            >
              {[
                { icon: FileText, text: "Summarize my document" },
                { icon: MessageSquare, text: "What are the key points?" },
                { icon: Sparkles, text: "Explain this concept" },
                { icon: Bot, text: "Find specific information" },
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInput(suggestion.text)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-white/5 hover:border-primary/30 hover:bg-card-hover transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <suggestion.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">
                    {suggestion.text}
                  </span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-card/50 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your PDFs..."
                  rows={1}
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-card border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-12 h-12 rounded-xl bg-primary text-background flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          {initialLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user"
                        ? "bg-primary"
                        : "bg-gradient-to-br from-primary/20 to-accent/20"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-5 h-5 text-background" />
                    ) : (
                      <Bot className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex-1 max-w-[80%] ${
                      msg.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block text-left ${
                        msg.role === "user" ? "message-user" : "message-ai"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {/* Actions */}
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => copyToClipboard(msg.content, i)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors"
                          title="Copy"
                        >
                          {copiedIndex === i ? (
                            <Check className="w-4 h-4 text-primary" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Loading indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="message-ai">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/5 bg-card/50 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your PDFs..."
                rows={1}
                className="w-full px-4 py-3 pr-12 rounded-2xl bg-card border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-xl bg-primary text-background flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}