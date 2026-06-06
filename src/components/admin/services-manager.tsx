"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "./data-table";
import { Modal } from "./modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { Service } from "@/lib/types/database";

interface ServicesManagerProps {
  initialServices: Service[];
}

export function ServicesManager({ initialServices }: ServicesManagerProps) {
  const [services, setServices] = useState(initialServices);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", short_description: "", description: "", icon: "", order_index: 0 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const openAdd = () => {
    setEditing(null);
    setForm({ title: "", slug: "", short_description: "", description: "", icon: "", order_index: services.length });
    setIsOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ title: s.title, slug: s.slug ?? "", short_description: s.short_description ?? "", description: s.description ?? "", icon: s.icon ?? "", order_index: s.order_index });
    setIsOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    if (editing) {
      const { data } = await supabase.from("services").update(form).eq("id", editing.id).select().single();
      if (data) setServices((prev) => prev.map((s) => s.id === editing.id ? data : s));
    } else {
      const { data } = await supabase.from("services").insert({ ...form, is_active: true }).select().single();
      if (data) setServices((prev) => [...prev, data]);
    }
    setLoading(false);
    setIsOpen(false);
  };

  const handleDelete = async (s: Service) => {
    if (!confirm(`Delete "${s.title}"?`)) return;
    const supabase = createClient();
    await supabase.from("services").delete().eq("id", s.id);
    setServices((prev) => prev.filter((item) => item.id !== s.id));
  };

  const handleToggle = async (s: Service) => {
    const supabase = createClient();
    const { data } = await supabase.from("services").update({ is_active: !s.is_active }).eq("id", s.id).select().single();
    if (data) setServices((prev) => prev.map((item) => item.id === s.id ? data : item));
  };

  const columns = [
    { key: "order_index" as keyof Service, label: "#", render: (v: unknown) => <span className="text-white/30 text-xs">{String(v)}</span> },
    { key: "title" as keyof Service, label: "Service", render: (v: unknown) => <span className="text-white font-medium">{String(v)}</span> },
    { key: "icon" as keyof Service, label: "Icon" },
    { key: "is_active" as keyof Service, label: "Status", render: (v: unknown) => (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${v ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"}`}>
        {v ? "Active" : "Inactive"}
      </span>
    )},
  ];

  return (
    <>
      <DataTable
        title="Services"
        data={services}
        columns={columns}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
        isActiveKey="is_active"
        searchKey="title"
      />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? "Edit Service" : "New Service"}>
        <div className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Brand & Visual Identity" />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="brand-visual-identity" />
          <Input label="Icon (Lucide name)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Palette" />
          <Textarea label="Short Description" value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} rows={2} />
          <Textarea label="Full Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
          <Input label="Display Order" type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={loading} className="flex-1">Save Service</Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
