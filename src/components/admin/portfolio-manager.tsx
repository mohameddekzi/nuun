"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "./data-table";
import { Modal } from "./modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import Image from "next/image";
import { X } from "lucide-react";
import type { Project, ProjectCategory, Json } from "@/lib/types/database";

type ProjectWithCat = Project & { project_categories: { name: string } | null };

interface PortfolioManagerProps {
  initialProjects: ProjectWithCat[];
  categories: ProjectCategory[];
}

export function PortfolioManager({ initialProjects, categories }: PortfolioManagerProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectWithCat | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", description: "", client: "", cover_image: "",
    images: [] as string[],
    category_id: "", year: new Date().getFullYear(),
    is_featured: false, order_index: 0
  });
  const [loading, setLoading] = useState(false);

  const toImages = (v: Json | null | undefined): string[] =>
    Array.isArray(v) ? (v as unknown[]).filter((x): x is string => typeof x === "string") : [];

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", slug: "", description: "", client: "", cover_image: "", images: [], category_id: categories[0]?.id ?? "", year: new Date().getFullYear(), is_featured: false, order_index: projects.length });
    setIsOpen(true);
  };

  const openEdit = (p: ProjectWithCat) => {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug ?? "", description: p.description ?? "", client: p.client ?? "", cover_image: p.cover_image ?? "", images: toImages(p.images), category_id: p.category_id ?? "", year: p.year ?? new Date().getFullYear(), is_featured: p.is_featured, order_index: p.order_index });
    setIsOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    const payload = { ...form, year: Number(form.year), images: form.images as unknown as Json };
    if (editing) {
      const { data } = await supabase.from("projects").update(payload).eq("id", editing.id).select("*, project_categories(name)").single();
      if (data) setProjects((prev) => prev.map((p) => p.id === editing.id ? data as ProjectWithCat : p));
    } else {
      const { data } = await supabase.from("projects").insert({ ...payload, is_active: true }).select("*, project_categories(name)").single();
      if (data) setProjects((prev) => [...prev, data as ProjectWithCat]);
    }
    setLoading(false);
    setIsOpen(false);
  };

  const handleDelete = async (p: ProjectWithCat) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", p.id);
    setProjects((prev) => prev.filter((item) => item.id !== p.id));
  };

  const handleToggle = async (p: ProjectWithCat) => {
    const supabase = createClient();
    const { data } = await supabase.from("projects").update({ is_active: !p.is_active }).eq("id", p.id).select("*, project_categories(name)").single();
    if (data) setProjects((prev) => prev.map((item) => item.id === p.id ? data as ProjectWithCat : item));
  };

  const columns = [
    { key: "title" as keyof ProjectWithCat, label: "Project", render: (v: unknown) => <span className="text-white font-medium">{String(v)}</span> },
    { key: "project_categories" as keyof ProjectWithCat, label: "Category", render: (v: unknown) => <span className="text-white/60 text-xs">{(v as { name: string } | null)?.name ?? "—"}</span> },
    { key: "client" as keyof ProjectWithCat, label: "Client" },
    { key: "year" as keyof ProjectWithCat, label: "Year" },
    { key: "is_featured" as keyof ProjectWithCat, label: "Featured", render: (v: unknown) => v ? <span className="text-[#FFD400] text-xs">★ Yes</span> : <span className="text-white/20 text-xs">No</span> },
    { key: "is_active" as keyof ProjectWithCat, label: "Status", render: (v: unknown) => (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${v ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"}`}>
        {v ? "Active" : "Inactive"}
      </span>
    )},
  ];

  return (
    <>
      <DataTable title="Portfolio" data={projects} columns={columns} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} isActiveKey="is_active" searchKey="title" />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? "Edit Project" : "New Project"}>
        <div className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input label="Client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Category</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50">
              {categories.map((c) => <option key={c.id} value={c.id} className="bg-[#0A0A0A]">{c.name}</option>)}
            </select>
          </div>
          <Input label="Year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />

          {/* Cover image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Cover Image</label>
            <ImageUpload
              value={form.cover_image || null}
              onChange={(url) => setForm({ ...form, cover_image: url ?? "" })}
              folder="portfolio"
              label="Upload cover"
              aspectRatio="aspect-video"
            />
          </div>

          {/* Gallery */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/70">Gallery Images</label>
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {form.images.map((src, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                    <Image src={src} alt={`Image ${i + 1}`} fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                      className="absolute top-1 right-1 w-6 h-6 rounded-md bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <ImageUpload
              value={null}
              onChange={(url) => { if (url) setForm({ ...form, images: [...form.images, url] }); }}
              folder="portfolio"
              label="Add gallery image"
              aspectRatio="aspect-video"
            />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-[#FFD400]" />
            <label htmlFor="featured" className="text-sm text-white/70">Featured project</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={loading} className="flex-1">Save Project</Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
