"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, GripVertical, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import type { ClientCompany } from "@/components/sections/clients-section";

interface ClientsManagerProps {
  initialClients: ClientCompany[];
  settingId: string | null;
}

export function ClientsManager({ initialClients, settingId }: ClientsManagerProps) {
  const [clients, setClients] = useState<ClientCompany[]>(initialClients);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);

  const save = async (updated: ClientCompany[]) => {
    setSaving(true);
    const supabase = createClient();
    if (settingId) {
      await supabase.from("settings").update({ value: updated as unknown as import("@/lib/types/database").Json }).eq("id", settingId);
    } else {
      await supabase.from("settings").insert({ key: "clients", value: updated as unknown as import("@/lib/types/database").Json, category: "content" });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addClient = () => {
    const newClient: ClientCompany = {
      id: Date.now().toString(),
      name: "",
      logo_url: "",
      website_url: "",
    };
    setClients((prev) => [...prev, newClient]);
  };

  const updateClient = (id: string, field: keyof ClientCompany, value: string | null) => {
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, [field]: value ?? "" } : c));
  };

  const removeClient = (id: string) => {
    const updated = clients.filter((c) => c.id !== id);
    setClients(updated);
  };

  const handleDragStart = (id: string) => setDragging(id);

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragging || dragging === targetId) return;
    const from = clients.findIndex((c) => c.id === dragging);
    const to = clients.findIndex((c) => c.id === targetId);
    if (from === -1 || to === -1) return;
    const updated = [...clients];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    setClients(updated);
  };

  const handleDrop = () => setDragging(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Client Companies</h1>
          <p className="text-white/40 text-sm mt-1">Add client logos to display in the &quot;Trusted By&quot; section on the homepage.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="flex items-center gap-1.5 text-green-400 text-sm"><CheckCircle size={14} /> Saved!</span>}
          <Button onClick={addClient} className="gap-2 text-xs" size="sm">
            <Plus size={14} /> Add Client
          </Button>
          <Button onClick={() => save(clients)} loading={saving} className="text-xs" size="sm">
            Save All
          </Button>
        </div>
      </div>

      {clients.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
          <p className="text-white/30 text-sm mb-4">No clients yet. Add your first client company.</p>
          <Button onClick={addClient} className="gap-2 text-xs" size="sm"><Plus size={14} /> Add Client</Button>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {clients.map((client) => (
            <motion.div
              key={client.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              draggable
              onDragStart={() => handleDragStart(client.id)}
              onDragOver={(e) => handleDragOver(e, client.id)}
              onDrop={handleDrop}
              className={`bg-white/[0.03] border rounded-2xl p-5 transition-all ${dragging === client.id ? "border-[#FFD400]/40 opacity-50" : "border-white/[0.08]"}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-3 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40 transition-colors">
                  <GripVertical size={18} />
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Logo upload */}
                  <ImageUpload
                    value={client.logo_url || null}
                    onChange={(url) => updateClient(client.id, "logo_url", url)}
                    folder="clients"
                    label="Client Logo"
                    hint="PNG, SVG, WebP recommended"
                    aspectRatio="aspect-[3/1]"
                  />

                  <div className="space-y-3">
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block">Company Name</label>
                      <input
                        value={client.name}
                        onChange={(e) => updateClient(client.id, "name", e.target.value)}
                        placeholder="e.g. UNICEF Somalia"
                        className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50 placeholder:text-white/20"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block flex items-center gap-1">
                        <ExternalLink size={10} /> Website URL (optional)
                      </label>
                      <input
                        value={client.website_url ?? ""}
                        onChange={(e) => updateClient(client.id, "website_url", e.target.value)}
                        placeholder="https://example.com"
                        className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50 placeholder:text-white/20"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeClient(client.id)}
                  className="mt-2 p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {clients.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Button onClick={() => save(clients)} loading={saving} className="gap-2">
            <CheckCircle size={15} /> Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
