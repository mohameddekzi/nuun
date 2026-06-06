"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "./data-table";
import { Modal } from "./modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { FAQ } from "@/lib/types/database";

export function FAQManager({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const [items, setItems] = useState(initialFaqs);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", category: "general", order_index: 0 });
  const [loading, setLoading] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ question: "", answer: "", category: "general", order_index: items.length + 1 });
    setIsOpen(true);
  };

  const openEdit = (f: FAQ) => {
    setEditing(f);
    setForm({ question: f.question, answer: f.answer, category: f.category, order_index: f.order_index });
    setIsOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    if (editing) {
      const { data } = await supabase.from("faq").update(form).eq("id", editing.id).select().single();
      if (data) setItems((prev) => prev.map((f) => f.id === editing.id ? data : f));
    } else {
      const { data } = await supabase.from("faq").insert({ ...form, is_active: true }).select().single();
      if (data) setItems((prev) => [...prev, data]);
    }
    setLoading(false);
    setIsOpen(false);
  };

  const handleDelete = async (f: FAQ) => {
    if (!confirm("Delete this FAQ?")) return;
    const supabase = createClient();
    await supabase.from("faq").delete().eq("id", f.id);
    setItems((prev) => prev.filter((item) => item.id !== f.id));
  };

  const columns = [
    { key: "order_index" as keyof FAQ, label: "#" },
    { key: "question" as keyof FAQ, label: "Question", render: (v: unknown) => <span className="text-white">{String(v)}</span> },
    { key: "category" as keyof FAQ, label: "Category", render: (v: unknown) => <span className="text-white/50 text-xs capitalize">{String(v)}</span> },
    { key: "is_active" as keyof FAQ, label: "Status", render: (v: unknown) => (
      <span className={`text-xs px-2 py-1 rounded-full ${v ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"}`}>{v ? "Active" : "Hidden"}</span>
    )},
  ];

  return (
    <>
      <DataTable title="FAQ" data={items} columns={columns} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} searchKey="question" />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? "Edit FAQ" : "New FAQ"}>
        <div className="space-y-4">
          <Input label="Question *" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          <Textarea label="Answer *" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={5} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
              {["general", "process", "pricing", "technical"].map((c) => <option key={c} value={c} className="bg-[#0A0A0A] capitalize">{c}</option>)}
            </select>
          </div>
          <Input label="Display Order" type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={loading} className="flex-1">Save FAQ</Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
