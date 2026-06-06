"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, FolderOpen, MessageSquare, FileText, ArrowRight, Mail, Clock } from "lucide-react";
import { format } from "date-fns";
import type { User } from "@supabase/supabase-js";
import type { ContactMessage } from "@/lib/types/database";

interface DashboardStats {
  services: number;
  projects: number;
  unreadMessages: number;
  publishedPosts: number;
}

interface DashboardContentProps {
  stats: DashboardStats;
  recentMessages: ContactMessage[];
  user: User;
}

const statCards = (stats: DashboardStats) => [
  { label: "Services", value: stats.services, icon: Briefcase, href: "/studio/services", color: "from-blue-500/20 to-transparent" },
  { label: "Projects", value: stats.projects, icon: FolderOpen, href: "/studio/portfolio", color: "from-purple-500/20 to-transparent" },
  { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, href: "/studio/contact", color: "from-[#FFD400]/20 to-transparent" },
  { label: "Published Posts", value: stats.publishedPosts, icon: FileText, href: "/studio/blog", color: "from-green-500/20 to-transparent" },
];

const quickLinks = [
  { href: "/studio/services", label: "Manage Services" },
  { href: "/studio/portfolio", label: "Add Project" },
  { href: "/studio/blog", label: "Write Blog Post" },
  { href: "/studio/testimonials", label: "Add Testimonial" },
  { href: "/studio/pricing", label: "Update Pricing" },
  { href: "/studio/settings", label: "Site Settings" },
];

export function DashboardContent({ stats, recentMessages, user }: DashboardContentProps) {
  const cards = statCards(stats);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-white/40 text-sm mb-1">Welcome back</p>
          <h1 className="text-3xl font-black text-white">
            {user.email?.split("@")[0] || "Admin"}
          </h1>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={card.href} className="group block">
              <div className={`relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 overflow-hidden hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-0.5`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{card.label}</p>
                    <p className="text-4xl font-black text-white">{card.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <card.icon size={18} className="text-white/50 group-hover:text-[#FFD400] transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h2 className="text-white font-bold">Recent Messages</h2>
              <Link href="/studio/contact" className="text-[#FFD400] text-xs hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {recentMessages.length === 0 ? (
                <p className="text-white/30 text-sm p-6 text-center">No messages yet</p>
              ) : (
                recentMessages.map((msg) => (
                  <div key={msg.id} className={`p-5 hover:bg-white/[0.02] transition-colors ${!msg.is_read ? "border-l-2 border-[#FFD400]" : ""}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center flex-shrink-0">
                          <Mail size={12} className="text-[#FFD400]" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{msg.name}</p>
                          <p className="text-white/50 text-xs">{msg.email}</p>
                          <p className="text-white/40 text-xs mt-1 line-clamp-1">{msg.message}</p>
                        </div>
                      </div>
                      <div className="text-white/30 text-xs flex items-center gap-1 flex-shrink-0">
                        <Clock size={10} />
                        {format(new Date(msg.created_at), "MMM d")}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/[0.06]">
              <h2 className="text-white font-bold">Quick Actions</h2>
            </div>
            <div className="p-3 space-y-1">
              {quickLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all group"
                >
                  {label}
                  <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Site status */}
          <div className="mt-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm mb-4">Site Status</h3>
            <div className="space-y-3">
              {[
                { label: "Website", status: "Online" },
                { label: "Database", status: "Connected" },
                { label: "Storage", status: "Active" },
              ].map(({ label, status }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-green-400 text-xs">{status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
