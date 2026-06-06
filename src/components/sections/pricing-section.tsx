"use client";

import { motion, type Variants } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PricingPlan } from "@/lib/types/database";

interface PricingSectionProps {
  plans: PricingPlan[];
}

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function PricingSection({ plans }: PricingSectionProps) {
  if (!plans.length) {
    return (
      <section className="section-padding bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-white/40 text-base sm:text-lg mb-6">Pricing is customized based on project scope.</p>
          <Link href="/contact">
            <Button size="lg" className="gap-2">Request a Quote <ArrowRight size={16} /></Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {plans.map((plan) => {
            const features = Array.isArray(plan.features) ? plan.features as string[] : [];
            return (
              <motion.div
                key={plan.id}
                variants={item}
                className={`relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 hover:-translate-y-1 ${
                  plan.is_popular
                    ? "bg-[#FFD400] border-[#FFD400]"
                    : "card card-lift"
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#0A0A0A] text-[#FFD400] text-xs font-bold px-4 py-1.5 rounded-full border border-[#FFD400]/30 whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-5 sm:mb-6">
                  <h3 className={`text-lg sm:text-xl font-bold mb-2 ${plan.is_popular ? "text-[#0A0A0A]" : "text-white"}`}>
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p className={`text-sm leading-relaxed ${plan.is_popular ? "text-[#0A0A0A]/70" : "text-white/50"}`}>
                      {plan.description}
                    </p>
                  )}
                </div>

                {plan.price !== null && plan.price !== undefined ? (
                  <div className="mb-6 sm:mb-8">
                    <span className={`text-3xl sm:text-4xl font-black ${plan.is_popular ? "text-[#0A0A0A]" : "text-white"}`}>
                      ${plan.price.toLocaleString()}
                    </span>
                    <span className={`text-sm ml-1 ${plan.is_popular ? "text-[#0A0A0A]/60" : "text-white/40"}`}>
                      /{plan.period}
                    </span>
                  </div>
                ) : (
                  <div className="mb-6 sm:mb-8">
                    <span className={`text-2xl sm:text-3xl font-black ${plan.is_popular ? "text-[#0A0A0A]" : "text-white"}`}>
                      Custom
                    </span>
                  </div>
                )}

                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5 sm:gap-3">
                      <CheckCircle size={14} className={`mt-0.5 flex-shrink-0 ${plan.is_popular ? "text-[#0A0A0A]" : "text-[#FFD400]"}`} />
                      <span className={`text-sm leading-relaxed ${plan.is_popular ? "text-[#0A0A0A]/80" : "text-white/60"}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact">
                  <Button
                    variant={plan.is_popular ? "primary" : "outline"}
                    className={`w-full ${plan.is_popular ? "bg-[#0A0A0A] text-[#FFD400] hover:bg-[#0A0A0A]/90" : ""}`}
                    size="md"
                  >
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
