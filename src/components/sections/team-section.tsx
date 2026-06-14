"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { User } from "lucide-react";
import type { TeamMember } from "@/lib/types/database";

interface TeamSectionProps {
  team: TeamMember[];
}

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function TeamSection({ team }: TeamSectionProps) {
  if (!team.length) return null;

  return (
    <section className="relative section-padding overflow-hidden" style={{ background: "var(--bg-alt)" }}>
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

      <div className="relative section-inner">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-14 lg:mb-16"
        >
          <span className="badge-accent mb-5 sm:mb-6">Our People</span>
          <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-black text-white leading-tight mb-4 mt-5">
            Meet the <span className="text-[#FFD400]">Team</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            The creative minds and strategic thinkers turning vision into reality.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {team.map((member) => (
            <motion.div
              key={member.id}
              variants={item}
              className="group card card-lift overflow-hidden"
            >
              {/* Avatar */}
              <div className="relative aspect-square bg-[#FFD400]/[0.04] overflow-hidden">
                {member.avatar_url ? (
                  <Image
                    src={member.avatar_url}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User size={42} className="text-white/15" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info */}
              <div className="p-4 sm:p-5 text-center">
                <h3 className="text-white font-bold text-sm sm:text-base group-hover:text-[#FFD400] transition-colors">
                  {member.name}
                </h3>
                {member.position && (
                  <p className="text-[#FFD400]/70 text-xs mt-1">{member.position}</p>
                )}
                {member.bio && (
                  <p className="text-white/40 text-xs mt-2.5 leading-relaxed line-clamp-3">{member.bio}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
