"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NuunLogoMark } from "@/components/ui/nuun-logo";
import { useState } from "react";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/pricing", label: "Pricing" },
  ],
  resources: [
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/studio", label: "NUUN Studio" },
  ],
};

const socials = [
  { label: "IG", href: "#" },
  { label: "TW", href: "#" },
  { label: "LI", href: "#" },
  { label: "FB", href: "#" },
];

interface FooterProps {
  logoUrl?: string | null;
}

export function Footer({ logoUrl }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
    } catch {}
  };

  return (
    <footer className="relative overflow-hidden" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[160px] rounded-full blur-3xl pointer-events-none" style={{ background: "var(--accent-glow)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 lg:pt-20 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-14 lg:mb-16">

          {/* Brand col */}
          <div className="sm:col-span-2 text-center sm:text-left flex flex-col items-center sm:items-start">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              {logoUrl ? (
                <Image src={logoUrl} alt="Nuun Media" width={120} height={32} className="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <>
                  <NuunLogoMark height={30} className="group-hover:scale-105 transition-transform duration-300" />
                  <span className="font-bold text-base sm:text-lg tracking-tight" style={{ color: "var(--fg)" }}>
                    NUUN <span className="text-[#FFD400]">MEDIA</span>
                  </span>
                </>
              )}
            </Link>
            <p className="text-sm leading-relaxed mb-7 max-w-sm" style={{ color: "color-mix(in srgb, var(--fg) 50%, transparent)" }}>
              A next-generation creative and media company operating at the intersection of creativity, technology, and digital transformation.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "color-mix(in srgb, var(--fg) 70%, transparent)" }}>Stay Updated</p>
              {subscribed ? (
                <p className="text-[#FFD400] text-sm">Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-xs">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 min-w-0 h-9 px-3 rounded-lg text-sm focus:outline-none transition-colors"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--fg)",
                    }}
                  />
                  <Button size="sm" type="submit" className="shrink-0 text-xs px-4">
                    Join
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Company */}
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
            <h4 className="font-semibold text-xs mb-5 tracking-widest uppercase" style={{ color: "color-mix(in srgb, var(--fg) 70%, transparent)" }}>Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 flex items-center gap-1.5 group w-fit hover:text-[#FFD400]"
                    style={{ color: "color-mix(in srgb, var(--fg) 50%, transparent)" }}
                  >
                    {link.label}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources + Contact */}
          <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
            <h4 className="font-semibold text-xs mb-5 tracking-widest uppercase" style={{ color: "color-mix(in srgb, var(--fg) 70%, transparent)" }}>Resources</h4>
            <ul className="space-y-3 mb-7">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors duration-200 flex items-center gap-1.5 group w-fit hover:text-[#FFD400]"
                    style={{ color: "color-mix(in srgb, var(--fg) 50%, transparent)" }}
                  >
                    {link.label}
                    <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <a href="mailto:info@nuun.so" className="flex items-center gap-2 text-xs transition-colors hover:text-[#FFD400]" style={{ color: "color-mix(in srgb, var(--fg) 50%, transparent)" }}>
                <Mail size={11} /> info@nuun.so
              </a>
              <a href="tel:+252614272760" className="flex items-center gap-2 text-xs transition-colors hover:text-[#FFD400]" style={{ color: "color-mix(in srgb, var(--fg) 50%, transparent)" }}>
                <Phone size={11} /> +252 61 4272760
              </a>
              <p className="flex items-center gap-2 text-xs" style={{ color: "color-mix(in srgb, var(--fg) 50%, transparent)" }}>
                <MapPin size={11} /> KM5 Zoobe, Mogadishu
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs order-2 sm:order-1" style={{ color: "color-mix(in srgb, var(--fg) 30%, transparent)" }}>
            © 2026 Nuun Media. All rights reserved.
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            {socials.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 hover:text-[#FFD400] hover:bg-[#FFD400]/10"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "color-mix(in srgb, var(--fg) 50%, transparent)",
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
