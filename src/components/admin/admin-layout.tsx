"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./sidebar";
import { Menu, Sun, Moon, Bell } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/studio/dashboard":    "Dashboard",
  "/studio/services":     "Services",
  "/studio/portfolio":    "Portfolio",
  "/studio/blog":         "Blog",
  "/studio/testimonials": "Testimonials",
  "/studio/pricing":      "Pricing",
  "/studio/faq":          "FAQ",
  "/studio/clients":      "Clients",
  "/studio/sales":        "Sales Overview",
  "/studio/quotations":   "Quotations",
  "/studio/invoices":     "Invoices",
  "/studio/receipts":     "Receipts",
  "/studio/contact":      "Messages",
  "/studio/team":         "Team",
  "/studio/media":        "Media Library",
  "/studio/subscribers":  "Subscribers",
  "/studio/settings":     "Settings",
};

function getPageTitle(pathname: string): string {
  for (const [key, value] of Object.entries(pageTitles)) {
    if (pathname === key || pathname.startsWith(key + "/")) return value;
  }
  return "NUUN Studio";
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  useEffect(() => setMounted(true), []);

  return (
    <div className="admin-shell flex h-screen overflow-hidden">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 overflow-y-auto flex flex-col min-w-0">
        {/* Top header bar */}
        <header
          className="flex items-center h-14 px-4 sm:px-6 border-b border-white/[0.06] flex-shrink-0 gap-3"
          style={{ background: "var(--bg-alt)" }}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.10] transition-all"
            aria-label="Open menu"
          >
            <Menu size={16} />
          </button>

          {/* Page title (desktop) / Logo (mobile) */}
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-semibold text-sm hidden sm:block truncate">{pageTitle}</h1>
            <div className="flex items-center gap-2 sm:hidden">
              <div className="relative w-6 h-6 flex-shrink-0">
                <div className="absolute inset-0 bg-[#FFD400] rounded-md rotate-45" />
                <div className="absolute inset-0.5 bg-[#0F0F0F] rounded-sm rotate-45" />
                <span className="absolute inset-0 flex items-center justify-center text-[#FFD400] font-black text-[10px] z-10">N</span>
              </div>
              <span className="text-white font-bold text-sm tracking-tight">NUUN Studio</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            )}

            {/* Notifications */}
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
              aria-label="Notifications"
            >
              <Bell size={15} />
            </button>

            {/* User avatar */}
            <div className="w-7 h-7 rounded-full bg-[#FFD400]/15 border border-[#FFD400]/25 flex items-center justify-center ml-1 flex-shrink-0">
              <span className="text-[#FFD400] text-[11px] font-bold">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
