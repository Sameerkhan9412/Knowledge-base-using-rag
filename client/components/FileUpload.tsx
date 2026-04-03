"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useUser } from "@clerk/nextjs";

export default function FileUpload() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const uploadFiles = async () => {
    if (!files) return;

    setLoading(true);

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    try {
      // ✅ FIXED (NO hardcoded URL)
      await api.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData, {
        headers: {
          "x-user-id":user?.id,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Uploaded successfully 🚀");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
      />

      <button
        onClick={uploadFiles}
        className="bg-black text-white px-4 py-2"
      >
        {loading ? "Uploading..." : "Upload PDFs"}
      </button>
    </div>
  );
}