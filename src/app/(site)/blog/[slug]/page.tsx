import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { format } from "date-fns";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CTASection } from "@/components/sections/cta-section";
import type { BlogPost } from "@/lib/types/database";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type PostWithCat = BlogPost & { blog_categories: { name: string; slug: string | null } | null };

async function getPost(slug: string): Promise<PostWithCat | null> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("blog_posts")
    .select("*, blog_categories(name, slug)")
    .eq("is_published", true);

  query = UUID_RE.test(slug) ? query.eq("id", slug) : query.eq("slug", slug);

  const { data } = await query.maybeSingle();
  return (data as PostWithCat) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
      publishedTime: post.published_at ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  /* fire-and-forget view count */
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.from("blog_posts").update({ view_count: (post.view_count ?? 0) + 1 }).eq("id", post.id);
  } catch {}

  const tags = Array.isArray(post.tags) ? (post.tags as string[]) : [];
  const paragraphs = (post.content ?? "").split(/\n{2,}/).filter((p) => p.trim());

  return (
    <>
      <article className="relative" style={{ background: "var(--bg)" }}>
        {/* Header */}
        <div className="section-inner pt-28 sm:pt-32 lg:pt-36 pb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-[#FFD400]"
            style={{ color: "color-mix(in srgb, var(--fg) 50%, transparent)" }}
          >
            <ArrowLeft size={15} /> Back to Blog
          </Link>

          {post.blog_categories && (
            <span className="badge-accent mb-5">{post.blog_categories.name}</span>
          )}

          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-white leading-tight mt-5 mb-6 max-w-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-sm" style={{ color: "color-mix(in srgb, var(--fg) 45%, transparent)" }}>
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {format(new Date(post.published_at), "MMMM d, yyyy")}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock size={13} /> {post.read_time} min read
            </span>
          </div>
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <div className="section-inner mb-10 sm:mb-12">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/[0.06]">
              <Image src={post.cover_image} alt={post.title} fill className="object-cover" unoptimized priority />
            </div>
          </div>
        )}

        {/* Body */}
        <div className="section-inner pb-16 sm:pb-20">
          <div className="max-w-3xl mx-auto">
            {post.excerpt && (
              <p className="text-lg sm:text-xl leading-relaxed mb-8 font-light" style={{ color: "color-mix(in srgb, var(--fg) 70%, transparent)" }}>
                {post.excerpt}
              </p>
            )}

            <div className="space-y-5">
              {paragraphs.length ? (
                paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed whitespace-pre-line"
                    style={{ color: "color-mix(in srgb, var(--fg) 75%, transparent)" }}
                  >
                    {p}
                  </p>
                ))
              ) : (
                <p style={{ color: "color-mix(in srgb, var(--fg) 40%, transparent)" }}>No content yet.</p>
              )}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-10 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
                <Tag size={14} className="text-[#FFD400]" />
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "color-mix(in srgb, var(--fg) 55%, transparent)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      <CTASection />
    </>
  );
}
