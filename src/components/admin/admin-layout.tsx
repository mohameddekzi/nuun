"use client";

import { useState } from "react";
import { AdminSidebar } from "./sidebar";
import { Menu } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-shell flex h-screen overflow-hidden">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 overflow-y-auto flex flex-col min-w-0">
        {/* Mobile topbar — only visible on small screens */}
        <div className="lg:hidden flex items-center h-14 px-4 border-b border-white/[0.06] bg-[#0D0D0D] flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.07] border border-white/[0.1] text-white/50 hover:text-white hover:bg-white/[0.12] transition-all"
            aria-label="Open menu"
          >
            <Menu size={17} />
          </button>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 bg-[#FFD400] rounded-md rotate-45" />
                <div className="absolute inset-0.5 bg-[#0F0F0F] rounded-sm rotate-45" />
                <span className="absolute inset-0 flex items-center justify-center text-[#FFD400] font-black text-[10px] z-10">N</span>
              </div>
              <span className="text-white font-bold text-sm tracking-tight">NUUN Studio</span>
            </div>
          </div>
          {/* spacer to balance the hamburger */}
          <div className="w-9" />
        </div>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
