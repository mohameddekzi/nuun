"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Briefcase, FolderOpen, FileText,
  Star, DollarSign, HelpCircle, MessageSquare,
  Image as ImageIcon, Settings, Users, LogOut, ChevronLeft, Menu,
  Globe, X, Building2, Receipt, UserCheck, Wallet,
  TrendingUp, ClipboardList, BadgeCheck, ChevronDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

/* ─── Navigation structure ──────────────────── */
const CONTENT_ITEMS = [
  { href: "/studio/services",     icon: Briefcase,     label: "Services" },
  { href: "/studio/portfolio",    icon: FolderOpen,    label: "Portfolio" },
  { href: "/studio/blog",         icon: FileText,      label: "Blog" },
  { href: "/studio/testimonials", icon: Star,          label: "Testimonials" },
  { href: "/studio/pricing",      icon: DollarSign,    label: "Pricing" },
  { href: "/studio/faq",          icon: HelpCircle,    label: "FAQ" },
  { href: "/studio/clients",      icon: Building2,     label: "Clients" },
];

const FINANCE_ITEMS = [
  { href: "/studio/sales",        icon: TrendingUp,    label: "Sales" },
  { href: "/studio/quotations",   icon: ClipboardList, label: "Quotations" },
  { href: "/studio/invoices",     icon: Receipt,       label: "Invoices" },
  { href: "/studio/receipts",     icon: BadgeCheck,    label: "Receipts" },
];

const AUDIENCE_ITEMS = [
  { href: "/studio/subscribers",  icon: UserCheck,     label: "Subscribers" },
  { href: "/studio/contact",      icon: MessageSquare, label: "Messages" },
  { href: "/studio/team",         icon: Users,         label: "Team" },
];

const SYSTEM_ITEMS = [
  { href: "/studio/media",        icon: ImageIcon,     label: "Media" },
  { href: "/studio/settings",     icon: Settings,      label: "Settings" },
];

const FINANCE_PATHS = FINANCE_ITEMS.map((i) => i.href);

/* ─── Types ─────────────────────────────────── */
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

/* ─── NavItem ────────────────────────────────── */
function NavItem({
  href, icon: Icon, label, active, collapsed, onClick,
}: {
  href: string; icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string; active: boolean; collapsed: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group",
        active
          ? "bg-[#FFD400]/10 text-[#FFD400] border border-[#FFD400]/20"
          : "text-white/50 hover:text-white hover:bg-white/5",
      )}
    >
      <Icon size={15} className="flex-shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

/* ─── Group label ────────────────────────────── */
function GroupLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="h-3" />;
  return (
    <p className="px-3 pt-4 pb-1 text-[10px] font-bold tracking-widest text-white/20 uppercase select-none">
      {label}
    </p>
  );
}

/* ─── Finance accordion ──────────────────────── */
function FinanceGroup({
  collapsed, pathname, onClick,
}: {
  collapsed: boolean; pathname: string; onClick?: () => void;
}) {
  const isFinancePage = FINANCE_PATHS.some((p) => pathname.startsWith(p));
  const [open, setOpen] = useState(isFinancePage);

  // Auto-open when navigating to a finance page
  useEffect(() => {
    if (isFinancePage) setOpen(true);
  }, [isFinancePage]);

  if (collapsed) {
    // Collapsed: just show icons
    return (
      <div className="space-y-0.5">
        {FINANCE_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClick}
              title={label}
              className={cn(
                "flex items-center justify-center px-3 py-2 rounded-xl transition-all",
                active ? "bg-[#FFD400]/10 text-[#FFD400] border border-[#FFD400]/20" : "text-white/50 hover:text-white hover:bg-white/5",
              )}
            >
              <Icon size={15} />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {/* Finance header toggle */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
          isFinancePage ? "text-[#FFD400]" : "text-white/50 hover:text-white hover:bg-white/5",
        )}
      >
        <Wallet size={15} className="flex-shrink-0" />
        <span className="flex-1 text-left">Finance</span>
        <ChevronDown
          size={12}
          className={cn("transition-transform duration-200 text-white/30", open && "rotate-180")}
        />
      </button>

      {/* Sub-items */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-4 pl-3 border-l border-white/[0.07] space-y-0.5 mt-0.5 mb-1">
              {FINANCE_ITEMS.map(({ href, icon: Icon, label }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClick}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all",
                      active ? "text-[#FFD400] bg-[#FFD400]/[0.07]" : "text-white/45 hover:text-white hover:bg-white/5",
                    )}
                  >
                    <Icon size={13} className="flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── SidebarContent ─────────────────────────── */
function SidebarContent({
  collapsed, onToggle, onClose,
}: {
  collapsed: boolean; onToggle: () => void; onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("settings").select("value").eq("key", "logo_url").maybeSingle()
      .then(({ data }) => {
        const v = data?.value;
        if (typeof v === "string" && v.trim()) setLogoUrl(v);
      });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/studio/login");
  };

  const showLabel = !collapsed || !!onClose;

  return (
    <div className="admin-sidebar flex flex-col h-full overflow-hidden">
      {/* ── Header / Logo ── */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-white/[0.06]",
          showLabel ? "justify-between" : "justify-center",
        )}
      >
        {showLabel && (
          <div className="flex items-center gap-2.5 min-w-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Logo"
                width={120}
                height={36}
                className="h-8 w-auto object-contain max-w-[130px]"
                unoptimized
              />
            ) : (
              <>
                <div className="relative w-7 h-7 flex-shrink-0">
                  <div className="absolute inset-0 bg-[#FFD400] rounded-lg rotate-45" />
                  <div className="absolute inset-0.5 bg-[#0F0F0F] rounded-md rotate-45" />
                  <span className="absolute inset-0 flex items-center justify-center text-[#FFD400] font-black text-xs z-10">N</span>
                </div>
                <span className="text-white font-bold text-sm tracking-tight truncate">NUUN Studio</span>
              </>
            )}
          </div>
        )}
        {onClose ? (
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex-shrink-0">
            <X size={14} />
          </button>
        ) : (
          <button onClick={onToggle} className="w-7 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex-shrink-0">
            {collapsed ? <Menu size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {/* Dashboard */}
        <NavItem
          href="/studio/dashboard" icon={LayoutDashboard} label="Dashboard"
          active={pathname === "/studio/dashboard"} collapsed={collapsed} onClick={onClose}
        />

        {/* Content */}
        <GroupLabel label="Content" collapsed={collapsed} />
        {CONTENT_ITEMS.map(({ href, icon, label }) => (
          <NavItem
            key={href} href={href} icon={icon} label={label}
            active={pathname === href || pathname.startsWith(href + "/")}
            collapsed={collapsed} onClick={onClose}
          />
        ))}

        {/* Finance */}
        <GroupLabel label="Finance" collapsed={collapsed} />
        <FinanceGroup collapsed={collapsed} pathname={pathname} onClick={onClose} />

        {/* Audience */}
        <GroupLabel label="Audience" collapsed={collapsed} />
        {AUDIENCE_ITEMS.map(({ href, icon, label }) => (
          <NavItem
            key={href} href={href} icon={icon} label={label}
            active={pathname === href || pathname.startsWith(href + "/")}
            collapsed={collapsed} onClick={onClose}
          />
        ))}

        {/* System */}
        <GroupLabel label="System" collapsed={collapsed} />
        {SYSTEM_ITEMS.map(({ href, icon, label }) => (
          <NavItem
            key={href} href={href} icon={icon} label={label}
            active={pathname === href || pathname.startsWith(href + "/")}
            collapsed={collapsed} onClick={onClose}
          />
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="p-2 border-t border-white/[0.06] space-y-0.5">
        <Link
          href="/"
          target="_blank"
          title={collapsed ? "View Site" : undefined}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <Globe size={15} className="flex-shrink-0" />
          {showLabel && <span>View Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          title={collapsed ? "Sign Out" : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <LogOut size={15} className="flex-shrink-0" />
          {showLabel && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
}

/* ─── AdminSidebar ───────────────────────────── */
export function AdminSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="hidden lg:block flex-shrink-0 h-screen sticky top-0 overflow-hidden"
      >
        <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onMobileClose} />
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
