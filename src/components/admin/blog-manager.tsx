"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "./data-table";
import { Modal } from "./modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { BlogPost, BlogCategory } from "@/lib/types/database";

type PostWithCat = BlogPost & { blog_categories: { name: string } | null };

interface BlogManagerProps {
  initialPosts: PostWithCat[];
  categories: BlogCategory[];
}

export function BlogManager({ initialPosts, categories }: BlogManagerProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<PostWithCat | null>(null);
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "",
    category_id: "", read_time: 5, is_published: false, is_featured: false
  });
  const [loading, setLoading] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", category_id: categories[0]?.id ?? "", read_time: 5, is_published: false, is_featured: false });
    setIsOpen(true);
  };

  const openEdit = (p: PostWithCat) => {
    setEditing(p);
    setForm({ title: p.title, slug: p.slug ?? "", excerpt: p.excerpt ?? "", content: p.content ?? "", category_id: p.category_id ?? "", read_time: p.read_time, is_published: p.is_published, is_featured: p.is_featured });
    setIsOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      ...form,
      published_at: form.is_published ? new Date().toISOString() : null,
    };
    if (editing) {
      const { data } = await supabase.from("blog_posts").update(payload).eq("id", editing.id).select("*, blog_categories(name)").single();
      if (data) setPosts((prev) => prev.map((p) => p.id === editing.id ? data as PostWithCat : p));
    } else {
      const { data } = await supabase.from("blog_posts").insert(payload).select("*, blog_categories(name)").single();
      if (data) setPosts((prev) => [data as PostWithCat, ...prev]);
    }
    setLoading(false);
    setIsOpen(false);
  };

  const handleDelete = async (p: PostWithCat) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", p.id);
    setPosts((prev) => prev.filter((item) => item.id !== p.id));
  };

  const columns = [
    { key: "title" as keyof PostWithCat, label: "Title", render: (v: unknown) => <span className="text-white font-medium line-clamp-1 max-w-xs">{String(v)}</span> },
    { key: "blog_categories" as keyof PostWithCat, label: "Category", render: (v: unknown) => <span className="text-white/50 text-xs">{(v as {name:string}|null)?.name ?? "—"}</span> },
    { key: "read_time" as keyof PostWithCat, label: "Read Time", render: (v: unknown) => <span className="text-white/50 text-xs">{String(v)} min</span> },
    { key: "published_at" as keyof PostWithCat, label: "Published", render: (v: unknown) => v ? <span className="text-white/50 text-xs">{format(new Date(String(v)), "MMM d, yyyy")}</span> : <span className="text-white/20 text-xs">Draft</span> },
    { key: "is_published" as keyof PostWithCat, label: "Status", render: (v: unknown) => (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${v ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
        {v ? "Published" : "Draft"}
      </span>
    )},
  ];

  return (
    <>
      <DataTable title="Blog Posts" data={posts} columns={columns} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} searchKey="title" />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? "Edit Post" : "New Post"} size="lg">
        <div className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-blog-post" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Category</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
              {categories.map((c) => <option key={c.id} value={c.id} className="bg-[#0A0A0A]">{c.name}</option>)}
            </select>
          </div>
          <Textarea label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
          <Textarea label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} />
          <Input label="Read Time (minutes)" type="number" value={form.read_time} onChange={(e) => setForm({ ...form, read_time: Number(e.target.value) })} />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="accent-[#FFD400]" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-[#FFD400]" />
              Featured
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={loading} className="flex-1">Save Post</Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
