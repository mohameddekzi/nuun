"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types/database";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0);

  if (!testimonials.length) return null;

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="relative section-padding bg-[#0D0D0D] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[260px] bg-[#FFD400]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-12"
        >
          <span className="badge-accent mb-5 sm:mb-6">Client Stories</span>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-white mt-5">
            What Our <span className="text-[#FFD400]">Clients Say</span>
          </h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="card p-7 sm:p-10 text-center"
            >
              {/* Quote icon */}
              <div className="flex justify-center mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center">
                  <Quote size={16} className="text-[#FFD400]" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-5">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-[#FFD400] fill-[#FFD400]" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-white/80 text-base sm:text-lg lg:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-7 italic">
                &ldquo;{testimonials[current].content}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-white/[0.06] pt-5">
                <p className="text-white font-semibold text-sm sm:text-base">{testimonials[current].name}</p>
                <p className="text-white/50 text-xs sm:text-sm mt-1">
                  {testimonials[current].position}
                  {testimonials[current].company && `, ${testimonials[current].company}`}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-2 items-center">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`transition-all duration-300 rounded-full ${
                      i === current ? "w-6 h-2 bg-[#FFD400]" : "w-2 h-2 bg-white/20 hover:bg-white/40"
                    }`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
