"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Upload, Trash2, Copy, Search, Grid, List, Image as ImgIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { Media } from "@/lib/types/database";

interface MediaLibraryProps {
  userId: string;
}

export function MediaLibrary({ userId }: MediaLibraryProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/media")
      .then((r) => r.json())
      .then((j) => setMedia(j.data ?? []))
      .catch(() => setMedia([]))
      .finally(() => setLoading(false));
  }, []);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = search
    ? media.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
    : media;

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `media/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) continue;

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      const { data } = await supabase.from("media").insert({
        name: file.name,
        file_path: path,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: userId,
      }).select().single();

      const newRow = data ?? {
        id: path, name: file.name, file_path: path, file_url: urlData.publicUrl,
        file_type: file.type, file_size: file.size, folder: "media",
        alt_text: null, caption: null, uploaded_by: userId, created_at: new Date().toISOString(),
      };
      setMedia((prev) => [newRow as Media, ...prev]);
    }
    setUploading(false);
  };

  const handleDelete = async (item: Media) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    const supabase = createClient();
    await supabase.storage.from("media").remove([item.file_path]);
    await supabase.from("media").delete().eq("id", item.id);
    setMedia((prev) => prev.filter((m) => m.id !== item.id));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Media Library</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 h-9 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FFD400]/50 w-48"
            />
          </div>
          <div className="flex border border-white/10 rounded-lg overflow-hidden">
            <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-white/10 text-white" : "text-white/40"}`}><Grid size={14} /></button>
            <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-white/10 text-white" : "text-white/40"}`}><List size={14} /></button>
          </div>
          <input ref={inputRef} type="file" multiple accept="image/*,video/*,application/pdf" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
          <Button size="sm" onClick={() => inputRef.current?.click()} loading={uploading} className="gap-2 text-xs">
            <Upload size={14} /> Upload
          </Button>
        </div>
      </div>

      {/* Upload drop zone */}
      <div
        className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center mb-6 hover:border-[#FFD400]/30 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files); }}
      >
        <Upload size={24} className="text-white/30 mx-auto mb-2" />
        <p className="text-white/40 text-sm">Drop files here or click to upload</p>
        <p className="text-white/20 text-xs mt-1">Images, videos, PDFs supported</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="text-[#FFD400] animate-spin" />
        </div>
      )}

      {/* Grid view */}
      {!loading && view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="group relative aspect-square bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden hover:border-white/[0.15] transition-all"
            >
              {item.file_type?.startsWith("image/") ? (
                <img src={item.file_url} alt={item.alt_text || item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImgIcon size={24} className="text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-[#0A0A0A]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => copyUrl(item.file_url)} className="p-2 bg-white/10 rounded-lg text-white hover:bg-[#FFD400]/20 hover:text-[#FFD400] transition-colors">
                  <Copy size={12} />
                </button>
                <button onClick={() => handleDelete(item)} className="p-2 bg-white/10 rounded-lg text-white hover:bg-red-500/20 hover:text-red-400 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-[#0A0A0A] to-transparent">
                <p className="text-white/60 text-xs truncate">{item.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* List view */}
      {!loading && view === "list" && (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">File</th>
                <th className="text-left px-5 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Size</th>
                <th className="text-left px-5 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-white/40 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-white text-sm font-medium">{item.name}</td>
                  <td className="px-5 py-3 text-white/40 text-xs">{item.file_type?.split("/")[1]?.toUpperCase() ?? "—"}</td>
                  <td className="px-5 py-3 text-white/40 text-xs">{formatSize(item.file_size)}</td>
                  <td className="px-5 py-3 text-white/40 text-xs">{format(new Date(item.created_at), "MMM d, yyyy")}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => copyUrl(item.file_url)} className="p-1.5 text-white/40 hover:text-[#FFD400] rounded-lg hover:bg-[#FFD400]/10 transition-colors"><Copy size={13} /></button>
                      <button onClick={() => handleDelete(item)} className="p-1.5 text-white/40 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center py-8 text-white/30 text-sm">No media files found</p>}
        </div>
      )}
    </div>
  );
}
