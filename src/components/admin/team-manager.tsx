"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "./data-table";
import { Modal } from "./modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { TeamMember } from "@/lib/types/database";

export function TeamManager({ initialTeam }: { initialTeam: TeamMember[] }) {
  const [team, setTeam] = useState(initialTeam);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({ name: "", position: "", bio: "", order_index: 0 });
  const [loading, setLoading] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", position: "", bio: "", order_index: team.length });
    setIsOpen(true);
  };

  const openEdit = (t: TeamMember) => {
    setEditing(t);
    setForm({ name: t.name, position: t.position ?? "", bio: t.bio ?? "", order_index: t.order_index });
    setIsOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    if (editing) {
      const { data } = await supabase.from("team_members").update(form).eq("id", editing.id).select().single();
      if (data) setTeam((prev) => prev.map((t) => t.id === editing.id ? data : t));
    } else {
      const { data } = await supabase.from("team_members").insert({ ...form, is_active: true }).select().single();
      if (data) setTeam((prev) => [...prev, data]);
    }
    setLoading(false);
    setIsOpen(false);
  };

  const handleDelete = async (t: TeamMember) => {
    if (!confirm(`Remove "${t.name}" from the team?`)) return;
    const supabase = createClient();
    await supabase.from("team_members").delete().eq("id", t.id);
    setTeam((prev) => prev.filter((item) => item.id !== t.id));
  };

  const columns = [
    { key: "name" as keyof TeamMember, label: "Name", render: (v: unknown) => <span className="text-white font-medium">{String(v)}</span> },
    { key: "position" as keyof TeamMember, label: "Position" },
    { key: "is_active" as keyof TeamMember, label: "Status", render: (v: unknown) => (
      <span className={`text-xs px-2 py-1 rounded-full ${v ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"}`}>{v ? "Active" : "Hidden"}</span>
    )},
  ];

  return (
    <>
      <DataTable title="Team Members" data={team} columns={columns} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} searchKey="name" />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editing ? "Edit Member" : "Add Team Member"}>
        <div className="space-y-4">
          <Input label="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Position / Role" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Creative Director" />
          <Textarea label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} />
          <Input label="Display Order" type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={loading} className="flex-1">Save Member</Button>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
