"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Search,
  Filter,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Calendar,
  HardDrive,
} from "lucide-react";
import FileUpload from "@/components/FileUpload";

// Mock data - replace with actual API call
const mockDocuments = [
  { id: "1", name: "Annual Report 2024.pdf", size: "2.4 MB", date: "2024-01-15", status: "completed" },
  { id: "2", name: "Product Guidelines.pdf", size: "1.2 MB", date: "2024-01-14", status: "completed" },
  { id: "3", name: "Marketing Strategy.pdf", size: "3.8 MB", date: "2024-01-13", status: "processing" },
  { id: "4", name: "Financial Summary Q4.pdf", size: "856 KB", date: "2024-01-12", status: "completed" },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const filteredDocs = mockDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground mt-1">
              Manage your uploaded PDF files
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUpload(!showUpload)}
            className="btn-primary"
          >
            Upload New PDF
          </motion.button>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
            <FileUpload onSuccess={() => setShowUpload(false)} />
          </motion.div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button className="btn-ghost flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        {/* Documents Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card card-hover group"
            >
              {/* Icon & Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  {doc.status === "processing" && (
                    <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                      Processing
                    </span>
                  )}
                  <button className="p-1.5 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* File Info */}
              <h3 className="font-medium truncate mb-2">{doc.name}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5" />
                  {doc.size}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(doc.date).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 text-sm text-muted-foreground hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-white/5 text-sm text-muted-foreground hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-red-500/10 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No documents found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try a different search term" : "Upload your first PDF to get started"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}