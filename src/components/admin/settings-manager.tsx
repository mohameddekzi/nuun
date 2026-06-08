"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sun, Moon, Image as ImgIcon } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import type { Setting } from "@/lib/types/database";

function parseVal(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "object") return JSON.stringify(v, null, 2);
  return String(v ?? "");
}

async function saveSetting(id: string, value: unknown) {
  const supabase = createClient();
  await supabase.from("settings").update({ value: value as import("@/lib/types/database").Json }).eq("id", id);
}

// Theme toggle UI for the theme_default setting
function ThemeSettingRow({ setting, onSave }: { setting: Setting; onSave: (id: string, val: string) => void }) {
  const current = typeof setting.value === "string" ? setting.value : "dark";
  const [val, setVal] = useState(current);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const select = async (v: string) => {
    setVal(v);
    setLoading(true);
    await saveSetting(setting.id, v);
    setLoading(false);
    setSaved(true);
    onSave(setting.id, v);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white font-medium text-sm">Default Website Theme</p>
        {saved && <span className="flex items-center gap-1.5 text-green-400 text-xs"><CheckCircle size={13} /> Saved</span>}
        {loading && <span className="text-white/40 text-xs">Saving…</span>}
      </div>
      <p className="text-white/40 text-xs mb-4">Sets the default theme for all website visitors. Users can still toggle manually.</p>
      <div className="flex gap-3">
        <button
          onClick={() => select("dark")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
            val === "dark"
              ? "bg-[#FFD400]/10 border-[#FFD400]/40 text-[#FFD400]"
              : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
          }`}
        >
          <Moon size={15} /> Dark Mode
        </button>
        <button
          onClick={() => select("light")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
            val === "light"
              ? "bg-[#FFD400]/10 border-[#FFD400]/40 text-[#FFD400]"
              : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
          }`}
        >
          <Sun size={15} /> Light Mode
        </button>
      </div>
    </div>
  );
}

// Logo upload UI for logo_url setting
function LogoSettingRow({ setting, onSave }: { setting: Setting; onSave: (id: string, val: string | null) => void }) {
  const [val, setVal] = useState<string | null>(typeof setting.value === "string" ? setting.value : null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = async (url: string | null) => {
    setVal(url);
    setLoading(true);
    await saveSetting(setting.id, url ?? "");
    setLoading(false);
    setSaved(true);
    onSave(setting.id, url);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-white font-medium text-sm flex items-center gap-2">
          <ImgIcon size={14} className="text-[#FFD400]" /> Logo (Header &amp; Footer)
        </p>
        {saved && <span className="flex items-center gap-1.5 text-green-400 text-xs"><CheckCircle size={13} /> Saved</span>}
        {loading && <span className="text-white/40 text-xs">Saving…</span>}
      </div>
      <p className="text-white/40 text-xs mb-4">Upload your logo. Recommended: PNG/SVG with transparent background.</p>
      <ImageUpload
        value={val}
        onChange={handleChange}
        folder="logos"
        label="Upload Logo"
        hint="PNG, SVG, WebP recommended"
        aspectRatio="aspect-[4/1]"
      />
    </div>
  );
}

// Logo height setting
function LogoHeightRow({ setting, onSave }: { setting: Setting; onSave: (id: string, val: string) => void }) {
  const current = typeof setting.value === "string" ? setting.value : typeof setting.value === "number" ? String(setting.value) : "32";
  const [val, setVal] = useState(current);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    await saveSetting(setting.id, val);
    setLoading(false);
    setSaved(true);
    onSave(setting.id, val);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-white font-medium text-sm">Logo Height (px)</p>
        {saved && <span className="flex items-center gap-1.5 text-green-400 text-xs"><CheckCircle size={13} /> Saved</span>}
      </div>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="20"
          max="80"
          step="2"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="flex-1 accent-[#FFD400]"
        />
        <span className="text-[#FFD400] font-bold text-sm w-10 text-center">{val}px</span>
        <Button size="sm" onClick={save} loading={loading} className="text-xs shrink-0">Save</Button>
      </div>
    </div>
  );
}

export function SettingsManager({ initialSettings }: { initialSettings: Setting[] }) {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSettingUpdate = (id: string, val: unknown) => {
    setSettings((prev) => prev.map((s) => s.id === id ? { ...s, value: val as typeof s.value } : s));
  };

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

  // Special-case keys that get custom UIs
  const specialKeys = new Set(["theme_default", "logo_url", "logo_height"]);

  return (
    <div>
      <h1 className="text-2xl font-black text-white mb-8">Site Settings</h1>

      <div className="space-y-8">
        {/* Appearance section (theme + logo) — shown first */}
        {(() => {
          const appearanceKeys = ["theme_default", "logo_url", "logo_height"];
          const rows = appearanceKeys.map((key) => settings.find((s) => s.key === key)).filter(Boolean) as Setting[];
          if (!rows.length) return null;
          return (
            <div>
              <h2 className="text-[#FFD400] text-xs font-bold tracking-widest uppercase mb-4">Appearance</h2>
              <div className="space-y-3">
                {rows.map((s) => {
                  if (s.key === "theme_default") return <ThemeSettingRow key={s.id} setting={s} onSave={handleSettingUpdate} />;
                  if (s.key === "logo_url") return <LogoSettingRow key={s.id} setting={s} onSave={handleSettingUpdate} />;
                  if (s.key === "logo_height") return <LogoHeightRow key={s.id} setting={s} onSave={handleSettingUpdate} />;
                  return null;
                })}
              </div>
            </div>
          );
        })()}

        {/* All other settings grouped by category */}
        {Object.entries(groups).map(([category, items]) => {
          const filtered = items.filter((s) => !specialKeys.has(s.key));
          if (!filtered.length) return null;
          return (
            <div key={category}>
              <h2 className="text-[#FFD400] text-xs font-bold tracking-widest uppercase mb-4 capitalize">{category}</h2>
              <div className="space-y-3">
                {filtered.map((setting) => {
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
                        <button onClick={() => handleSave(setting)} disabled={loading === setting.id} className="flex-shrink-0 mt-7">
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
          );
        })}
      </div>
    </div>
  );
}
