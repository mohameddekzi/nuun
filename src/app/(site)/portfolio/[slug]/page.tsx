import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Briefcase, ArrowUpRight } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CTASection } from "@/components/sections/cta-section";
import type { Project } from "@/lib/types/database";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ProjectWithCat = Project & { project_categories: { name: string; slug: string | null } | null };

async function getProject(slug: string): Promise<ProjectWithCat | null> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("projects")
    .select("*, project_categories(name, slug)")
    .eq("is_active", true);

  query = UUID_RE.test(slug) ? query.eq("id", slug) : query.eq("slug", slug);

  const { data } = await query.maybeSingle();
  return (data as ProjectWithCat) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project Not Found" };

  const description = project.description || `${project.title} — a project by Nuun Media.`;
  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      images: project.cover_image ? [{ url: project.cover_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: project.cover_image ? [project.cover_image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const images = Array.isArray(project.images) ? (project.images as string[]).filter(Boolean) : [];
  const tags = Array.isArray(project.tags) ? (project.tags as string[]) : [];

  return (
    <>
      <article className="relative" style={{ background: "var(--bg)" }}>
        {/* Header */}
        <div className="section-inner pt-28 sm:pt-32 lg:pt-36 pb-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:text-[#FFD400]"
            style={{ color: "color-mix(in srgb, var(--fg) 50%, transparent)" }}
          >
            <ArrowLeft size={15} /> Back to Portfolio
          </Link>

          {project.project_categories && (
            <span className="badge-accent mb-5">{project.project_categories.name}</span>
          )}

          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-white leading-tight mt-5 mb-6 max-w-4xl">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: "color-mix(in srgb, var(--fg) 45%, transparent)" }}>
            {project.client && (
              <span className="flex items-center gap-1.5">
                <Briefcase size={13} /> {project.client}
              </span>
            )}
            {project.year && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {project.year}
              </span>
            )}
          </div>
        </div>

        {/* Cover */}
        <div className="section-inner mb-10 sm:mb-12">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/[0.06]" style={{ background: "var(--surface)" }}>
            {project.cover_image ? (
              <Image src={project.cover_image} alt={project.title} fill className="object-cover" unoptimized priority />
            ) : (
              <div className="absolute inset-0 grid-pattern opacity-30" />
            )}
          </div>
        </div>

        {/* Body */}
        <div className="section-inner pb-12">
          <div className="max-w-3xl mx-auto">
            {project.description && (
              <div className="space-y-5">
                {project.description.split(/\n{2,}/).filter((p) => p.trim()).map((p, i) => (
                  <p key={i} className="text-base leading-relaxed whitespace-pre-line" style={{ color: "color-mix(in srgb, var(--fg) 75%, transparent)" }}>
                    {p}
                  </p>
                ))}
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-8">
                {tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "color-mix(in srgb, var(--fg) 55%, transparent)" }}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        {images.length > 0 && (
          <div className="section-inner pb-16 sm:pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {images.map((src, i) => (
                <div key={i} className="relative aspect-video rounded-2xl overflow-hidden border border-white/[0.06]">
                  <Image src={src} alt={`${project.title} — image ${i + 1}`} fill className="object-cover" unoptimized />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next CTA */}
        <div className="section-inner pb-16 sm:pb-20">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#FFD400] hover:gap-3 transition-all"
          >
            View more projects <ArrowUpRight size={15} />
          </Link>
        </div>
      </article>

      <CTASection />
    </>
  );
}
