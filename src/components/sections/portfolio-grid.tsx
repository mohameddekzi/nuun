"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectCategory } from "@/lib/types/database";

interface PortfolioGridProps {
  projects: (Project & { project_categories: { name: string; slug: string } | null })[];
  categories: ProjectCategory[];
}

export function PortfolioGrid({ projects, categories }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.project_categories?.slug === activeCategory);

  return (
    <section className="section-padding bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-14 lg:mb-16">
          {[{ name: "All Work", slug: "all" }, ...categories].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug ?? "all")}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
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
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`group relative overflow-hidden rounded-2xl card aspect-[4/3] cursor-pointer hover:border-[#FFD400]/30 card-lift ${
                  project.is_featured ? "sm:col-span-2" : ""
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400]/10 via-white/5 to-transparent" />
                <div className="absolute inset-0 grid-pattern opacity-30" />

                {/* Hover overlay */}
                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-end justify-between">
                    <div>
                      {project.project_categories && (
                        <p className="text-[#FFD400] text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-1.5">
                          {project.project_categories.name}
                        </p>
                      )}
                      <h3 className="text-white font-bold text-base sm:text-lg leading-snug">{project.title}</h3>
                      {project.client && <p className="text-white/50 text-xs sm:text-sm mt-1">{project.client}</p>}
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFD400] flex items-center justify-center flex-shrink-0 ml-3">
                      <ArrowUpRight size={14} className="text-[#0A0A0A]" />
                    </div>
                  </div>
                </div>

                {/* Static label */}
                <div className="absolute top-4 left-4 group-hover:opacity-0 transition-opacity">
                  <span className="text-white/40 text-[10px] sm:text-xs tracking-wider uppercase font-medium">
                    {project.project_categories?.name || "Project"}
                  </span>
                </div>

                {project.year && (
                  <div className="absolute top-4 right-4 text-white/20 text-xs group-hover:opacity-0 transition-opacity">
                    {project.year}
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                  <span className="text-white/[0.04] font-black text-3xl sm:text-5xl text-center px-4 leading-tight">
                    {project.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16 sm:py-24">
            <p className="text-white/30 text-base sm:text-lg">No projects found in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
