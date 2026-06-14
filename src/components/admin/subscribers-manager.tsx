"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { UserCheck, UserX, Trash2, Download, Search, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/lib/types/database";

type Subscriber = Database["public"]["Tables"]["subscribers"]["Row"];

interface SubscribersManagerProps {
  initialSubscribers: Subscriber[];
}

export function SubscribersManager({ initialSubscribers }: SubscribersManagerProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [loading, setLoading] = useState<string | null>(null);
  const supabase = createClient();

  const filtered = subscribers.filter((s) => {
    const matchesSearch =
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || (filter === "active" ? s.is_active : !s.is_active);
    return matchesSearch && matchesFilter;
  });

  const activeCount = subscribers.filter((s) => s.is_active).length;

  async function toggleActive(id: string, current: boolean) {
    setLoading(id);
    const { error } = await supabase
      .from("subscribers")
      .update({ is_active: !current })
      .eq("id", id);
    if (!error) {
      setSubscribers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s))
      );
    }
    setLoading(null);
  }

  async function deleteSubscriber(id: string) {
    if (!confirm("Delete this subscriber?")) return;
    setLoading(id);
    const { error } = await supabase.from("subscribers").delete().eq("id", id);
    if (!error) {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    }
    setLoading(null);
  }

  function exportCSV() {
    const rows = [
      ["Email", "Name", "Status", "Subscribed At"],
      ...filtered.map((s) => [
        s.email,
        s.name ?? "",
        s.is_active ? "Active" : "Inactive",
        format(new Date(s.created_at), "yyyy-MM-dd"),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white mb-1">Subscribers</h1>
            <p className="text-white/40 text-sm">
              {activeCount} active · {subscribers.length} total
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFD400]/10 border border-[#FFD400]/20 text-[#FFD400] text-sm font-medium hover:bg-[#FFD400]/15 transition-all"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: "Total", value: subscribers.length, color: "text-white" },
            { label: "Active", value: activeCount, color: "text-green-400" },
            { label: "Inactive", value: subscribers.length - activeCount, color: "text-white/40" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-white/40 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by email or name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FFD400]/40 transition-colors"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium capitalize transition-all ${
                filter === f
                  ? "bg-[#FFD400]/10 border border-[#FFD400]/20 text-[#FFD400]"
                  : "bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.07]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Mail size={32} className="text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No subscribers found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {/* Table head */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 text-white/30 text-xs uppercase tracking-wider">
              <span>Subscriber</span>
              <span className="hidden sm:block">Joined</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {/* Rows */}
            {filtered.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
              >
                {/* Email + name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center flex-shrink-0 text-[#FFD400] text-xs font-bold">
                    {(sub.name ?? sub.email)[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    {sub.name && (
                      <p className="text-white text-sm font-medium truncate">{sub.name}</p>
                    )}
                    <p className={`text-sm truncate ${sub.name ? "text-white/40" : "text-white"}`}>
                      {sub.email}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="hidden sm:flex items-center gap-1.5 text-white/35 text-xs whitespace-nowrap">
                  <Calendar size={11} />
                  {format(new Date(sub.created_at), "MMM d, yyyy")}
                </div>

                {/* Status badge */}
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    sub.is_active
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-white/[0.05] text-white/30 border border-white/[0.08]"
                  }`}
                >
                  {sub.is_active ? "Active" : "Inactive"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(sub.id, sub.is_active)}
                    disabled={loading === sub.id}
                    title={sub.is_active ? "Deactivate" : "Activate"}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                      sub.is_active
                        ? "text-white/30 hover:text-orange-400 hover:bg-orange-500/10"
                        : "text-white/30 hover:text-green-400 hover:bg-green-500/10"
                    }`}
                  >
                    {sub.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                  </button>
                  <button
                    onClick={() => deleteSubscriber(sub.id)}
                    disabled={loading === sub.id}
                    title="Delete"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
