"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import type { Setting } from "@/lib/types/database";

function parseVal(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "object") return JSON.stringify(v, null, 2);
  return String(v ?? "");
}

export function SettingsManager({ initialSettings }: { initialSettings: Setting[] }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const groups = settings.reduce<Record<string, Setting[]>>((acc, s) => {
    const cat = s.category || "general";
    acc[cat] = [...(acc[cat] || []), s];
    return acc;
  }, {});

  const handleChange = (id: string, value: string) => {
    setSettings((prev) => prev.map((s) => s.id === id ? { ...s, _draft: value } as Setting & { _draft: string } : s));
  };

  const handleSave = async (setting: Setting) => {
    setLoading(setting.id);
    const supabase = createClient();
    const draft = (setting as Setting & { _draft?: string })._draft ?? parseVal(setting.value);
    let parsedVal: unknown;
    try {
      parsedVal = JSON.parse(draft);
    } catch {
      parsedVal = draft;
    }
    await supabase.from("settings").update({ value: parsedVal as import("@/lib/types/database").Json }).eq("id", setting.id);
    setSettings((prev) => prev.map((s) => s.id === setting.id ? { ...s, value: parsedVal as typeof s.value } : s));
    setLoading(null);
    setSaved(setting.id);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Site Settings</h1>

      <div className="space-y-8">
        {Object.entries(groups).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-[#FFD400] text-xs font-bold tracking-widest uppercase mb-4 capitalize">{category}</h2>
            <div className="space-y-3">
              {items.map((setting) => {
                const val = (setting as Setting & { _draft?: string })._draft ?? parseVal(setting.value);
                const isJson = typeof setting.value === "object";
                return (
                  <div key={setting.id} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm mb-3">{setting.key.replace(/_/g, " ")}</p>
                        {isJson ? (
                          <textarea
                            value={val}
                            onChange={(e) => handleChange(setting.id, e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/80 text-xs font-mono focus:outline-none focus:border-[#FFD400]/50 resize-none"
                          />
                        ) : (
                          <input
                            value={val}
                            onChange={(e) => handleChange(setting.id, e.target.value)}
                            className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/50"
                          />
                        )}
                      </div>
                      <button
                        onClick={() => handleSave(setting)}
                        disabled={loading === setting.id}
                        className="flex-shrink-0 mt-7"
                      >
                        {saved === setting.id ? (
                          <div className="flex items-center gap-1.5 text-green-400 text-xs"><CheckCircle size={14} /> Saved</div>
                        ) : (
                          <Button size="sm" loading={loading === setting.id} className="text-xs">Save</Button>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
