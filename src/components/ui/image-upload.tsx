"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, FolderOpen } from "lucide-react";
import { MediaPicker } from "./media-picker";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  className?: string;
  label?: string;
  hint?: string;
  aspectRatio?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  className = "",
  label = "Upload Image",
  hint = "PNG, JPG, SVG, WebP",
  aspectRatio = "aspect-video",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("File must be under 5MB"); return; }
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("media").getPublicUrl(path);

      /* also insert a row into the media table so it appears in the library */
      const { error: dbError } = await supabase.from("media").insert({
        name: file.name,
        file_path: path,
        file_url: data.publicUrl,
        file_type: file.type,
        file_size: file.size,
        folder,
      });
      if (dbError) console.warn("media table insert failed:", dbError.message);

      onChange(data.publicUrl);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        <input
          ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />

        {value ? (
          <div className="relative group rounded-xl overflow-hidden border border-white/10">
            <div className={`relative ${aspectRatio} w-full bg-[#0A0A0A]/30`}>
              <Image src={value} alt="Uploaded" fill className="object-contain" unoptimized />
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFD400] text-black text-xs font-semibold rounded-lg"
              >
                <Upload size={12} /> Upload
              </button>
              <button
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white text-xs font-semibold rounded-lg hover:bg-white/20"
              >
                <FolderOpen size={12} /> Library
              </button>
              <button
                onClick={() => onChange(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg"
              >
                <X size={12} /> Remove
              </button>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 size={24} className="text-[#FFD400] animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className={`relative ${aspectRatio} border-2 border-dashed border-white/15 rounded-xl overflow-hidden hover:border-[#FFD400]/40 transition-colors`}>
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={22} className="text-[#FFD400] animate-spin" />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                {/* Upload drop zone */}
                <button
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0] ?? null); }}
                  className="absolute inset-0 cursor-pointer"
                  aria-label="Upload file"
                />
                <Upload size={20} className="text-white/30 pointer-events-none" />
                <span className="text-white/50 text-sm pointer-events-none">{label}</span>
                <span className="text-white/25 text-xs pointer-events-none">{hint} · max 5MB</span>
                {/* Browse button sits on top */}
                <button
                  onClick={(e) => { e.stopPropagation(); setPickerOpen(true); }}
                  className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-white/60 text-xs font-medium hover:text-white hover:bg-white/10 transition-all"
                >
                  <FolderOpen size={12} /> Browse library
                </button>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      {pickerOpen && (
        <MediaPicker
          onSelect={(url) => { onChange(url); setPickerOpen(false); }}
          onClose={() => setPickerOpen(false)}
          accept="image"
        />
      )}
    </>
  );
}
