"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu open
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
            ? "bg-[#0A0A0A]/85 backdrop-blur-2xl border-b border-white/[0.06]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-[#FFD400] rounded-lg rotate-45 group-hover:rotate-[200deg] transition-transform duration-700 ease-out" />
                <div className="absolute inset-[3px] bg-[#0A0A0A] rounded-sm rotate-45" />
                <span className="absolute inset-0 flex items-center justify-center text-[#FFD400] font-black text-xs z-10 select-none">N</span>
              </div>
              <span className="text-white font-bold text-base sm:text-lg tracking-tight leading-none">
                NUUN <span className="text-[#FFD400]">MEDIA</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    pathname === link.href
                      ? "text-[#FFD400] bg-[#FFD400]/10"
                      : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2">
              <Link href="/studio">
                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white text-xs">
                  Studio ↗
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="sm">Start a Project</Button>
              </Link>
            </div>

            {/* Mobile toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <Link href="/contact" className="sm:block">
                <Button size="xs" className="text-xs hidden sm:flex">Let's Talk</Button>
              </Link>
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.1] transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#0A0A0A]/70 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 h-full w-[280px] bg-[#0F0F0F] border-l border-white/[0.07] flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
                <span className="text-white font-bold text-sm">Navigation</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] text-white/50 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.1 }}
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
              <div className="p-4 border-t border-white/[0.06] space-y-2">
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
