"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Yellow glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] bg-[#FFD400]/8 rounded-full blur-3xl" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Geometric decorations */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 w-24 h-24 border border-[#FFD400]/10 rounded-2xl"
      />
      <motion.div
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 right-10 w-16 h-16 border border-white/5 rounded-xl"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD400]/10 border border-[#FFD400]/20 text-[#FFD400] text-xs font-medium tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400] animate-pulse" />
            Ready to Start?
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Let&apos;s Build Something
            <br />
            <span className="text-[#FFD400]">Extraordinary</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-12">
            Transform your vision into reality. Our team is ready to craft compelling brand experiences and digital solutions that drive measurable results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="xl" className="group gap-3 w-full sm:w-auto">
                Start a Project
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="mailto:info@nuun.so">
              <Button variant="secondary" size="xl" className="gap-3 w-full sm:w-auto">
                <Mail size={18} />
                info@nuun.so
              </Button>
            </a>
          </div>

          {/* Trust indicators */}
          <p className="text-white/30 text-sm mt-8">
            Trusted by corporate institutions, NGOs, and growth-oriented businesses across East Africa
          </p>
        </motion.div>
      </div>
    </section>
  );
}
