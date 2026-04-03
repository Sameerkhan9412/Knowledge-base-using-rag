// "use client";

// import { useState } from "react";
// import { api } from "@/lib/api";

// export default function FileUpload() {
//   const [files, setFiles] = useState<FileList | null>(null);
//   const [loading, setLoading] = useState(false);

//   const uploadFiles = async () => {
//     if (!files) return;

//     setLoading(true);

//     const formData = new FormData();

//     for (let i = 0; i < files.length; i++) {
//       formData.append("file", files[i]);
//     }

//     try {
//       await api.post(`http://localhost:5000/api/upload`, formData);
//       const res = await api.get(
//           `http://localhost:5000/api/chat/history`,
//         );
//       alert("Uploaded successfully 🚀");
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex flex-col gap-3">
//       <input
//         type="file"
//         multiple
//         onChange={(e) => setFiles(e.target.files)}
//       />

//       <button
//         onClick={uploadFiles}
//         className="bg-black text-white px-4 py-2"
//       >
//         {loading ? "Uploading..." : "Upload PDFs"}
//       </button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function FileUpload() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadFiles = async () => {
    if (!files) return;

    setLoading(true);

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    try {
      // ✅ FIXED (NO hardcoded URL)
      await api.post("/upload", formData, {
        headers: {
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