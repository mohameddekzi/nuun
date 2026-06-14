"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  Palette, Settings2, Phone, Search, Share2,
  CheckCircle2, Moon, Sun, Ruler, Globe,
  Image as ImgIcon, MapPin, Mail, PhoneCall, AlignLeft,
  FileText, Tag, Link as LinkIcon, Save, AtSign,
} from "lucide-react";
import type { Setting } from "@/lib/types/database";

/* ─── helpers ─────────────────────────────── */
function str(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null) return JSON.stringify(v, null, 2);
  return String(v ?? "");
}

const supabase = createClient();

async function upsertSetting(key: string, value: unknown, category: string) {
  const { data: existing } = await supabase
    .from("settings")
    .select("id")
    .eq("key", key)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("settings")
      .update({ value: value as never })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("settings")
      .insert({ key, value: value as never, category });
  }
}

/* ─── sidebar sections ─────────────────────── */
const SECTIONS = [
  { id: "appearance", label: "Appearance", icon: Palette, desc: "Theme, logo & visual identity" },
  { id: "general",    label: "General",    icon: Settings2, desc: "Site name, tagline & description" },
  { id: "contact",    label: "Contact",    icon: Phone,     desc: "Phone, email & address" },
  { id: "seo",        label: "SEO",        icon: Search,    desc: "Meta titles, descriptions & OG" },
  { id: "social",     label: "Social",     icon: Share2,    desc: "Social media profile links" },
  { id: "other",      label: "Other",      icon: Settings2, desc: "Remaining site settings" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/* ─── small saved badge ────────────────────── */
function SavedBadge({ visible }: { visible: boolean }) {
  return visible ? (
    <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
      <CheckCircle2 size={12} /> Saved
    </span>
  ) : null;
}

/* ─── generic text field row ───────────────── */
function FieldRow({
  label, icon: Icon, hint, value, multiline = false,
  onSave,
}: {
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  hint?: string;
  value: string;
  multiline?: boolean;
  onSave: (val: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(value);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setLoading(true);
    await onSave(draft);
    setLoading(false);
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
      {multiline ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FFD400]/40 transition-colors resize-none"
        />
      ) : (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className="w-full h-10 px-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FFD400]/40 transition-colors"
        />
      )}
      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={loading || draft === value}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FFD400] text-[#0A0A0A] text-xs font-bold disabled:opacity-40 hover:bg-[#FFD400]/90 transition-all"
        >
          <Save size={11} />
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

/* ─── section card wrapper ──────────────────── */
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

/* ═══════════════════════════════════════════
   APPEARANCE SECTION
══════════════════════════════════════════════ */
function AppearanceSection({ settings }: { settings: Setting[] }) {
  const themeSetting = settings.find((s) => s.key === "theme_default");
  const logoSetting  = settings.find((s) => s.key === "logo_url");
  const heightSetting = settings.find((s) => s.key === "logo_height");

  const [theme, setTheme]       = useState(str(themeSetting?.value) || "dark");
  const [logo, setLogo]         = useState<string | null>(str(logoSetting?.value) || null);
  const [height, setHeight]     = useState(str(heightSetting?.value) || "32");
  const [themeSaved, setThemeSaved] = useState(false);
  const [heightSaved, setHeightSaved] = useState(false);
  const [logoSaved, setLogoSaved]   = useState(false);
  const [heightLoading, setHeightLoading] = useState(false);

  const saveTheme = async (v: string) => {
    setTheme(v);
    await upsertSetting("theme_default", v, "appearance");
    setThemeSaved(true);
    setTimeout(() => setThemeSaved(false), 2500);
  };

  const saveLogo = async (url: string | null) => {
    setLogo(url);
    await upsertSetting("logo_url", url ?? "", "appearance");
    setLogoSaved(true);
    setTimeout(() => setLogoSaved(false), 2500);
  };

  const saveHeight = async () => {
    setHeightLoading(true);
    await upsertSetting("logo_height", height, "appearance");
    setHeightLoading(false);
    setHeightSaved(true);
    setTimeout(() => setHeightSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Theme */}
      <SectionCard title="Website Theme" desc="Sets the default theme shown to all public visitors.">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/50 text-xs">Active theme</span>
            <SavedBadge visible={themeSaved} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                onClick={() => saveTheme(t)}
                className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                  theme === t
                    ? "border-[#FFD400] bg-[#FFD400]/[0.06]"
                    : "border-white/[0.08] hover:border-white/20"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  t === "dark" ? "bg-[#0A0A0A] border border-white/20" : "bg-white border border-black/10"
                }`}>
                  {t === "dark" ? <Moon size={18} className="text-[#FFD400]" /> : <Sun size={18} className="text-[#C49A00]" />}
                </div>
                <div className="text-center">
                  <p className={`text-sm font-semibold ${theme === t ? "text-[#FFD400]" : "text-white/60"}`}>
                    {t === "dark" ? "Dark Mode" : "Light Mode"}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">
                    {t === "dark" ? "Dark background" : "Light background"}
                  </p>
                </div>
                {theme === t && (
                  <span className="w-5 h-5 rounded-full bg-[#FFD400] flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-black" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Logo */}
      <SectionCard title="Site Logo" desc="Used in the site header and footer. PNG or SVG with transparent background recommended.">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-white/50 text-xs">
              <ImgIcon size={11} className="text-[#FFD400]" /> Header &amp; Footer Logo
            </span>
            <SavedBadge visible={logoSaved} />
          </div>
          <ImageUpload
            value={logo}
            onChange={saveLogo}
            folder="logos"
            label="Upload Logo"
            hint="PNG, SVG, WebP · transparent background"
            aspectRatio="aspect-[5/2]"
          />
          {logo && (
            <div className="rounded-xl overflow-hidden border border-white/[0.06]">
              <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
                <p className="text-white/30 text-[10px] uppercase tracking-wider">Preview — Header</p>
              </div>
              <div
                className="flex items-center gap-3 px-5 py-3 bg-[#0A0A0A]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt="Logo preview" style={{ height: parseInt(height) || 32 }} className="object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Height slider */}
        <div className="space-y-3 pt-2 border-t border-white/[0.05]">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-white/70 text-xs font-semibold uppercase tracking-wider">
              <Ruler size={11} className="text-[#FFD400]" /> Logo Height
            </label>
            <SavedBadge visible={heightSaved} />
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range" min="20" max="80" step="2"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="flex-1 accent-[#FFD400]"
            />
            <span className="text-[#FFD400] font-bold text-sm w-12 text-center">{height}px</span>
          </div>
          <div className="flex justify-end">
            <button
              onClick={saveHeight}
              disabled={heightLoading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FFD400] text-[#0A0A0A] text-xs font-bold disabled:opacity-40 hover:bg-[#FFD400]/90 transition-all"
            >
              <Save size={11} />
              {heightLoading ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GENERIC CATEGORY SECTION
══════════════════════════════════════════════ */

const fieldMeta: Record<string, { icon?: React.ComponentType<{ size?: number; className?: string }>; hint?: string; multiline?: boolean; label?: string }> = {
  site_name:        { icon: Globe,    label: "Site Name",        hint: "Displayed in the browser tab and header" },
  site_tagline:     { icon: Tag,      label: "Tagline",          hint: "Short slogan shown under the logo" },
  site_description: { icon: AlignLeft, label: "Description",    hint: "Used in meta tags and intro sections", multiline: true },
  site_language:    { icon: Globe,    label: "Language",         hint: "e.g. en, so, ar" },
  contact_phone:    { icon: PhoneCall, label: "Phone",           hint: "Main contact phone number" },
  contact_email:    { icon: Mail,     label: "Email",            hint: "Main contact email address" },
  contact_address:  { icon: MapPin,   label: "Address",          hint: "Physical address displayed on the site" },
  contact_hours:    { icon: PhoneCall, label: "Business Hours",  hint: "e.g. Mon–Fri 9am–6pm", multiline: true },
  seo_title:        { icon: Search,   label: "Default SEO Title", hint: "Fallback page title for search engines" },
  seo_description:  { icon: FileText, label: "Meta Description", hint: "150–160 chars shown in Google results", multiline: true },
  social_instagram: { icon: AtSign, label: "Instagram URL" },
  social_twitter:   { icon: AtSign, label: "Twitter / X URL" },
  social_facebook:  { icon: AtSign, label: "Facebook URL" },
  social_linkedin:  { icon: AtSign, label: "LinkedIn URL" },
  social_youtube:   { icon: AtSign, label: "YouTube URL" },
};

function CategorySection({ category, settings, specialKeys }: {
  category: string;
  settings: Setting[];
  specialKeys: Set<string>;
}) {
  const rows = settings.filter((s) => s.category === category && !specialKeys.has(s.key));

  if (!rows.length) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-10 text-center">
        <p className="text-white/25 text-sm">No settings in this section yet.</p>
      </div>
    );
  }

  /* group into logical cards */
  return (
    <div className="space-y-5">
      <SectionCard
        title={category.charAt(0).toUpperCase() + category.slice(1) + " Settings"}
        desc={SECTIONS.find((s) => s.id === category)?.desc}
      >
        {rows.map((setting) => {
          const meta = fieldMeta[setting.key] ?? {};
          return (
            <FieldRow
              key={setting.id}
              label={meta.label ?? setting.key.replace(/_/g, " ")}
              icon={meta.icon}
              hint={meta.hint}
              value={str(setting.value)}
              multiline={meta.multiline}
              onSave={async (val) => {
                await supabase
                  .from("settings")
                  .update({ value: val as never })
                  .eq("id", setting.id);
              }}
            />
          );
        })}
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   OTHER SECTION (catch-all)
══════════════════════════════════════════════ */
const knownCategories = new Set(["appearance", "general", "contact", "seo", "social"]);
const specialKeys = new Set(["theme_default", "logo_url", "logo_height", "clients"]);

function OtherSection({ settings }: { settings: Setting[] }) {
  const rows = settings.filter(
    (s) => (!knownCategories.has(s.category ?? "") || !s.category) && !specialKeys.has(s.key)
  );

  if (!rows.length) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-10 text-center">
        <p className="text-white/25 text-sm">No additional settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Other Settings">
        {rows.map((setting) => (
          <FieldRow
            key={setting.id}
            label={setting.key.replace(/_/g, " ")}
            icon={LinkIcon}
            value={str(setting.value)}
            onSave={async (val) => {
              await supabase.from("settings").update({ value: val as never }).eq("id", setting.id);
            }}
          />
        ))}
      </SectionCard>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════ */
export function SettingsManager({ initialSettings }: { initialSettings: Setting[] }) {
  const [active, setActive] = useState<SectionId>("appearance");

  return (
    <div className="min-h-full">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Site Settings</h1>
        <p className="text-white/35 text-sm mt-1">Manage your website appearance, content, and integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Sidebar ─────────────────── */}
        <aside className="lg:w-56 flex-shrink-0">
          {/* Mobile: horizontal scroll */}
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

          {/* Quick info card — desktop only */}
          <div className="hidden lg:block mt-6 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
            <p className="text-[#FFD400] text-xs font-bold mb-2">Tip</p>
            <p className="text-white/30 text-xs leading-relaxed">
              Changes to Appearance settings affect the public website immediately after saving.
            </p>
          </div>
        </aside>

        {/* ── Content ─────────────────── */}
        <div className="flex-1 min-w-0">
          {active === "appearance" && (
            <AppearanceSection settings={initialSettings} />
          )}
          {(active === "general" || active === "contact" || active === "seo" || active === "social") && (
            <CategorySection
              category={active}
              settings={initialSettings}
              specialKeys={specialKeys}
            />
          )}
          {active === "other" && (
            <OtherSection settings={initialSettings} />
          )}
        </div>
      </div>
    </div>
  );
}
