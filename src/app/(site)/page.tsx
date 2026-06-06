import { createServerSupabaseClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services-section";
import { AboutSection } from "@/components/sections/about-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CTASection } from "@/components/sections/cta-section";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: services }, { data: testimonials }] = await Promise.all([
    supabase.from("services").select("*").eq("is_active", true).order("order_index"),
    supabase.from("testimonials").select("*").eq("is_active", true).order("order_index"),
  ]);

  return (
    <>
      <HeroSection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <ServicesSection services={services ?? []} />
      <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <AboutSection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <TestimonialsSection testimonials={testimonials ?? []} />
      <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <CTASection />
    </>
  );
}
