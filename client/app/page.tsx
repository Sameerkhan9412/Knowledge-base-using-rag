"use client";

import { useAuthUser } from "@/lib/clerk";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, isLoaded } = useAuthUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black to-gray-900 text-white">

  <h1 className="text-5xl font-bold mb-4">
    Chat with your PDFs 📄
  </h1>

  <p className="text-gray-400 mb-6 text-center max-w-lg">
    AI-powered PDF assistant using RAG, Grok & Qdrant
  </p>

  <div className="flex gap-4">
    <button
      onClick={() => router.push("/dashboard")}
      className="bg-blue-600 px-6 py-3 rounded-xl"
    >
      Get Started 🚀
    </button>
  </div>
</div>
  );
}