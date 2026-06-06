"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NuunLogoMark } from "@/components/ui/nuun-logo";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#0A0A0A]/90 backdrop-blur-2xl border-b border-white/[0.07] shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          {/* Desktop: 3-col grid so nav is truly centered */}
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center h-[72px]">
            {/* Logo — left */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group justify-self-start">
              <NuunLogoMark
                height={28}
                className="group-hover:scale-105 transition-transform duration-300"
              />
              <span className="text-white font-bold text-lg tracking-tight leading-none">
                NUUN <span className="text-[#FFD400]">MEDIA</span>
              </span>
            </Link>

            {/* Nav — center */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "text-[#FFD400] bg-[#FFD400]/10"
                      : "text-white/60 hover:text-white hover:bg-white/[0.07]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA — right */}
            <div className="flex items-center gap-3 justify-self-end">
              <Link href="/studio">
                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white text-xs">
                  Studio ↗
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="sm">Start a Project</Button>
              </Link>
            </div>
          </div>

          {/* Mobile / tablet */}
          <div className="flex lg:hidden items-center justify-between h-16 sm:h-[68px]">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
              <NuunLogoMark
                height={24}
                className="group-hover:scale-105 transition-transform duration-300 sm:hidden"
              />
              <NuunLogoMark
                height={28}
                className="group-hover:scale-105 transition-transform duration-300 hidden sm:block"
              />
              <span className="text-white font-bold text-base sm:text-lg tracking-tight leading-none">
                NUUN <span className="text-[#FFD400]">MEDIA</span>
              </span>
            </Link>

            <div className="flex items-center gap-2.5">
              <Link href="/contact">
                <Button size="xs" className="hidden sm:flex text-xs">Let&apos;s Talk</Button>
              </Link>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.09] text-white/70 hover:text-white hover:bg-white/[0.11] transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-[#0A0A0A]/75 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 h-full w-[75vw] max-w-[300px] min-w-[240px] bg-[#0F0F0F] border-l border-white/[0.07] flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-4 sm:py-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <NuunLogoMark height={22} />
                  <span className="text-white font-bold text-sm">NUUN MEDIA</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045 + 0.08 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        pathname === link.href
                          ? "text-[#FFD400] bg-[#FFD400]/10"
                          : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                      )}
                    >
                      {link.label}
                      {pathname === link.href && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="p-4 border-t border-white/[0.06] space-y-2.5">
                <Link href="/contact" className="block">
                  <Button className="w-full" size="md">Start a Project</Button>
                </Link>
                <Link href="/studio" className="block">
                  <Button variant="secondary" className="w-full" size="md">NUUN Studio</Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
