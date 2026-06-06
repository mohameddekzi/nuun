"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { BlogPost, BlogCategory } from "@/lib/types/database";
import { Badge } from "@/components/ui/badge";

interface BlogGridProps {
  posts: (BlogPost & { blog_categories: { name: string; slug: string } | null })[];
  categories: BlogCategory[];
}

export function BlogGrid({ posts, categories }: BlogGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? posts
    : posts.filter((p) => p.blog_categories?.slug === activeCategory);

  if (!posts.length) {
    return (
      <section className="py-20 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-white/40 text-lg">No posts published yet. Check back soon!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {[{ name: "All", slug: "all" }, ...categories].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug ?? "all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Cover */}
              <div className="aspect-video bg-gradient-to-br from-[#FFD400]/10 via-white/5 to-transparent relative overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-20" />
                {post.is_featured && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="accent">Featured</Badge>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                {post.blog_categories && (
                  <Badge variant="ghost" className="mb-3">{post.blog_categories.name}</Badge>
                )}
                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-[#FFD400] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white/30 text-xs">
                    {post.published_at && (
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.read_time} min read
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-white/30 group-hover:text-[#FFD400] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
