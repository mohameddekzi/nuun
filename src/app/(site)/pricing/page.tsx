import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PricingSection } from "@/components/sections/pricing-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent pricing for Nuun Media's creative and media services.",
};

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient();
  const { data: plans } = await supabase.from("pricing_plans").select("*").eq("is_active", true).order("order_index");

  return (
    <>
      <PageHero
        badge="Investment"
        title="Transparent"
        highlight="Pricing"
        description="Flexible packages designed to deliver maximum value for businesses of all sizes."
      />
      <PricingSection plans={plans ?? []} />
      <CTASection />
    </>
  );
}
