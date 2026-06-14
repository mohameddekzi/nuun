import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/about-section";
import { TeamSection } from "@/components/sections/team-section";
import { CTASection } from "@/components/sections/cta-section";
import { AboutHero } from "@/components/sections/about-hero";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Nuun Media — our mission, vision, and the team behind East Africa's leading creative and media company.",
};

export default async function AboutPage() {
  const supabase = await createServerSupabaseClient();
  const { data: team } = await supabase.from("team_members").select("*").eq("is_active", true).order("order_index");

  return (
    <>
      <AboutHero />
      <AboutSection />
      <TeamSection team={team ?? []} />
      <CTASection />
    </>
  );
}
