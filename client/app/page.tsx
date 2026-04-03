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
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
      
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-4 text-center">
        📄 PDF RAG Chat App
      </h1>

      {/* Subtext */}
      <p className="text-gray-600 mb-6 text-center max-w-xl">
        Upload your PDFs and chat with them using AI.  
        Get instant answers powered by embeddings and vector search.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        {user ? (
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-black text-white px-6 py-2 rounded-lg"
          >
            Go to Dashboard 🚀
          </button>
        ) : (
          <>
            <button
              onClick={() => router.push("/sign-in")}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Sign In
            </button>

            <button
              onClick={() => router.push("/sign-up")}
              className="border px-6 py-2 rounded-lg"
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <p className="absolute bottom-5 text-sm text-gray-400">
        Built with ❤️ using RAG + Grok + Qdrant
      </p>
    </div>
  );
}