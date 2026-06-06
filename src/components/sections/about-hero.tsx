"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative pt-40 pb-24 bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FFD400]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Badge variant="accent" className="mb-6">Our Story</Badge>
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight">
            Built on <span className="text-[#FFD400]">Purpose</span>
            <br />Driven by <span className="text-[#FFD400]">Results</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">
            From a creative studio in Mogadishu to a next-generation media company serving clients across East Africa and beyond.
          </p>
          <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
            <MapPin size={14} />
            <span>KM5 Zoobe, Mogadishu, Somalia</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
