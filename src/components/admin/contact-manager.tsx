"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "./modal";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Mail, Phone, Building2, Tag, Trash2, Eye, CheckCircle } from "lucide-react";
import type { ContactMessage } from "@/lib/types/database";
import { motion } from "framer-motion";

export function ContactManager({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search
    ? messages.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))
    : messages;

  const handleView = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.is_read) {
      const supabase = createClient();
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", msg.id);
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m));
    }
  };

  const handleDelete = async (msg: ContactMessage) => {
    if (!confirm("Delete this message?")) return;
    const supabase = createClient();
    await supabase.from("contact_messages").delete().eq("id", msg.id);
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    if (selected?.id === msg.id) setSelected(null);
  };

  const statusColors: Record<string, string> = {
    new: "bg-[#FFD400]/10 text-[#FFD400]",
    in_progress: "bg-blue-500/10 text-blue-400",
    resolved: "bg-green-500/10 text-green-400",
    closed: "bg-white/5 text-white/30",
  };

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Messages</h1>
          {unread > 0 && <p className="text-[#FFD400] text-sm mt-1">{unread} unread message{unread !== 1 ? "s" : ""}</p>}
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 px-4 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FFD400]/50 w-48"
        />
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-white/30 text-sm">No messages found</p>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer ${!msg.is_read ? "border-l-2 border-[#FFD400]" : ""}`}
                onClick={() => handleView(msg)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-sm font-medium ${!msg.is_read ? "text-white" : "text-white/70"}`}>{msg.name}</span>
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-[#FFD400]" />}
                  </div>
                  <p className="text-white/40 text-xs truncate">{msg.email}</p>
                  <p className="text-white/30 text-xs mt-0.5 truncate">{msg.message}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[msg.status] ?? "bg-white/5 text-white/40"}`}>
                    {msg.status}
                  </span>
                  <span className="text-white/30 text-xs">{format(new Date(msg.created_at), "MMM d")}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(msg); }} className="p-1.5 text-white/30 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Message detail modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Message Details" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Mail size={14} className="text-[#FFD400] mt-0.5" />
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-white text-sm hover:text-[#FFD400]">{selected.email}</a>
                </div>
              </div>
              {selected.phone && (
                <div className="flex items-start gap-3">
                  <Phone size={14} className="text-[#FFD400] mt-0.5" />
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Phone</p>
                    <p className="text-white text-sm">{selected.phone}</p>
                  </div>
                </div>
              )}
              {selected.company && (
                <div className="flex items-start gap-3">
                  <Building2 size={14} className="text-[#FFD400] mt-0.5" />
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Company</p>
                    <p className="text-white text-sm">{selected.company}</p>
                  </div>
                </div>
              )}
              {selected.service && (
                <div className="flex items-start gap-3">
                  <Tag size={14} className="text-[#FFD400] mt-0.5" />
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">Service</p>
                    <p className="text-white text-sm">{selected.service}</p>
                  </div>
                </div>
              )}
            </div>
            {selected.subject && (
              <div>
                <p className="text-white/40 text-xs mb-1">Subject</p>
                <p className="text-white font-medium">{selected.subject}</p>
              </div>
            )}
            <div>
              <p className="text-white/40 text-xs mb-2">Message</p>
              <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-white/30">
              <span>Received: {format(new Date(selected.created_at), "PPP 'at' p")}</span>
              <CheckCircle size={14} className="text-green-400" />
            </div>
            <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || "Your Inquiry"}`}>
              <Button size="sm" className="gap-2">
                <Mail size={14} /> Reply via Email
              </Button>
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}
