"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Palette, Video, Zap, Share2, Star } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/lib/types/database";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Palette, Video, Zap, Share2, Star,
};

interface ServicesSectionProps { services: Service[]; }

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="relative section-padding bg-[#0D0D0D] overflow-hidden">
      <div className="absolute inset-0 dot-pattern pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="relative section-inner">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20"
        >
          <span className="badge-accent mb-5 sm:mb-6">What We Do</span>
          <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-black text-white leading-tight mb-4 sm:mb-5 mt-5">
            Integrated Creative
            <br />
            <span className="text-[#FFD400]">Solutions</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Comprehensive media and creative services designed to meet the highest corporate standards — from brand identity to full digital campaigns.
          </p>
        </motion.div>

        {/* Grid — flex-wrap ensures last row is always centered */}
        <motion.div
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-wrap justify-center gap-5 sm:gap-6 lg:gap-7"
        >
          {services.map((service, i) => {
            const Icon = iconMap[service.icon || "Star"] || Star;
            return (
              <motion.div
                key={service.id}
                variants={item}
                className="group relative card card-lift p-6 sm:p-7 lg:p-8 overflow-hidden cursor-pointer w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-20px)]"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400]/0 group-hover:from-[#FFD400]/[0.04] to-transparent transition-all duration-500 rounded-[20px]" />

                {/* Number watermark */}
                <div className="absolute top-4 right-5 text-[3.5rem] font-black text-white/[0.03] select-none leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Icon */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center mb-5 group-hover:bg-[#FFD400] group-hover:scale-105 transition-all duration-300">
                  <Icon
                    size={20}
                    className="text-[#FFD400] group-hover:text-[#0A0A0A] transition-colors duration-300"
                  />
                </div>

                <h3 className="relative text-white font-bold text-base sm:text-lg mb-2.5 group-hover:text-[#FFD400] transition-colors">
                  {service.title}
                </h3>
                <p className="relative text-white/45 text-sm leading-relaxed mb-5 sm:mb-6">
                  {service.short_description}
                </p>

                <Link href={`/services#${service.slug || service.id}`} className="relative flex items-center gap-1.5 text-[#FFD400]/60 text-sm font-medium group-hover:text-[#FFD400] transition-colors w-fit">
                  Learn More
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10 sm:mt-14"
        >
          <Link href="/services">
            <button className="inline-flex items-center gap-2 text-[#FFD400] text-sm font-medium border border-[#FFD400]/25 hover:border-[#FFD400]/60 hover:bg-[#FFD400]/5 px-7 py-3 rounded-full transition-all duration-300">
              View All Services <ArrowRight size={14} />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
