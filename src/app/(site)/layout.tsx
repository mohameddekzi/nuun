import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getBrandingSettings() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["logo_url", "logo_height"]);
    const map: Record<string, string | null> = {};
    for (const row of data ?? []) {
      map[row.key] = typeof row.value === "string" ? row.value : typeof row.value === "number" ? String(row.value) : null;
    }
    return {
      logoUrl: map["logo_url"] ?? null,
      logoHeight: map["logo_height"] ? parseInt(map["logo_height"]) : 32,
    };
  } catch {
    return { logoUrl: null, logoHeight: 32 };
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { logoUrl, logoHeight } = await getBrandingSettings();

  return (
    <>
      <Header logoUrl={logoUrl} logoHeight={logoHeight} />
      <main className="flex flex-col min-h-screen animate-page-enter">{children}</main>
      <Footer logoUrl={logoUrl} logoHeight={logoHeight} />
    </>
  );
}
