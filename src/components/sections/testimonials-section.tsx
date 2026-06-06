"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <section className="relative py-32 bg-[#0D0D0D] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#FFD400]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="accent" className="mb-6">Client Stories</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            What Our <span className="text-[#FFD400]">Clients Say</span>
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-10 md:p-14 text-center"
            >
              {/* Quote icon */}
              <div className="flex justify-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center">
                  <Quote size={20} className="text-[#FFD400]" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-8">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-[#FFD400] fill-[#FFD400]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/80 text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto mb-10 italic">
                &ldquo;{testimonials[current].content}&rdquo;
              </p>

              {/* Author */}
              <div>
                <p className="text-white font-semibold">{testimonials[current].name}</p>
                <p className="text-white/50 text-sm">
                  {testimonials[current].position}
                  {testimonials[current].company && `, ${testimonials[current].company}`}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`transition-all duration-300 rounded-full ${i === current ? "w-6 h-2 bg-[#FFD400]" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
