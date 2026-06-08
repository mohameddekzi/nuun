import { createServerSupabaseClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services-section";
import { AboutSection } from "@/components/sections/about-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CTASection } from "@/components/sections/cta-section";
import { ClientsSection } from "@/components/sections/clients-section";
import type { ClientCompany } from "@/components/sections/clients-section";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: services }, { data: testimonials }, { data: clientsSetting }] = await Promise.all([
    supabase.from("services").select("*").eq("is_active", true).order("order_index"),
    supabase.from("testimonials").select("*").eq("is_active", true).order("order_index"),
    supabase.from("settings").select("value").eq("key", "clients").single(),
  ]);

  const clients: ClientCompany[] = Array.isArray(clientsSetting?.value)
    ? (clientsSetting.value as ClientCompany[]).filter((c) => c.logo_url || c.name)
    : [];

  return (
    <>
      <HeroSection />
      <ClientsSection clients={clients} />
      <ServicesSection services={services ?? []} />
      <AboutSection />
      <TestimonialsSection testimonials={testimonials ?? []} />
      <CTASection />
    </>
  );
}
