"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NuunLogoMark } from "@/components/ui/nuun-logo";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/",         label: "Home"      },
  { href: "/about",    label: "About"     },
  { href: "/services", label: "Services"  },
  { href: "/portfolio",label: "Portfolio" },
  { href: "/blog",     label: "Blog"      },
  { href: "/pricing",  label: "Pricing"   },
  { href: "/contact",  label: "Contact"   },
];

export function Header() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
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
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#0A0A0A]/92 backdrop-blur-2xl border-b border-white/[0.07] shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Desktop (≥1024px): true 3-col grid ── */}
          <div className="hidden lg:grid items-center h-[72px]" style={{ gridTemplateColumns: "1fr auto 1fr" }}>

            {/* Logo — justified left */}
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <NuunLogoMark height={28} className="group-hover:scale-105 transition-transform duration-300" />
              <span className="text-white font-bold text-[17px] tracking-tight leading-none">
                NUUN <span className="text-[#FFD400]">MEDIA</span>
              </span>
            </Link>

            {/* Nav — perfectly centered */}
            <nav className="flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-200",
                    pathname === link.href
                      ? "text-[#FFD400] bg-[#FFD400]/10"
                      : "text-white/55 hover:text-white hover:bg-white/[0.07]"
                  )}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD400]" />
                  )}
                </Link>
              ))}
            </nav>

            {/* CTA — justified right */}
            <div className="flex items-center gap-2 justify-self-end">
              <Link href="/studio">
                <Button variant="ghost" size="sm" className="text-white/45 hover:text-white text-xs px-3">
                  Studio ↗
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="sm" className="text-xs px-5">Start a Project</Button>
              </Link>
            </div>
          </div>

          {/* ── Mobile / Tablet (<1024px): flex ── */}
          <div className="flex lg:hidden items-center justify-between h-16 sm:h-[68px]">
            <Link href="/" className="flex items-center gap-2.5 group">
              <NuunLogoMark
                height={24}
                className="group-hover:scale-105 transition-transform sm:hidden"
              />
              <NuunLogoMark
                height={27}
                className="group-hover:scale-105 transition-transform hidden sm:block"
              />
              <span className="text-white font-bold text-[15px] sm:text-base tracking-tight leading-none">
                NUUN <span className="text-[#FFD400]">MEDIA</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/contact" className="hidden sm:block">
                <Button size="xs" className="text-[11px]">Let&apos;s Talk</Button>
              </Link>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.07] border border-white/[0.1] text-white/65 hover:text-white hover:bg-white/[0.12] transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </div>

        </div>
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 h-full w-[72vw] max-w-[288px] min-w-[236px] bg-[#0F0F0F] border-l border-white/[0.07] flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <NuunLogoMark height={21} />
                  <span className="text-white font-bold text-sm tracking-tight">NUUN MEDIA</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] text-white/40 hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 overflow-y-auto px-2.5 py-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all mb-0.5",
                        pathname === link.href
                          ? "text-[#FFD400] bg-[#FFD400]/10"
                          : "text-white/55 hover:text-white hover:bg-white/[0.06]"
                      )}
                    >
                      <span>{link.label}</span>
                      {pathname === link.href
                        ? <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
                        : <ChevronRight size={13} className="text-white/20" />
                      }
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer CTA */}
              <div className="p-4 border-t border-white/[0.06] space-y-2">
                <Link href="/contact" className="block">
                  <Button className="w-full" size="md">Start a Project</Button>
                </Link>
                <Link href="/studio" className="block">
                  <Button variant="secondary" className="w-full" size="md">NUUN Studio ↗</Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
