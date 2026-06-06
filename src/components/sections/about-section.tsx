"use client";

import { motion } from "framer-motion";
import { CheckCircle, Lightbulb, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const pillars = [
  { icon: Lightbulb, title: "Creative Excellence", desc: "Clean, modern, and purposeful design in every output" },
  { icon: Target, title: "Strategic Thinking", desc: "Business-driven communication solutions for real impact" },
  { icon: Zap, title: "Tech Advancement", desc: "Integration of digital, AI, and decentralized platforms" },
];

const values = [
  "Purposeful creativity — every design decision has intent",
  "Strategic execution — ideas brought to life with precision",
  "Consistent quality — maintaining high standards across all outputs",
  "Results-oriented delivery — measurable impact as the ultimate benchmark",
];

export function AboutSection() {
  return (
    <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFD400]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <Badge variant="accent" className="mb-6">About Nuun Media</Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Where Strategy Meets
              <br />
              <span className="text-[#FFD400]">Creative Vision</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-6">
              Nuun Media is a next-generation creative and media company headquartered in Mogadishu, Somalia, operating at the intersection of creativity, technology, and digital transformation.
            </p>
            <p className="text-white/50 text-base leading-relaxed mb-10">
              We deliver integrated media, branding, and digital communication solutions that transform ideas into measurable, real-world impact. With a strong emphasis on clarity, execution, and innovation, we enable organizations to build compelling brand identities.
            </p>

            {/* Values */}
            <div className="space-y-3">
              {values.map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={16} className="text-[#FFD400] mt-0.5 flex-shrink-0" />
                  <span className="text-white/60 text-sm">{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-6"
          >
            {/* Pillars */}
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group flex gap-5 p-6 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:bg-white/[0.06] hover:border-[#FFD400]/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFD400] transition-all duration-300">
                  <pillar.icon size={20} className="text-[#FFD400] group-hover:text-[#0A0A0A] transition-colors" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1.5">{pillar.title}</h3>
                  <p className="text-white/50 text-sm">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* 4D Model */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-6 bg-[#FFD400]/5 border border-[#FFD400]/20 rounded-2xl"
            >
              <p className="text-[#FFD400] text-xs font-bold tracking-widest uppercase mb-4">The 4D Execution Model</p>
              <div className="grid grid-cols-4 gap-3">
                {["Discover", "Define", "Design", "Develop"].map((step, i) => (
                  <div key={step} className="text-center">
                    <div className="text-[#FFD400] font-black text-lg mb-1">0{i + 1}</div>
                    <div className="text-white/60 text-xs">{step}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
