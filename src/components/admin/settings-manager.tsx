"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Palette, Settings2, Phone, Search, Share2, Users,
  CheckCircle2, Moon, Sun, Monitor, Ruler, Globe,
  MapPin, Mail, PhoneCall, AlignLeft,
  FileText, Tag, Save, AtSign, Plus, Trash2, Shield,
} from "lucide-react";
import type { Setting, Json } from "@/lib/types/database";

/* ─── helpers ─────────────────────────────── */
function str(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object" && v !== null) return JSON.stringify(v);
  return String(v ?? "");
}

const supabase = createClient();

/** Create the settings row if missing, otherwise update it. Returns an error message on failure, or null on success. */
async function upsertSetting(key: string, value: unknown, category: string): Promise<string | null> {
  const { data: existing } = await supabase
    .from("settings").select("id").eq("key", key).maybeSingle();
  const { error } = existing?.id
    ? await supabase.from("settings").update({ value: value as Json }).eq("id", existing.id)
    : await supabase.from("settings").insert({ key, value: value as Json, category });
  return error?.message ?? null;
}

/* ─── sidebar sections ─────────────────────── */
const SECTIONS = [
  { id: "general",   label: "General",      icon: Settings2, desc: "Site name, tagline & description" },
  { id: "branding",  label: "Branding",     icon: Palette,   desc: "Theme, header & footer logos" },
  { id: "seo",       label: "SEO",          icon: Search,    desc: "Meta titles & descriptions" },
  { id: "social",    label: "Social Media", icon: Share2,    desc: "Channel links shown in the footer" },
  { id: "team",      label: "Team Access",  icon: Users,     desc: "People with admin access" },
  { id: "contact",   label: "Contact",      icon: Phone,     desc: "Phone, email & address" },
  { id: "other",     label: "Other",        icon: Settings2, desc: "Remaining settings" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const knownCategories = new Set(["appearance", "branding", "general", "contact", "seo", "social"]);
const specialKeys = new Set([
  "theme_default",
  "logo_url", "header_logo_light", "logo_height",
  "footer_logo_url", "footer_logo_light", "footer_logo_height",
  "social_instagram", "social_twitter", "social_facebook", "social_linkedin", "social_youtube", "social_tiktok",
  "team_access", "clients",
]);

/* ─── shared bits ──────────────────────────── */
function SavedBadge({ visible }: { visible: boolean }) {
  return visible ? (
    <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
      <CheckCircle2 size={12} /> Saved
    </span>
  ) : null;
}

function SectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <h3 className="text-white font-bold text-sm">{title}</h3>
        {desc && <p className="text-white/35 text-xs mt-0.5">{desc}</p>}
      </div>
      <div className="px-6 py-5 space-y-6">{children}</div>
    </div>
  );
}

function SaveButton({ onClick, loading, disabled }: { onClick: () => void; loading: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FFD400] text-[#0A0A0A] text-xs font-bold disabled:opacity-40 hover:bg-[#FFD400]/90 transition-all"
    >
      <Save size={11} />
      {loading ? "Saving…" : "Save"}
    </button>
  );
}

/* ─── generic text field (saves by key via upsert) ─── */
function FieldRow({
  label, icon: Icon, hint, value, multiline = false, placeholder, onSave,
}: {
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  hint?: string;
  value: string;
  multiline?: boolean;
  placeholder?: string;
  onSave: (val: string) => Promise<string | null | void>;
}) {
  const [draft, setDraft] = useState(value);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setLoading(true);
    setError(null);
    const err = await onSave(draft);
    setLoading(false);
    if (err) { setError(err); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-white/70 text-xs font-semibold uppercase tracking-wider">
          {Icon && <Icon size={11} className="text-[#FFD400]" />}
          {label}
        </label>
        <SavedBadge visible={saved} />
      </div>
      {hint && <p className="text-white/30 text-xs">{hint}</p>}
      {error && <p className="text-xs text-red-400">Could not save: {error}</p>}
      {multiline ? (
        <textarea
          value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FFD400]/40 transition-colors resize-none"
        />
      ) : (
        <input
          value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="w-full h-10 px-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FFD400]/40 transition-colors"
        />
      )}
      <div className="flex justify-end">
        <SaveButton onClick={save} loading={loading} disabled={draft === value} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BRANDING — theme + 4 logos
══════════════════════════════════════════════ */
function ThemeCard({ value, active, onSelect }: { value: "dark" | "light" | "system"; active: boolean; onSelect: () => void }) {
  const meta = {
    dark:   { icon: Moon,    label: "Dark",      desc: "Dark background" },
    light:  { icon: Sun,     label: "Light",     desc: "Light background" },
    system: { icon: Monitor, label: "Automatic", desc: "Follows device" },
  }[value];
  const Icon = meta.icon;
  return (
    <button
      onClick={onSelect}
      className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
        active ? "border-[#FFD400] bg-[#FFD400]/[0.06]" : "border-white/[0.08] hover:border-white/20"
      }`}
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
        value === "dark" ? "bg-[#0A0A0A] border border-white/20"
        : value === "light" ? "bg-white border border-black/10"
        : "bg-gradient-to-br from-[#0A0A0A] to-white border border-white/20"
      }`}>
        <Icon size={16} className={value === "light" ? "text-[#C49A00]" : "text-[#FFD400]"} />
      </div>
      <div className="text-center">
        <p className={`text-sm font-semibold ${active ? "text-[#FFD400]" : "text-white/60"}`}>{meta.label}</p>
        <p className="text-white/30 text-[11px] mt-0.5">{meta.desc}</p>
      </div>
      {active && (
        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#FFD400] flex items-center justify-center">
          <CheckCircle2 size={10} className="text-black" />
        </span>
      )}
    </button>
  );
}

function LogoSlot({ label, keyName, initial, height }: { label: string; keyName: string; initial: string | null; height: number }) {
  const [val, setVal] = useState<string | null>(initial);
  const [saved, setSaved] = useState(false);

  const handle = async (url: string | null) => {
    setVal(url);
    await upsertSetting(keyName, url ?? "", "branding");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const isLight = label.toLowerCase().includes("light");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-white/60 text-xs font-medium">{label}</p>
        <SavedBadge visible={saved} />
      </div>
      <div className={isLight ? "rounded-xl p-2 bg-white/95" : ""}>
        <ImageUpload
          value={val}
          onChange={handle}
          folder="logos"
          label="Upload"
          hint="PNG / SVG · transparent"
          aspectRatio="aspect-[5/2]"
        />
      </div>
      {val && (
        <p className="text-white/25 text-[10px] text-center">Preview at {height}px height</p>
      )}
    </div>
  );
}

function LogoGroup({
  title, darkKey, lightKey, heightKey, darkVal, lightVal, heightVal,
}: {
  title: string;
  darkKey: string; lightKey: string; heightKey: string;
  darkVal: string | null; lightVal: string | null; heightVal: number;
}) {
  const [height, setHeight] = useState(String(heightVal));
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveHeight = async () => {
    setLoading(true);
    await upsertSetting(heightKey, height, "branding");
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4">
      <p className="text-white font-semibold text-sm">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <LogoSlot label={`${title} — Dark Mode`} keyName={darkKey} initial={darkVal} height={parseInt(height) || 32} />
        <LogoSlot label={`${title} — Light Mode`} keyName={lightKey} initial={lightVal} height={parseInt(height) || 32} />
      </div>
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-white/70 text-xs font-semibold uppercase tracking-wider">
            <Ruler size={11} className="text-[#FFD400]" /> {title} Height
          </label>
          <SavedBadge visible={saved} />
        </div>
        <div className="flex items-center gap-4">
          <input type="range" min="20" max="80" step="2" value={height}
            onChange={(e) => setHeight(e.target.value)} className="flex-1 accent-[#FFD400]" />
          <span className="text-[#FFD400] font-bold text-sm w-12 text-center">{height}px</span>
          <SaveButton onClick={saveHeight} loading={loading} />
        </div>
      </div>
    </div>
  );
}

function BrandingSection({ settings }: { settings: Setting[] }) {
  const get = (k: string) => settings.find((s) => s.key === k);
  const sval = (k: string) => { const v = get(k)?.value; return typeof v === "string" && v.trim() ? v : null; };

  const { setTheme: applyTheme } = useTheme();
  const [theme, setTheme] = useState(str(get("theme_default")?.value) || "dark");
  const [themeSaved, setThemeSaved] = useState(false);
  const [themeError, setThemeError] = useState<string | null>(null);

  const saveTheme = async (v: "dark" | "light" | "system") => {
    const prev = theme;
    setTheme(v);          // optimistic — highlight the chosen card immediately
    applyTheme(v);        // apply live so the choice is visibly active right away
    setThemeError(null);
    const err = await upsertSetting("theme_default", v, "branding");
    if (err) {
      setTheme(prev);     // revert highlight if the save was rejected
      setThemeError(err);
      return;
    }
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Theme */}
      <SectionCard title="Website Theme" desc="Default appearance for visitors. 'Automatic' follows the visitor's device setting.">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/50 text-xs">Active theme</span>
            <SavedBadge visible={themeSaved} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <ThemeCard value="dark"   active={theme === "dark"}   onSelect={() => saveTheme("dark")} />
            <ThemeCard value="light"  active={theme === "light"}  onSelect={() => saveTheme("light")} />
            <ThemeCard value="system" active={theme === "system"} onSelect={() => saveTheme("system")} />
          </div>
          {themeError && (
            <p className="mt-3 text-xs text-red-400">Could not save: {themeError}</p>
          )}
        </div>
      </SectionCard>

      {/* Header logos */}
      <SectionCard title="Header Logo" desc="Shown in the top navigation bar. Upload a separate version for dark and light mode so it never disappears.">
        <LogoGroup
          title="Header"
          darkKey="logo_url" lightKey="header_logo_light" heightKey="logo_height"
          darkVal={sval("logo_url")} lightVal={sval("header_logo_light")}
          heightVal={get("logo_height") ? parseInt(str(get("logo_height")?.value)) || 32 : 32}
        />
      </SectionCard>

      {/* Footer logos */}
      <SectionCard title="Footer Logo" desc="Shown in the site footer — independent from the header logo.">
        <LogoGroup
          title="Footer"
          darkKey="footer_logo_url" lightKey="footer_logo_light" heightKey="footer_logo_height"
          darkVal={sval("footer_logo_url")} lightVal={sval("footer_logo_light")}
          heightVal={get("footer_logo_height") ? parseInt(str(get("footer_logo_height")?.value)) || 36 : 36}
        />
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SOCIAL MEDIA
══════════════════════════════════════════════ */
const SOCIAL_FIELDS = [
  { key: "social_instagram", label: "Instagram", placeholder: "https://instagram.com/yourbrand" },
  { key: "social_twitter",   label: "Twitter / X", placeholder: "https://x.com/yourbrand" },
  { key: "social_facebook",  label: "Facebook", placeholder: "https://facebook.com/yourbrand" },
  { key: "social_linkedin",  label: "LinkedIn", placeholder: "https://linkedin.com/company/yourbrand" },
  { key: "social_youtube",   label: "YouTube", placeholder: "https://youtube.com/@yourbrand" },
  { key: "social_tiktok",    label: "TikTok", placeholder: "https://tiktok.com/@yourbrand" },
];

function SocialSection({ settings }: { settings: Setting[] }) {
  const get = (k: string) => str(settings.find((s) => s.key === k)?.value);
  return (
    <SectionCard title="Social Media Links" desc="Paste the full URL for each channel. Only filled channels appear in the website footer.">
      {SOCIAL_FIELDS.map((f) => (
        <FieldRow
          key={f.key}
          label={f.label}
          icon={AtSign}
          placeholder={f.placeholder}
          value={get(f.key)}
          onSave={(val) => upsertSetting(f.key, val, "social")}
        />
      ))}
    </SectionCard>
  );
}

/* ═══════════════════════════════════════════
   TEAM ACCESS
══════════════════════════════════════════════ */
interface TeamEntry { name: string; email: string; role: string }
const ROLES = ["Admin", "Editor", "Viewer"];

function TeamAccessSection({ settings }: { settings: Setting[] }) {
  const initial = (() => {
    const v = settings.find((s) => s.key === "team_access")?.value;
    return Array.isArray(v) ? (v as unknown as TeamEntry[]) : [];
  })();

  const [members, setMembers] = useState<TeamEntry[]>(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [saved, setSaved] = useState(false);

  const persist = async (next: TeamEntry[]) => {
    setMembers(next);
    await upsertSetting("team_access", next as unknown as Json, "team");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const add = () => {
    if (!email.trim()) return;
    persist([...members, { name: name.trim(), email: email.trim(), role }]);
    setName(""); setEmail(""); setRole("Editor");
  };

  const remove = (i: number) => persist(members.filter((_, idx) => idx !== i));

  const roleColor = (r: string) =>
    r === "Admin" ? "bg-[#FFD400]/10 text-[#FFD400] border-[#FFD400]/20"
    : r === "Editor" ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
    : "bg-white/[0.05] text-white/40 border-white/[0.08]";

  return (
    <SectionCard title="Team Access" desc="People who manage this site. Manage their email and access level here.">
      <div className="flex items-center justify-between -mt-2">
        <span className="text-white/40 text-xs">{members.length} member{members.length !== 1 ? "s" : ""}</span>
        <SavedBadge visible={saved} />
      </div>

      {/* List */}
      <div className="space-y-2">
        {members.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-white/[0.08] rounded-xl">
            <Users size={22} className="text-white/15 mx-auto mb-2" />
            <p className="text-white/25 text-sm">No team members yet</p>
          </div>
        ) : (
          members.map((m, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/[0.07] rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center flex-shrink-0 text-[#FFD400] text-xs font-bold">
                {(m.name || m.email)[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                {m.name && <p className="text-white text-sm font-medium truncate">{m.name}</p>}
                <p className={`text-xs truncate ${m.name ? "text-white/40" : "text-white"}`}>{m.email}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${roleColor(m.role)}`}>
                <Shield size={10} /> {m.role}
              </span>
              <button onClick={() => remove(i)} className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add form */}
      <div className="pt-2 border-t border-white/[0.05] space-y-3">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Add Member</p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
          <input
            value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)"
            className="h-10 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FFD400]/40"
          />
          <input
            value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" type="email"
            className="h-10 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FFD400]/40"
          />
          <select
            value={role} onChange={(e) => setRole(e.target.value)}
            className="h-10 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-[#FFD400]/40"
          >
            {ROLES.map((r) => <option key={r} value={r} className="bg-[#0A0A0A]">{r}</option>)}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={add}
            disabled={!email.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FFD400] text-[#0A0A0A] text-xs font-bold disabled:opacity-40 hover:bg-[#FFD400]/90 transition-all"
          >
            <Plus size={13} /> Add Member
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

/* ═══════════════════════════════════════════
   GENERIC CATEGORY (general / contact / seo)
══════════════════════════════════════════════ */
const fieldMeta: Record<string, { icon?: React.ComponentType<{ size?: number; className?: string }>; hint?: string; multiline?: boolean; label?: string }> = {
  site_name:        { icon: Globe,     label: "Site Name",        hint: "Displayed in the browser tab and header" },
  site_tagline:     { icon: Tag,       label: "Tagline",          hint: "Short slogan shown under the logo" },
  site_description: { icon: AlignLeft,  label: "Description",      hint: "Used in meta tags and intro sections", multiline: true },
  site_language:    { icon: Globe,     label: "Language",         hint: "e.g. en, so, ar" },
  contact_phone:    { icon: PhoneCall, label: "Phone",            hint: "Main contact phone number" },
  contact_email:    { icon: Mail,      label: "Email",            hint: "Main contact email address" },
  contact_address:  { icon: MapPin,    label: "Address",          hint: "Physical address displayed on the site" },
  contact_hours:    { icon: PhoneCall, label: "Business Hours",   hint: "e.g. Mon–Fri 9am–6pm", multiline: true },
  seo_title:        { icon: Search,    label: "Default SEO Title", hint: "Fallback page title for search engines" },
  seo_description:  { icon: FileText,  label: "Meta Description", hint: "150–160 chars shown in Google results", multiline: true },
};

function CategorySection({ category, settings }: { category: string; settings: Setting[] }) {
  const rows = settings.filter((s) => s.category === category && !specialKeys.has(s.key));
  const sectionMeta = SECTIONS.find((s) => s.id === category);

  if (!rows.length) {
    return (
      <SectionCard title={(sectionMeta?.label ?? category) + " Settings"} desc={sectionMeta?.desc}>
        <p className="text-white/25 text-sm text-center py-4">No settings in this section yet.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title={(sectionMeta?.label ?? category) + " Settings"} desc={sectionMeta?.desc}>
      {rows.map((setting) => {
        const meta = fieldMeta[setting.key] ?? {};
        return (
          <FieldRow
            key={setting.id}
            label={meta.label ?? setting.key.replace(/_/g, " ")}
            icon={meta.icon}
            hint={meta.hint}
            multiline={meta.multiline}
            value={str(setting.value)}
            onSave={async (val) => { await supabase.from("settings").update({ value: val as Json }).eq("id", setting.id); }}
          />
        );
      })}
    </SectionCard>
  );
}

function OtherSection({ settings }: { settings: Setting[] }) {
  const rows = settings.filter((s) => (!knownCategories.has(s.category ?? "") || !s.category) && !specialKeys.has(s.key));
  return (
    <SectionCard title="Other Settings">
      {rows.length === 0 ? (
        <p className="text-white/25 text-sm text-center py-4">No additional settings.</p>
      ) : (
        rows.map((setting) => (
          <FieldRow
            key={setting.id}
            label={setting.key.replace(/_/g, " ")}
            value={str(setting.value)}
            onSave={async (val) => { await supabase.from("settings").update({ value: val as Json }).eq("id", setting.id); }}
          />
        ))
      )}
    </SectionCard>
  );
}

/* ═══════════════════════════════════════════
   ROOT
══════════════════════════════════════════════ */
export function SettingsManager({ initialSettings }: { initialSettings: Setting[] }) {
  const [active, setActive] = useState<SectionId>("general");

  return (
    <div className="min-h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Site Settings</h1>
        <p className="text-white/35 text-sm mt-1">Manage your website appearance, content, and integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap lg:w-full ${
                  active === id
                    ? "bg-[#FFD400]/10 border border-[#FFD400]/20 text-[#FFD400]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <Icon size={15} className="flex-shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="hidden lg:block mt-6 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <p className="text-[#FFD400] text-xs font-bold mb-2">Tip</p>
            <p className="text-white/30 text-xs leading-relaxed">
              Branding & social changes appear on the public site right after saving.
            </p>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {active === "branding" && <BrandingSection settings={initialSettings} />}
          {active === "social"   && <SocialSection settings={initialSettings} />}
          {active === "team"     && <TeamAccessSection settings={initialSettings} />}
          {(active === "general" || active === "contact" || active === "seo") && (
            <CategorySection category={active} settings={initialSettings} />
          )}
          {active === "other" && <OtherSection settings={initialSettings} />}
        </div>
      </div>
    </div>
  );
}
