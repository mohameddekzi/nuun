"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative section-padding bg-[#0D0D0D] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] sm:w-[800px] sm:h-[400px] bg-[#FFD400]/[0.06] rounded-full blur-3xl" />
      </div>
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Decorations — hidden on small screens to avoid overflow */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="hidden sm:block absolute top-10 left-10 w-16 h-16 sm:w-24 sm:h-24 border border-[#FFD400]/10 rounded-2xl pointer-events-none"
      />
      <motion.div
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="hidden sm:block absolute bottom-10 right-10 w-12 h-12 sm:w-16 sm:h-16 border border-white/5 rounded-xl pointer-events-none"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="badge-accent mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400] animate-pulse" />
            Ready to Start?
          </span>

          <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-black text-white leading-tight mb-5 sm:mb-6 mt-5">
            Let&apos;s Build Something
            <br />
            <span className="text-[#FFD400]">Extraordinary</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
            Transform your vision into reality. Our team is ready to craft compelling brand experiences and digital solutions that drive measurable results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="xl" className="group gap-3 w-full sm:w-auto">
                Start a Project
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="mailto:info@nuun.so" className="w-full sm:w-auto">
              <Button variant="secondary" size="xl" className="gap-3 w-full sm:w-auto">
                <Mail size={16} />
                info@nuun.so
              </Button>
            </a>
          </div>

          <p className="text-white/30 text-xs sm:text-sm mt-8 sm:mt-10">
            Trusted by corporate institutions, NGOs, and growth-oriented businesses across East Africa
          </p>
        </motion.div>
      </div>
    </section>
  );
}
