"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  useInView,
  animate,
} from "framer-motion";
import { ArrowRight, Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NUUN_LOGO_PATH } from "@/components/ui/nuun-logo";

const words = ["Creativity", "Innovation", "Excellence", "Transformation", "Technology"];

const stats = [
  { value: 150, suffix: "+", label: "Projects Delivered" },
  { value: 50,  suffix: "+", label: "Happy Clients" },
  { value: 8,   suffix: "+", label: "Years Active" },
  { value: 99,  suffix: "%", label: "Satisfaction" },
];

const marqueeItems = [
  "Brand Identity",
  "Video Production",
  "Motion Design",
  "Social Media",
  "Event Branding",
  "Digital Campaigns",
  "Corporate Media",
  "UI & UX Design",
];

function StatCounter({
  value,
  suffix,
  label,
  delay = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, value, { duration: 2, delay, ease: "easeOut" });
    return controls.stop;
  }, [isInView, count, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay + 0.2 }}
      className="flex flex-col items-center"
    >
      <div className="text-[clamp(1.75rem,5vw,2.75rem)] font-black text-[#FFD400] leading-none mb-1">
        <motion.span>{rounded}</motion.span>{suffix}
      </div>
      <div className="text-white/40 text-[10px] sm:text-xs tracking-wider uppercase text-center leading-tight">
        {label}
      </div>
    </motion.div>
  );
}

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
    const id = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 2800);
    return () => clearInterval(id);
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const doubled = [...marqueeItems, ...marqueeItems];

  return (
    <section
      ref={containerRef}
      onMouseMove={onMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] pt-16 md:pt-20"
    >
      {/* Background layers */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute inset-0 glow-center pointer-events-none" />

      {/* Large logo watermark — animated path draw */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 300 190"
          fill="none"
          className="w-[80vw] sm:w-[62vw] lg:w-[50vw] opacity-[0.055]"
        >
          <motion.path
            d={NUUN_LOGO_PATH}
            stroke="#FFD400"
            strokeWidth="32"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 },
              opacity: { duration: 0.4, delay: 0.6 },
            }}
          />
        </svg>
      </div>

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

        {/* Badge */}
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

        {/* Headline */}
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

        {/* Animated word */}
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
          A next-generation creative and media company transforming ideas into measurable,
          real-world impact through purposeful creativity and strategic execution.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14 sm:mb-16 lg:mb-20"
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

        {/* Stats — counter animations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-2xl md:max-w-3xl mx-auto">
          {stats.map((s, i) => (
            <StatCounter
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>

      {/* Marquee ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-16 sm:bottom-20 left-0 right-0 overflow-hidden pointer-events-none border-y border-white/[0.05]"
      >
        <div className="flex animate-ticker whitespace-nowrap py-2.5">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="px-7 text-white/20 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em]"
            >
              {item}
              <span className="mx-4 text-[#FFD400]/25">·</span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
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
