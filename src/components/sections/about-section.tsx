"use client";

import { motion, type Variants } from "framer-motion";
import { CheckCircle, Lightbulb, Target, Zap } from "lucide-react";

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

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function AboutSection() {
  return (
    <section className="relative section-padding bg-[#0A0A0A] overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-[#FFD400]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-28 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="badge-accent mb-5 sm:mb-6">About Nuun Media</span>
            <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-black text-white leading-tight mb-5 sm:mb-6 mt-5">
              Where Strategy Meets
              <br />
              <span className="text-[#FFD400]">Creative Vision</span>
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">
              Nuun Media is a next-generation creative and media company headquartered in Mogadishu, Somalia, operating at the intersection of creativity, technology, and digital transformation.
            </p>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10">
              We deliver integrated media, branding, and digital communication solutions that transform ideas into measurable, real-world impact. With a strong emphasis on clarity, execution, and innovation, we enable organizations to build compelling brand identities.
            </p>

            <motion.div variants={list} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-3">
              {values.map((value, i) => (
                <motion.div key={i} variants={item} className="flex items-start gap-3">
                  <CheckCircle size={15} className="text-[#FFD400] mt-0.5 flex-shrink-0" />
                  <span className="text-white/60 text-sm leading-relaxed">{value}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-4 sm:space-y-5"
          >
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group flex gap-4 sm:gap-5 p-5 sm:p-6 card hover:border-[#FFD400]/20 transition-all duration-300"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFD400] transition-all duration-300">
                  <pillar.icon size={18} className="text-[#FFD400] group-hover:text-[#0A0A0A] transition-colors" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base mb-1.5">{pillar.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* 4D Model */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-5 sm:p-6 bg-[#FFD400]/5 border border-[#FFD400]/20 rounded-2xl"
            >
              <p className="text-[#FFD400] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4">
                The 4D Execution Model
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {["Discover", "Define", "Design", "Develop"].map((step, i) => (
                  <div key={step} className="text-center">
                    <div className="text-[#FFD400] font-black text-base sm:text-lg mb-1">0{i + 1}</div>
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
