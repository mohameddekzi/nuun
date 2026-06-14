"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Briefcase, FolderOpen, MessageSquare, FileText,
  ArrowRight, Mail, Clock, Users, Receipt, UserCheck,
  TrendingUp, ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import type { User } from "@supabase/supabase-js";
import type { ContactMessage } from "@/lib/types/database";

interface DashboardStats {
  services: number;
  projects: number;
  unreadMessages: number;
  publishedPosts: number;
  subscribers: number;
  quotations: number;
  teamMembers: number;
}

interface RecentQuotation {
  id: string;
  quote_number: string;
  client_name: string;
  status: string;
  type: string;
  created_at: string;
}

interface DashboardContentProps {
  stats: DashboardStats;
  recentMessages: ContactMessage[];
  recentQuotations: RecentQuotation[];
  user: User;
}

const statusColors: Record<string, string> = {
  draft: "bg-white/[0.06] text-white/40 border-white/[0.08]",
  sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  accepted: "bg-green-500/10 text-green-400 border-green-500/20",
  declined: "bg-red-500/10 text-red-400 border-red-500/20",
  paid: "bg-[#FFD400]/10 text-[#FFD400] border-[#FFD400]/20",
};

export function DashboardContent({ stats, recentMessages, recentQuotations, user }: DashboardContentProps) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const statCards = [
    { label: "Active Services", value: stats.services, icon: Briefcase, href: "/studio/services", accent: "from-blue-500/20" },
    { label: "Live Projects", value: stats.projects, icon: FolderOpen, href: "/studio/portfolio", accent: "from-purple-500/20" },
    { label: "Unread Messages", value: stats.unreadMessages, icon: MessageSquare, href: "/studio/contact", accent: "from-[#FFD400]/20", highlight: stats.unreadMessages > 0 },
    { label: "Published Posts", value: stats.publishedPosts, icon: FileText, href: "/studio/blog", accent: "from-emerald-500/20" },
    { label: "Subscribers", value: stats.subscribers, icon: UserCheck, href: "/studio/subscribers", accent: "from-pink-500/20" },
    { label: "Quotations", value: stats.quotations, icon: Receipt, href: "/studio/quotations", accent: "from-orange-500/20" },
    { label: "Team Members", value: stats.teamMembers, icon: Users, href: "/studio/team", accent: "from-cyan-500/20" },
    { label: "Growth", value: `${stats.subscribers + stats.projects}`, icon: TrendingUp, href: "/studio/dashboard", accent: "from-violet-500/20" },
  ];

  const quickLinks = [
    { href: "/studio/services/new", label: "New Service" },
    { href: "/studio/portfolio/new", label: "New Project" },
    { href: "/studio/blog/new", label: "Write Blog Post" },
    { href: "/studio/quotations/new", label: "New Quotation" },
    { href: "/studio/testimonials", label: "Manage Testimonials" },
    { href: "/studio/settings", label: "Site Settings" },
  ];

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-white/40 text-sm mb-1">{greeting}</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {user.email?.split("@")[0] || "Admin"} 👋
          </h1>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.07] transition-all text-sm self-start sm:self-auto"
        >
          <ExternalLink size={13} />
          View Site
        </Link>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link href={card.href} className="group block">
              <div
                className={`relative bg-white/[0.03] border rounded-2xl p-4 sm:p-5 overflow-hidden hover:-translate-y-0.5 transition-all duration-300 ${
                  card.highlight
                    ? "border-[#FFD400]/30 bg-[#FFD400]/[0.03]"
                    : "border-white/[0.07] hover:border-white/[0.14]"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-white/35 text-[10px] uppercase tracking-widest mb-2 leading-tight">{card.label}</p>
                    <p className="text-3xl font-black text-white">{card.value}</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center flex-shrink-0">
                    <card.icon size={15} className="text-white/40 group-hover:text-[#FFD400] transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Messages */}
        <div className="lg:col-span-2">
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-white font-bold text-sm">Recent Messages</h2>
              <Link href="/studio/contact" className="text-[#FFD400] text-xs hover:underline flex items-center gap-1">
                View all <ArrowRight size={11} />
              </Link>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {recentMessages.length === 0 ? (
                <div className="py-10 text-center">
                  <Mail size={24} className="text-white/15 mx-auto mb-2" />
                  <p className="text-white/25 text-sm">No messages yet</p>
                </div>
              ) : (
                recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`px-5 py-4 hover:bg-white/[0.02] transition-colors ${!msg.is_read ? "border-l-2 border-[#FFD400]" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#FFD400] text-xs font-bold">{msg.name[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium">{msg.name}</p>
                          <p className="text-white/40 text-xs">{msg.email}</p>
                          <p className="text-white/30 text-xs mt-0.5 line-clamp-1">{msg.message}</p>
                        </div>
                      </div>
                      <div className="text-white/25 text-xs flex items-center gap-1 flex-shrink-0 whitespace-nowrap">
                        <Clock size={10} />
                        {format(new Date(msg.created_at), "MMM d")}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Quotations */}
          {recentQuotations.length > 0 && (
            <div className="mt-5 bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <h2 className="text-white font-bold text-sm">Recent Quotations</h2>
                <Link href="/studio/quotations" className="text-[#FFD400] text-xs hover:underline flex items-center gap-1">
                  View all <ArrowRight size={11} />
                </Link>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {recentQuotations.map((q) => (
                  <Link
                    key={q.id}
                    href={`/studio/quotations/${q.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#FFD400]/10 border border-[#FFD400]/20 flex items-center justify-center flex-shrink-0">
                        <Receipt size={12} className="text-[#FFD400]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{q.client_name}</p>
                        <p className="text-white/35 text-xs">{q.quote_number} · {q.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[q.status] ?? statusColors.draft}`}>
                        {q.status}
                      </span>
                      <span className="text-white/25 text-xs hidden sm:block">
                        {format(new Date(q.created_at), "MMM d")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-white font-bold text-sm">Quick Actions</h2>
            </div>
            <div className="p-2 space-y-0.5">
              {quickLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/[0.05] transition-all group"
                >
                  {label}
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Site Status */}
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5">
            <h3 className="text-white font-bold text-sm mb-4">System Status</h3>
            <div className="space-y-3">
              {[
                { label: "Website", status: "Online", ok: true },
                { label: "Database", status: "Connected", ok: true },
                { label: "Storage", status: "Active", ok: true },
                { label: "Auth", status: "Running", ok: true },
              ].map(({ label, status, ok }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-white/45 text-xs">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-400" : "bg-red-400"}`} />
                    <span className={`text-xs ${ok ? "text-green-400" : "text-red-400"}`}>{status}</span>
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
