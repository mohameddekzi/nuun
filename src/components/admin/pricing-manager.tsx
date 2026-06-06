"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "./data-table";
import { Modal } from "./modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { PricingPlan } from "@/lib/types/database";

export function PricingManager({ initialPlans }: { initialPlans: PricingPlan[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", price: "", period: "project", features: "", is_popular: false });
  const [loading, setLoading] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", price: "", period: "project", features: "", is_popular: false });
    setIsOpen(true);
  };

  const openEdit = (p: PricingPlan) => {
    setEditing(p);
    const feats = Array.isArray(p.features) ? (p.features as string[]).join("\n") : "";
    setForm({ name: p.name, slug: p.slug ?? "", description: p.description ?? "", price: p.price !== null ? String(p.price) : "", period: p.period, features: feats, is_popular: p.is_popular });
    setIsOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    const featuresList = form.features.split("\n").map((f) => f.trim()).filter(Boolean);
    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: form.price ? parseFloat(form.price) : null,
      period: form.period,
      features: featuresList,
      is_popular: form.is_popular,
    };
    if (editing) {
      const { data } = await supabase.from("pricing_plans").update(payload).eq("id", editing.id).select().single();
      if (data) setPlans((prev) => prev.map((p) => p.id === editing.id ? data : p));
    } else {
      const { data } = await supabase.from("pricing_plans").insert({ ...payload, is_active: true }).select().single();
      if (data) setPlans((prev) => [...prev, data]);
    }
    setLoading(false);
    setIsOpen(false);
  };

  const handleDelete = async (p: PricingPlan) => {
    if (!confirm(`Delete "${p.name}" plan?`)) return;
    const supabase = createClient();
    await supabase.from("pricing_plans").delete().eq("id", p.id);
    setPlans((prev) => prev.filter((item) => item.id !== p.id));
  };

  const columns = [
    { key: "name" as keyof PricingPlan, label: "Plan", render: (v: unknown) => <span className="text-white font-medium">{String(v)}</span> },
    { key: "price" as keyof PricingPlan, label: "Price", render: (v: unknown) => v !== null ? <span className="text-[#FFD400]">${String(v)}</span> : <span className="text-white/30">Custom</span> },
    { key: "period" as keyof PricingPlan, label: "Period" },
    { key: "is_popular" as keyof PricingPlan, label: "Popular", render: (v: unknown) => v ? <span className="text-[#FFD400] text-xs">★ Popular</span> : <span className="text-white/20 text-xs">No</span> },
    { key: "is_active" as keyof PricingPlan, label: "Status", render: (v: unknown) => (
      <span className={`text-xs px-2 py-1 rounded-full ${v ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"}`}>{v ? "Active" : "Hidden"}</span>
    )},
  ];

  return (
    <>
      <DataTable title="Pricing Plans" data={plans} columns={columns} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? "Edit Plan" : "New Plan"}>
        <div className="space-y-4">
          <Input label="Plan Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Starter" />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="starter" />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Price (leave empty for custom)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1500" type="number" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-white/70">Period</label>
            <select value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none">
              {["project", "month", "year"].map((p) => <option key={p} value={p} className="bg-[#0A0A0A]">{p}</option>)}
            </select>
          </div>
          <Textarea label="Features (one per line)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={6} placeholder={"Brand audit\nLogo design\nBrand guidelines"} />
          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
            <input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} className="accent-[#FFD400]" />
            Mark as Popular
          </label>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={loading} className="flex-1">Save Plan</Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
