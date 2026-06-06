import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Nuun Media's services, process, and more.",
};

export default async function FAQPage() {
  const supabase = await createServerSupabaseClient();
  const { data: faqs } = await supabase.from("faq").select("*").eq("is_active", true).order("order_index");

  return (
    <>
      <PageHero
        badge="Questions & Answers"
        title="Frequently Asked"
        highlight="Questions"
        description="Everything you need to know about working with Nuun Media."
      />
      <FAQSection faqs={faqs ?? []} />
      <CTASection />
    </>
  );
}
