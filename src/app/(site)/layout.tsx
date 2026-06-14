import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const BRANDING_KEYS = [
  "logo_url", "header_logo_light", "logo_height",
  "footer_logo_url", "footer_logo_light", "footer_logo_height",
];

const SOCIAL_KEYS = [
  "social_instagram", "social_twitter", "social_facebook",
  "social_linkedin", "social_youtube", "social_tiktok",
];

async function getLayoutSettings() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", [...BRANDING_KEYS, ...SOCIAL_KEYS]);

    const map: Record<string, string> = {};
    for (const row of data ?? []) {
      if (typeof row.value === "string") map[row.key] = row.value;
      else if (typeof row.value === "number") map[row.key] = String(row.value);
    }

    const str = (k: string) => (map[k] && map[k].trim() ? map[k] : null);

    return {
      branding: {
        headerLogo: str("logo_url"),
        headerLogoLight: str("header_logo_light"),
        headerLogoHeight: map["logo_height"] ? parseInt(map["logo_height"]) : 32,
        footerLogo: str("footer_logo_url"),
        footerLogoLight: str("footer_logo_light"),
        footerLogoHeight: map["footer_logo_height"] ? parseInt(map["footer_logo_height"]) : 36,
      },
      socials: {
        instagram: str("social_instagram"),
        twitter: str("social_twitter"),
        facebook: str("social_facebook"),
        linkedin: str("social_linkedin"),
        youtube: str("social_youtube"),
        tiktok: str("social_tiktok"),
      },
    };
  } catch {
    return {
      branding: {
        headerLogo: null, headerLogoLight: null, headerLogoHeight: 32,
        footerLogo: null, footerLogoLight: null, footerLogoHeight: 36,
      },
      socials: { instagram: null, twitter: null, facebook: null, linkedin: null, youtube: null, tiktok: null },
    };
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { branding, socials } = await getLayoutSettings();

  return (
    <>
      <Header
        logoUrl={branding.headerLogo}
        logoUrlLight={branding.headerLogoLight}
        logoHeight={branding.headerLogoHeight}
      />
      <main className="flex flex-col min-h-screen animate-page-enter">{children}</main>
      <Footer
        logoUrl={branding.footerLogo}
        logoUrlLight={branding.footerLogoLight}
        logoHeight={branding.footerLogoHeight}
        socials={socials}
      />
    </>
  );
}
