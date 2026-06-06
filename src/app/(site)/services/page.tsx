import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ServicesSection } from "@/components/sections/services-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore Nuun Media's comprehensive creative and media services — from brand identity to video production and digital campaigns.",
};

export default async function ServicesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: services } = await supabase.from("services").select("*").eq("is_active", true).order("order_index");

  return (
    <>
      <PageHero
        badge="What We Do"
        title="Creative Services"
        highlight="Built for Impact"
        description="Integrated solutions across five key service areas, each designed to meet the highest corporate standards."
      />
      <ServicesSection services={services ?? []} />
      <CTASection />
    </>
  );
}
