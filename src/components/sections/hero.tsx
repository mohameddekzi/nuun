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
  "Brand Identity", "Video Production", "Motion Design",
  "Social Media", "Event Branding", "Digital Campaigns",
  "Corporate Media", "UI & UX Design",
];

function StatCounter({ value, suffix, label, delay = 0 }: {
  value: number; suffix: string; label: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    const c = animate(count, value, { duration: 2, delay, ease: "easeOut" });
    return c.stop;
  }, [inView, count, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: delay + 0.25 }}
      className="flex flex-col items-center gap-1.5"
    >
      <div className="text-[clamp(1.6rem,4.5vw,2.75rem)] font-black text-[#FFD400] leading-none tabular-nums">
        <motion.span>{rounded}</motion.span>{suffix}
      </div>
      <div className="text-white/40 text-[9px] sm:text-[10px] tracking-widest uppercase text-center leading-snug max-w-[80px]">
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
  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 32 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 32 });
  const rotateX = useTransform(smoothY, [-400, 400], [3, -3]);
  const rotateY = useTransform(smoothX, [-400, 400], [-3, 3]);

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

  return (
    /* flex-col so content + marquee stack vertically — no overlap possible */
    <section
      ref={containerRef}
      onMouseMove={onMouseMove}
      className="relative min-h-[100svh] flex flex-col bg-[#0A0A0A]"
    >
      {/* ── Decorations (own overflow-hidden wrapper so ring doesn't cause hscroll) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(255,212,0,0.05) 0%, transparent 68%)" }}
        />

        {/* Faint logo mark — XL only */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none hidden xl:block overflow-hidden">
          <svg viewBox="0 0 300 190" fill="none" style={{ width: "36vw", opacity: 0.035 }}>
            <motion.path
              d={NUUN_LOGO_PATH}
              stroke="#FFD400"
              strokeWidth="32"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { duration: 3, ease: [0.16, 1, 0.3, 1], delay: 1 },
                opacity: { duration: 0.4, delay: 1 },
              }}
            />
          </svg>
        </div>

        {/* Orbit ring */}
        <motion.div
          style={{ rotateX, rotateY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            className="w-[520px] h-[520px] sm:w-[720px] sm:h-[720px] lg:w-[940px] lg:h-[940px] rounded-full border border-white/[0.025]"
          />
        </motion.div>

        {/* Floating dots */}
        {[
          { x: "7%",  y: "18%", d: 0   },
          { x: "90%", y: "14%", d: 0.9 },
          { x: "82%", y: "76%", d: 1.8 },
          { x: "9%",  y: "72%", d: 2.7 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-[#FFD400]"
            style={{ left: p.x, top: p.y }}
            animate={{ opacity: [0.1, 0.5, 0.1], y: [0, -12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: p.d }}
          />
        ))}
      </div>

      {/* ── Main content — flex-1 so it expands, vertically centered ── */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-4 text-center"
        style={{
          paddingTop: "clamp(88px, 12vh, 120px)",
          paddingBottom: "clamp(48px, 6vh, 72px)",
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-7 sm:mb-8"
        >
          <span className="badge-accent">
            <Zap size={10} className="fill-[#FFD400]" />
            Next-Generation Creative Agency · Mogadishu
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(2.6rem,9vw,7.5rem)] font-black tracking-tight leading-[0.88] text-white mb-7 sm:mb-8"
        >
          FROM VISION
          <br />
          <span className="text-[#FFD400]">TO REALITY</span>
        </motion.h1>

        {/* Cycling subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 mb-6 sm:mb-7"
          style={{ minHeight: "clamp(28px, 4vw, 40px)" }}
        >
          <span className="text-white/40 text-sm sm:text-base md:text-lg lg:text-xl font-light">Where</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 8, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(5px)" }}
              transition={{ duration: 0.38 }}
              className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold"
            >
              {words[wordIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="text-white/40 text-sm sm:text-base md:text-lg lg:text-xl font-light">Meets Purpose</span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.42 }}
          className="text-white/50 text-sm sm:text-base md:text-lg max-w-xl md:max-w-2xl mx-auto leading-relaxed mb-9 sm:mb-10"
        >
          A next-generation creative and media company transforming ideas into
          measurable, real-world impact through purposeful creativity and
          strategic execution.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.52 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-14 lg:mb-16 w-full"
        >
          <Link href="/contact" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto group gap-2.5">
              Start Your Project
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/portfolio" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-3">
              <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Play size={10} className="ml-0.5" />
              </span>
              View Our Work
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full">
          {stats.map((s, i) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={i * 0.1} />
          ))}
        </div>
      </div>

      {/* ── Marquee — normal flow, always below content ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="relative z-10 w-full overflow-hidden border-y border-white/[0.05] mb-10 sm:mb-12"
      >
        <div className="flex animate-ticker whitespace-nowrap py-2.5">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="px-6 sm:px-8 text-white/[0.17] text-[9px] sm:text-[10px] md:text-xs font-medium uppercase tracking-[0.22em]"
            >
              {item}
              <span className="mx-3 sm:mx-4 text-[#FFD400]/20">·</span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="text-white/20 text-[9px] tracking-[0.2em] uppercase hidden sm:block">Scroll</span>
        <motion.div
          animate={{ scaleY: [1, 0.4, 1], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="w-px h-5 sm:h-7 bg-gradient-to-b from-[#FFD400]/50 to-transparent origin-top"
        />
      </motion.div>
    </section>
  );
}
