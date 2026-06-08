"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface ClientCompany {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string | null;
}

interface ClientsSectionProps {
  clients: ClientCompany[];
}

export function ClientsSection({ clients }: ClientsSectionProps) {
  if (!clients.length) return null;

  return (
    <section className="relative py-14 sm:py-16 overflow-hidden" style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

      <div className="relative section-inner">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "color-mix(in srgb, var(--fg) 30%, transparent)" }}>
            Trusted By
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 lg:gap-14">
          {clients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              {client.website_url ? (
                <Link href={client.website_url} target="_blank" rel="noopener noreferrer" className="block group">
                  <ClientLogo client={client} />
                </Link>
              ) : (
                <ClientLogo client={client} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClientLogo({ client }: { client: ClientCompany }) {
  return (
    <div
      className="flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 hover:opacity-100"
      style={{ opacity: 0.5 }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
      title={client.name}
    >
      {client.logo_url ? (
        <Image
          src={client.logo_url}
          alt={client.name}
          width={120}
          height={40}
          className="h-8 sm:h-10 w-auto object-contain"
          unoptimized
        />
      ) : (
        <span className="text-sm font-semibold" style={{ color: "var(--fg)" }}>{client.name}</span>
      )}
    </div>
  );
}
