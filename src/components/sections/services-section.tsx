"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Palette, Video, Zap, Share2, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@/lib/types/database";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Palette, Video, Zap, Share2, Star,
};

interface ServicesSectionProps {
  services: Service[];
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <Badge variant="accent" className="mb-6">Our Services</Badge>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Integrated Creative
            <br />
            <span className="text-[#FFD400]">Solutions</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            We deliver comprehensive media and creative services designed to meet the highest corporate standards.
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, i) => {
            const Icon = iconMap[service.icon || "Star"] || Star;
            const isLarge = i === 0;
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className={`group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 overflow-hidden cursor-pointer hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] ${isLarge ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD400]/0 to-[#FFD400]/0 group-hover:from-[#FFD400]/5 group-hover:to-transparent transition-all duration-500 rounded-2xl" />

                {/* Icon */}
                <div className="relative w-14 h-14 rounded-2xl bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center mb-6 group-hover:bg-[#FFD400] group-hover:scale-110 transition-all duration-300">
                  <Icon size={22} className="text-[#FFD400] group-hover:text-[#0A0A0A] transition-colors duration-300" />
                </div>

                {/* Content */}
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-[#FFD400] transition-colors">
                  {service.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">
                  {service.short_description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-[#FFD400]/70 text-sm font-medium group-hover:text-[#FFD400] transition-colors">
                  Learn More
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Number */}
                <div className="absolute top-6 right-6 text-5xl font-black text-white/[0.04] select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16"
        >
          <Link href="/services">
            <button className="inline-flex items-center gap-2 text-[#FFD400] hover:text-white text-sm font-medium border border-[#FFD400]/30 hover:border-white/30 px-6 py-3 rounded-full transition-all duration-300 hover:bg-white/5">
              View All Services <ArrowRight size={14} />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
