"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const words = ["Creativity", "Innovation", "Excellence", "Transformation", "Technology"];

const stats = [
  { value: "150+", label: "Projects Delivered" },
  { value: "50+",  label: "Happy Clients" },
  { value: "8+",   label: "Years Active" },
  { value: "99%",  label: "Satisfaction" },
];

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });
  const rotateX = useTransform(smoothY, [-400, 400], [4, -4]);
  const rotateY = useTransform(smoothX, [-400, 400], [-4, 4]);

  useEffect(() => {
    const id = setInterval(() => setWordIndex(i => (i + 1) % words.length), 2800);
    return () => clearInterval(id);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={onMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] pt-16 md:pt-20"
    >
      {/* Layers */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute inset-0 glow-center pointer-events-none" />

      {/* Orbiting ring */}
      <motion.div
        style={{ rotateX, rotateY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[900px] lg:h-[900px] rounded-full border border-white/[0.04]"
        />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute w-[300px] h-[300px] sm:w-[480px] sm:h-[480px] lg:w-[620px] lg:h-[620px] rounded-full border border-[#FFD400]/[0.05] pointer-events-none"
      />

      {/* Floating dots */}
      {[
        { x: "12%", y: "22%", d: 0 },
        { x: "85%", y: "18%", d: 0.6 },
        { x: "75%", y: "72%", d: 1.2 },
        { x: "18%", y: "68%", d: 1.8 },
        { x: "50%", y: "15%", d: 2.4 },
        { x: "55%", y: "80%", d: 3.0 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#FFD400]"
          style={{ left: p.x, top: p.y }}
          animate={{ opacity: [0.15, 0.55, 0.15], y: [0, -18, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: p.d }}
        />
      ))}

      {/* ── CONTENT ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">

        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6 sm:mb-8"
        >
          <span className="badge-accent">
            <Zap size={10} className="fill-[#FFD400]" />
            Next-Generation Creative Agency · Mogadishu
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(2.4rem,8vw,7rem)] font-black tracking-tight leading-[0.88] text-white mb-5 sm:mb-6"
        >
          FROM VISION
          <br />
          <span className="text-[#FFD400]">TO REALITY</span>
        </motion.h1>

        {/* Animated sub-line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-center justify-center gap-2 mb-5 sm:mb-6 h-8 sm:h-10"
        >
          <span className="text-white/45 text-base sm:text-xl font-light">Where</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.45 }}
              className="text-white text-base sm:text-xl font-semibold"
            >
              {words[wordIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="text-white/45 text-base sm:text-xl font-light">Meets Purpose</span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-white/50 text-sm sm:text-base lg:text-lg max-w-xl sm:max-w-2xl mx-auto leading-relaxed mb-9 sm:mb-12 px-2"
        >
          A next-generation creative and media company transforming ideas into measurable, real-world impact through purposeful creativity and strategic execution.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16 sm:mb-20"
        >
          <Link href="/contact" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto group gap-2.5">
              Start Your Project
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/portfolio" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-3">
              <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <Play size={10} className="ml-0.5" />
              </span>
              View Our Work
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-2xl md:max-w-3xl mx-auto"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.08 }}
              className="flex flex-col items-center"
            >
              <div className="text-[clamp(1.75rem,5vw,2.75rem)] font-black text-[#FFD400] leading-none mb-1">
                {s.value}
              </div>
              <div className="text-white/40 text-[10px] sm:text-xs tracking-wider uppercase text-center">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/25 text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-[#FFD400]/60 to-transparent origin-top"
        />
      </motion.div>
    </section>
  );
}
