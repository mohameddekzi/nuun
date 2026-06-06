import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BlogGrid } from "@/components/sections/blog-grid";
import { CTASection } from "@/components/sections/cta-section";
import { PageHero } from "@/components/sections/page-hero";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, stories, and expertise from the Nuun Media team.",
};

export default async function BlogPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: posts }, { data: categories }] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("*, blog_categories(name, slug)")
      .eq("is_published", true)
      .order("published_at", { ascending: false }),
    supabase.from("blog_categories").select("*"),
  ]);

  return (
    <>
      <PageHero
        badge="Insights & Ideas"
        title="The Nuun"
        highlight="Journal"
        description="Thoughts on creativity, branding, technology, and the future of media."
      />
      <BlogGrid posts={posts ?? []} categories={categories ?? []} />
      <CTASection />
    </>
  );
}
