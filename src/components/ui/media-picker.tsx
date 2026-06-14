"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Search, X, Upload, Loader2, Check, FolderOpen, AlertCircle } from "lucide-react";
import type { Media } from "@/lib/types/database";

interface MediaPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  accept?: string;
}

export function MediaPicker({ onSelect, onClose, accept = "image" }: MediaPickerProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      setLoadError(null);
      try {
        // Use the server API route — avoids client-side auth/cookie issues
        const res = await fetch("/api/media");
        const json = await res.json();
        if (!res.ok || json.error) {
          setLoadError(json.error ?? "Failed to load media");
          setMedia([]);
        } else {
          setMedia(json.data ?? []);
        }
      } catch (e) {
        setLoadError(String(e));
        setMedia([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = media.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
    const matchType = !accept || (m.file_type ?? "").startsWith(accept);
    return matchSearch && matchType;
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const supabase = createClient();
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `media/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      let { error } = await supabase.storage.from("media").upload(path, file);
      if (error?.message?.includes("Bucket not found")) {
        await fetch("/api/storage/setup", { method: "POST" });
        const retry = await supabase.storage.from("media").upload(path, file);
        error = retry.error;
      }
      if (error) { console.warn("upload failed:", error.message); continue; }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      const { data: row, error: dbErr } = await supabase.from("media").insert({
        name: file.name,
        file_path: path,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        folder: "media",
      }).select().single();
      if (dbErr) console.warn("media insert failed:", dbErr.message);
      // Always add to UI using the public URL even if DB insert failed
      const newRow = row ?? { id: path, name: file.name, file_path: path, file_url: urlData.publicUrl, file_type: file.type, file_size: file.size, folder: "media", alt_text: null, caption: null, uploaded_by: null, created_at: new Date().toISOString() };
      setMedia((prev) => [newRow as Media, ...prev]);
      setSelected(urlData.publicUrl);
    }
    setUploading(false);
  };

  const confirm = () => {
    if (selected) { onSelect(selected); onClose(); }
  };

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-white/[0.1] overflow-hidden"
        style={{ background: "var(--bg-alt)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <FolderOpen size={16} className="text-[#FFD400]" />
            <h2 className="text-white font-bold text-sm">Media Library</h2>
            <span className="text-white/30 text-xs">{media.length} files</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.07] transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-[#FFD400]/40"
            />
          </div>
          <input
            ref={inputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FFD400]/10 border border-[#FFD400]/20 text-[#FFD400] text-xs font-medium hover:bg-[#FFD400]/15 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
            Upload new
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="text-[#FFD400] animate-spin" />
            </div>
          ) : loadError ? (
            <div className="text-center py-16">
              <AlertCircle size={28} className="text-red-400/60 mx-auto mb-3" />
              <p className="text-red-400/70 text-sm">Could not load media</p>
              <p className="text-white/25 text-xs mt-1 font-mono">{loadError}</p>
              <button onClick={() => { setLoading(true); setLoadError(null); fetch("/api/media").then(r=>r.json()).then(j=>{ setMedia(j.data??[]); setLoading(false); }).catch(e=>{ setLoadError(String(e)); setLoading(false); }); }} className="mt-4 text-[#FFD400] text-xs underline">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <FolderOpen size={32} className="text-white/15 mx-auto mb-3" />
              <p className="text-white/30 text-sm">
                {search ? "No files match your search" : "No files in the media library yet"}
              </p>
              {!search && (
                <button
                  onClick={() => inputRef.current?.click()}
                  className="mt-4 text-[#FFD400] text-xs underline"
                >
                  Upload your first file
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
              {filtered.map((m) => {
                const isSelected = selected === m.file_url;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelected(isSelected ? null : m.file_url)}
                    onDoubleClick={() => { onSelect(m.file_url); onClose(); }}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                      isSelected
                        ? "border-[#FFD400] ring-2 ring-[#FFD400]/30"
                        : "border-transparent hover:border-white/20"
                    }`}
                    style={{ background: "var(--surface)" }}
                    title={m.name}
                  >
                    {(m.file_type ?? "").startsWith("image") ? (
                      <Image
                        src={m.file_url}
                        alt={m.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/30 text-xs font-mono">{m.name.split(".").pop()?.toUpperCase()}</span>
                      </div>
                    )}

                    {/* Hover name */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[9px] truncate">{m.name}</p>
                    </div>

                    {/* Selected checkmark */}
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FFD400] flex items-center justify-center">
                        <Check size={11} className="text-black" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-white/[0.07] flex-shrink-0">
          <p className="text-white/30 text-xs">
            {selected ? "1 file selected · double-click to insert directly" : "Click a file to select it"}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/[0.08] text-white/50 text-xs font-medium hover:text-white hover:bg-white/[0.05] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={confirm}
              disabled={!selected}
              className="px-4 py-2 rounded-lg bg-[#FFD400] text-[#0A0A0A] text-xs font-bold disabled:opacity-40 hover:bg-[#FFD400]/90 transition-all"
            >
              Insert Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
