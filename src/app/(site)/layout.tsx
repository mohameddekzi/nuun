import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getLogoUrl(): Promise<string | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "logo_url")
      .single();
    if (data?.value && typeof data.value === "string") return data.value;
    return null;
  } catch {
    return null;
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const logoUrl = await getLogoUrl();

  return (
    <>
      <Header logoUrl={logoUrl} />
      <main className="flex flex-col min-h-screen animate-page-enter">{children}</main>
      <Footer logoUrl={logoUrl} />
    </>
  );
}
