"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NuunLogoMark } from "@/components/ui/nuun-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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

interface HeaderProps {
  logoUrl?: string | null;
  logoUrlLight?: string | null;
  logoHeight?: number;
}

/* Renders theme-aware logo: dark variant in dark mode, light variant in light mode */
function ThemeLogo({ dark, light, height, alt }: { dark: string; light: string | null; height: number; alt: string }) {
  const lightSrc = light ?? dark;
  return (
    <>
      <Image src={dark} alt={alt} width={height * 4} height={height} style={{ height }} className="logo-dark w-auto object-contain" unoptimized />
      <Image src={lightSrc} alt={alt} width={height * 4} height={height} style={{ height }} className="logo-light w-auto object-contain" unoptimized />
    </>
  );
}

export function Header({ logoUrl, logoUrlLight, logoHeight = 32 }: HeaderProps) {
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

  const Logo = () => (
    <Link href="/" className="flex items-center gap-3 group w-fit">
      {logoUrl ? (
        <ThemeLogo dark={logoUrl} light={logoUrlLight ?? null} height={logoHeight} alt="Nuun Media" />
      ) : (
        <>
          <NuunLogoMark height={28} className="group-hover:scale-105 transition-transform duration-300" />
          <span className="font-bold text-[17px] tracking-tight leading-none" style={{ color: "var(--fg)" }}>
            NUUN <span className="text-[#FFD400]">MEDIA</span>
          </span>
        </>
      )}
    </Link>
  );

  const MobileLogo = () => (
    <Link href="/" className="flex items-center gap-2.5 group">
      {logoUrl ? (
        <ThemeLogo dark={logoUrl} light={logoUrlLight ?? null} height={Math.max(logoHeight - 6, 20)} alt="Nuun Media" />
      ) : (
        <>
          <NuunLogoMark height={25} className="group-hover:scale-105 transition-transform" />
          <span className="font-bold text-[15px] tracking-tight leading-none" style={{ color: "var(--fg)" }}>
            NUUN <span className="text-[#FFD400]">MEDIA</span>
          </span>
        </>
      )}
    </Link>
  );

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled ? "header-scrolled" : "bg-transparent"
        )}
      >
        <div className="section-inner">

          {/* ── Desktop (≥1024px): true 3-col grid ── */}
          <div className="hidden lg:grid items-center h-[72px]" style={{ gridTemplateColumns: "1fr auto 1fr" }}>

            {/* Logo — justified left */}
            <Logo />

            {/* Nav — perfectly centered */}
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-3.5 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-200",
                    pathname === link.href
                      ? "text-[#FFD400] bg-[#FFD400]/10"
                      : "text-white/55 hover:text-white hover:bg-white/[0.07] dark-nav-link"
                  )}
                  style={pathname !== link.href ? {
                    color: "var(--mobile-link-inactive)",
                  } : undefined}
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
              <ThemeToggle />
              <Link href="/studio">
                <Button variant="ghost" size="sm" className="text-xs px-3" style={{ color: "var(--mobile-link-inactive)" }}>
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
            <MobileLogo />

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/contact" className="hidden sm:block">
                <Button size="xs" className="text-[11px]">Let&apos;s Talk</Button>
              </Link>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--mobile-link-inactive)",
                }}
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
              className="absolute inset-0 backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="mobile-drawer absolute right-0 top-0 h-full w-[72vw] max-w-[288px] min-w-[236px] flex flex-col"
            >
              {/* Panel header */}
              <div
                className="flex items-center justify-between px-4 py-4"
                style={{ borderBottom: "1px solid var(--mobile-drawer-border)" }}
              >
                {logoUrl ? (
                  <ThemeLogo dark={logoUrl} light={logoUrlLight ?? null} height={Math.max(logoHeight - 12, 18)} alt="Nuun Media" />
                ) : (
                  <div className="flex items-center gap-2.5">
                    <NuunLogoMark height={21} />
                    <span className="font-bold text-sm tracking-tight" style={{ color: "var(--fg)" }}>NUUN MEDIA</span>
                  </div>
                )}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                  style={{ background: "var(--surface)", color: "var(--mobile-link-inactive)" }}
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
                          : "mobile-nav-link-inactive"
                      )}
                    >
                      <span>{link.label}</span>
                      {pathname === link.href
                        ? <span className="w-1.5 h-1.5 rounded-full bg-[#FFD400]" />
                        : <ChevronRight size={13} style={{ color: "var(--border-hover)" }} />
                      }
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer CTA */}
              <div className="p-4 space-y-2" style={{ borderTop: "1px solid var(--mobile-drawer-border)" }}>
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
