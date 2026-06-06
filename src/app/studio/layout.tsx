import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "NUUN Studio",
    template: "%s | NUUN Studio",
  },
  description: "NUUN Media Content Management System",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0A0A0A]">{children}</div>;
}
