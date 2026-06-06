"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
}

export function PageHero({ badge, title, highlight, description }: PageHeroProps) {
  return (
    <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] sm:w-[600px] sm:h-[400px] bg-[#FFD400]/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          {badge && <span className="badge-accent mb-5 sm:mb-6">{badge}</span>}
          <h1 className="text-[clamp(2.4rem,7vw,5.5rem)] font-black text-white leading-tight mt-5 mb-5 sm:mb-6">
            {title}
            {highlight && (
              <>
                <br />
                <span className="text-[#FFD400]">{highlight}</span>
              </>
            )}
          </h1>
          {description && (
            <p className="text-white/50 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
