"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUpRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function Footer() {
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
    <footer className="relative bg-[#0A0A0A] border-t border-white/[0.06] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#FFD400]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-[#FFD400] rounded-lg rotate-45 group-hover:rotate-[135deg] transition-transform duration-500" />
                <div className="absolute inset-1 bg-[#0A0A0A] rounded-sm rotate-45" />
                <span className="absolute inset-0 flex items-center justify-center text-[#FFD400] font-black text-sm z-10">N</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                NUUN <span className="text-[#FFD400]">MEDIA</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm">
              A next-generation creative and media company operating at the intersection of creativity, technology, and digital transformation.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-white/70 text-sm font-medium mb-3">Stay updated</p>
              {subscribed ? (
                <p className="text-[#FFD400] text-sm">Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FFD400]/50"
                  />
                  <Button size="sm" type="submit" className="text-xs px-4">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-6 tracking-wider uppercase">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5 group">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-6 tracking-wider uppercase">Resources</h4>
            <ul className="space-y-3 mb-8">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/50 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1.5 group">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="space-y-2">
              <a href="mailto:info@nuun.so" className="flex items-center gap-2 text-white/50 hover:text-[#FFD400] text-xs transition-colors">
                <Mail size={12} /> info@nuun.so
              </a>
              <a href="tel:+252614272760" className="flex items-center gap-2 text-white/50 hover:text-[#FFD400] text-xs transition-colors">
                <Phone size={12} /> +252 61 4272760
              </a>
              <p className="flex items-center gap-2 text-white/50 text-xs">
                <MapPin size={12} /> KM5 Zoobe, Mogadishu
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © 2026 Nuun Media. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[
              { label: "IG", href: "#" },
              { label: "TW", href: "#" },
              { label: "LI", href: "#" },
              { label: "FB", href: "#" },
            ].map(({ label, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-[#FFD400] hover:bg-[#FFD400]/10 hover:border-[#FFD400]/20 transition-all duration-200 text-xs font-bold"
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
