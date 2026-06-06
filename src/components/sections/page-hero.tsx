"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface PageHeroProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
}

export function PageHero({ badge, title, highlight, description }: PageHeroProps) {
  return (
    <section className="relative pt-40 pb-24 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FFD400]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {badge && <Badge variant="accent" className="mb-6">{badge}</Badge>}
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight">
            {title}
            {highlight && (
              <>
                <br />
                <span className="text-[#FFD400]">{highlight}</span>
              </>
            )}
          </h1>
          {description && (
            <p className="text-white/50 text-lg max-w-2xl mx-auto">{description}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
