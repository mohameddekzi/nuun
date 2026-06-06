import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PortfolioGrid } from "@/components/sections/portfolio-grid";
import { CTASection } from "@/components/sections/cta-section";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore Nuun Media's portfolio of creative projects — branding, video production, digital campaigns, and more.",
};

export default async function PortfolioPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: projects }, { data: categories }] = await Promise.all([
    supabase.from("projects").select("*, project_categories(name, slug)").eq("is_active", true).order("order_index"),
    supabase.from("project_categories").select("*"),
  ]);

  return (
    <>
      <PageHero
        badge="Our Work"
        title="Creative Projects"
        highlight="That Drive Impact"
        description="A curated selection of our best work across branding, media production, and digital campaigns."
      />
      <PortfolioGrid projects={projects ?? []} categories={categories ?? []} />
      <CTASection />
    </>
  );
}
