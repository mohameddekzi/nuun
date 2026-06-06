"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "./data-table";
import { Modal } from "./modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/lib/types/database";

export function TestimonialsManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [items, setItems] = useState(initialTestimonials);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ name: "", position: "", company: "", content: "", rating: 5, is_featured: false });
  const [loading, setLoading] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", position: "", company: "", content: "", rating: 5, is_featured: false });
    setIsOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, position: t.position ?? "", company: t.company ?? "", content: t.content, rating: t.rating, is_featured: t.is_featured });
    setIsOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    if (editing) {
      const { data } = await supabase.from("testimonials").update(form).eq("id", editing.id).select().single();
      if (data) setItems((prev) => prev.map((t) => t.id === editing.id ? data : t));
    } else {
      const { data } = await supabase.from("testimonials").insert({ ...form, is_active: true }).select().single();
      if (data) setItems((prev) => [...prev, data]);
    }
    setLoading(false);
    setIsOpen(false);
  };

  const handleDelete = async (t: Testimonial) => {
    if (!confirm(`Delete testimonial from "${t.name}"?`)) return;
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", t.id);
    setItems((prev) => prev.filter((item) => item.id !== t.id));
  };

  const handleToggle = async (t: Testimonial) => {
    const supabase = createClient();
    const { data } = await supabase.from("testimonials").update({ is_active: !t.is_active }).eq("id", t.id).select().single();
    if (data) setItems((prev) => prev.map((item) => item.id === t.id ? data : item));
  };

  const columns = [
    { key: "name" as keyof Testimonial, label: "Name", render: (v: unknown) => <span className="text-white font-medium">{String(v)}</span> },
    { key: "company" as keyof Testimonial, label: "Company" },
    { key: "rating" as keyof Testimonial, label: "Rating", render: (v: unknown) => <span className="text-[#FFD400]">{"★".repeat(Number(v))}</span> },
    { key: "is_featured" as keyof Testimonial, label: "Featured", render: (v: unknown) => v ? <span className="text-[#FFD400] text-xs">Yes</span> : <span className="text-white/20 text-xs">No</span> },
    { key: "is_active" as keyof Testimonial, label: "Status", render: (v: unknown) => (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${v ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"}`}>
        {v ? "Active" : "Inactive"}
      </span>
    )},
  ];

  return (
    <>
      <DataTable title="Testimonials" data={items} columns={columns} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} onToggle={handleToggle} isActiveKey="is_active" searchKey="name" />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? "Edit Testimonial" : "New Testimonial"}>
        <div className="space-y-4">
          <Input label="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Textarea label="Content *" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Rating</label>
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
              {[5,4,3,2,1].map((r) => <option key={r} value={r} className="bg-[#0A0A0A]">{r} Stars</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="feat" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="accent-[#FFD400]" />
            <label htmlFor="feat" className="text-sm text-white/70">Featured</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={loading} className="flex-1">Save</Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
