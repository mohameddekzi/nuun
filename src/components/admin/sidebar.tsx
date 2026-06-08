"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Briefcase, FolderOpen, FileText,
  Star, DollarSign, HelpCircle, MessageSquare,
  Image, Settings, Users, LogOut, ChevronLeft, Menu,
  Globe, X, Building2, Receipt
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/studio/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/studio/services", icon: Briefcase, label: "Services" },
  { href: "/studio/portfolio", icon: FolderOpen, label: "Portfolio" },
  { href: "/studio/blog", icon: FileText, label: "Blog" },
  { href: "/studio/testimonials", icon: Star, label: "Testimonials" },
  { href: "/studio/pricing", icon: DollarSign, label: "Pricing" },
  { href: "/studio/faq", icon: HelpCircle, label: "FAQ" },
  { href: "/studio/clients", icon: Building2, label: "Clients" },
  { href: "/studio/quotations", icon: Receipt, label: "Quotations" },
  { href: "/studio/contact", icon: MessageSquare, label: "Messages" },
  { href: "/studio/team", icon: Users, label: "Team" },
  { href: "/studio/media", icon: Image, label: "Media" },
  { href: "/studio/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarContent({ collapsed, onToggle, onClose }: { collapsed: boolean; onToggle: () => void; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/studio/login");
  };

  return (
    <div className="admin-sidebar flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className={cn("flex items-center h-16 px-4 border-b border-white/[0.06]", collapsed && !onClose ? "justify-center" : "justify-between")}>
        {(!collapsed || onClose) && (
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 bg-[#FFD400] rounded-lg rotate-45" />
              <div className="absolute inset-0.5 bg-[#0F0F0F] rounded-md rotate-45" />
              <span className="absolute inset-0 flex items-center justify-center text-[#FFD400] font-black text-xs z-10">N</span>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">NUUN Studio</span>
          </div>
        )}
        {onClose ? (
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X size={14} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            {collapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              title={collapsed && !onClose ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-[#FFD400]/10 text-[#FFD400] border border-[#FFD400]/20"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={16} className="flex-shrink-0" />
              {(!collapsed || onClose) && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/[0.06] space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <Globe size={16} className="flex-shrink-0" />
          {(!collapsed || onClose) && <span>View Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {(!collapsed || onClose) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="hidden lg:block flex-shrink-0 h-screen sticky top-0 overflow-hidden"
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </motion.aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 top-0 h-full w-72"
            >
              <SidebarContent collapsed={false} onToggle={onToggle} onClose={onMobileClose} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
