"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { BlogPost, BlogCategory } from "@/lib/types/database";

interface BlogGridProps {
  posts: (BlogPost & { blog_categories: { name: string; slug: string } | null })[];
  categories: BlogCategory[];
}

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export function BlogGrid({ posts, categories }: BlogGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? posts
    : posts.filter((p) => p.blog_categories?.slug === activeCategory);

  if (!posts.length) {
    return (
      <section className="section-padding bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-white/40 text-base sm:text-lg">No posts published yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12">
          {[{ name: "All", slug: "all" }, ...categories].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug ?? "all")}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.slug
                  ? "bg-[#FFD400] text-[#0A0A0A]"
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {filtered.map((post) => (
            <motion.article
              key={post.id}
              variants={item}
              className="group card card-lift overflow-hidden"
            >
              <Link href={`/blog/${post.slug || post.id}`} className="block">
              {/* Cover */}
              <div className="aspect-video bg-gradient-to-br from-[#FFD400]/10 via-white/5 to-transparent relative overflow-hidden">
                {post.cover_image ? (
                  <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                ) : (
                  <div className="absolute inset-0 dot-pattern opacity-20" />
                )}
                {post.is_featured && (
                  <div className="absolute top-3 left-3">
                    <span className="badge-accent text-[10px] px-2.5 py-1">Featured</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                {post.blog_categories && (
                  <span className="text-[#FFD400]/70 text-[10px] font-semibold tracking-widest uppercase mb-3 block">
                    {post.blog_categories.name}
                  </span>
                )}
                <h3 className="text-white font-bold text-base sm:text-lg mb-2.5 sm:mb-3 group-hover:text-[#FFD400] transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/30 text-xs">
                    {post.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.read_time} min
                    </span>
                  </div>
                  <ArrowRight size={13} className="text-white/30 group-hover:text-[#FFD400] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
