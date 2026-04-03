"use client";

import { useState, useRef, useCallback } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Cloud,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface FileUploadProps {
  onSuccess?: () => void;
}

interface UploadFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
}

export default function FileUpload({ onSuccess }: FileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: UploadFile[] = Array.from(fileList)
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: "pending" as const,
        progress: 0,
      }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0 || uploading) return;

    setUploading(true);

    const formData = new FormData();
    files.forEach((f) => formData.append("file", f.file));

    // Update all files to uploading status
    setFiles((prev) =>
      prev.map((f) => ({ ...f, status: "uploading" as const }))
    );

    try {
      await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-user-id":user?.id,
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded / progressEvent.total) * 100)
            : 0;

          setFiles((prev) =>
            prev.map((f) => ({
              ...f,
              progress: f.status === "uploading" ? progress : f.progress,
            }))
          );
        },
      });
      

      // Mark all as success
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: "success" as const, progress: 100 }))
      );

      // Clear after delay
      setTimeout(() => {
        setFiles([]);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      console.error(err);
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: "error" as const }))
      );
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-white/10 hover:border-primary/50 hover:bg-white/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <motion.div
          animate={{ scale: isDragging ? 1.05 : 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
              isDragging ? "bg-primary/20" : "bg-white/5"
            }`}
          >
            <Cloud
              className={`w-7 h-7 transition-colors ${
                isDragging ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {isDragging ? "Drop files here" : "Drag & drop PDF files"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse
            </p>
          </div>
        </motion.div>
      </div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file.size)}
                    </p>
                    {file.status === "uploading" && (
                      <p className="text-xs text-primary">{file.progress}%</p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {file.status === "uploading" && (
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  )}
                </div>

                {/* Status / Remove */}
                <div className="flex-shrink-0">
                  {file.status === "pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {file.status === "uploading" && (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  )}
                  {file.status === "success" && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                  {file.status === "error" && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </motion.div>
            ))}

            {/* Upload Button */}
            {files.some((f) => f.status === "pending") && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={uploadFiles}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-background font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload {files.filter((f) => f.status === "pending").length} file
                    {files.filter((f) => f.status === "pending").length > 1 ? "s" : ""}
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}