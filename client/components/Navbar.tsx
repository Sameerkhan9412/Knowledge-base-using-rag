"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { motion } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#", label: "Features" },
  { href: "#", label: "Pricing" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent
                         flex items-center justify-center"
            >
              <FileText className="w-5 h-5 text-background" />
            </motion.div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              Paper Brain Ai
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link,index) => (
              <Link
                key={index}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons — merged from the standalone <header> */}
          <div className="flex items-center gap-3">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="btn-ghost hidden sm:block">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    className="btn-primary text-white rounded-full font-medium
                               text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5
                               cursor-pointer hover:scale-75 transition-colors"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="btn-ghost hidden sm:block">
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-primary/30",
                    },
                  }}
                />
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/5"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-white/5 my-1" />

              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium
                                 text-muted-foreground hover:text-white hover:bg-white/5
                                 transition-colors"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      className="w-full btn-primary text-white rounded-full font-medium
                                 text-sm h-11 px-4 cursor-pointer hover:scale-90
                                 transition-colors"
                    >
                      Sign Up
                    </button>
                  </SignUpButton>
                </>
              ) : (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium
                             text-muted-foreground hover:text-white hover:bg-white/5
                             transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}