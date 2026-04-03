"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Upload,
  FolderOpen,
  Settings,
  Menu,
  X,
  Plus,
  FileText,
  ChevronRight,
  Search,
  Bell,
} from "lucide-react";
import ChatSidebar from "@/components/ChatSidebar";

const navItems = [
  { icon: MessageSquare, label: "Chat", href: "/dashboard" },
  { icon: FolderOpen, label: "Documents", href: "/dashboard/documents" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-full bg-card border-r border-white/5 transition-all duration-300 z-40 ${
          sidebarOpen ? "w-80" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-background" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-lg gradient-text"
              >
                PDF RAG
              </motion.span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ChevronRight
              className={`w-5 h-5 text-muted-foreground transition-transform ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Chat Sidebar Content */}
        <div className="flex-1 overflow-hidden">
          <ChatSidebar collapsed={!sidebarOpen} />
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 ring-2 ring-primary/30",
                },
              }}
            />
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium truncate">
                  {user?.fullName || user?.firstName || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-lg border-b border-white/5 z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <FileText className="w-4 h-4 text-background" />
          </div>
          <span className="font-bold gradient-text">PDF RAG</span>
        </Link>

        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-80 bg-card border-r border-white/5 z-50 flex flex-col"
            >
              {/* Header */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <FileText className="w-5 h-5 text-background" />
                  </div>
                  <span className="font-bold text-lg gradient-text">PDF RAG</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <ChatSidebar collapsed={false} />
              </div>

              {/* User */}
              <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 ring-2 ring-primary/30",
                      },
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.fullName || user?.firstName || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "lg:ml-80" : "lg:ml-20"
        } pt-16 lg:pt-0`}
      >
        {children}
      </main>
    </div>
  );
}