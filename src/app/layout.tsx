import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nuun Media — From Vision to Reality",
    template: "%s | Nuun Media",
  },
  description:
    "A next-generation creative and media company operating at the intersection of creativity, technology, and digital transformation. Based in Mogadishu, Somalia.",
  keywords: ["creative agency", "media production", "brand identity", "Somalia", "digital transformation"],
  authors: [{ name: "Nuun Media" }],
  creator: "Nuun Media",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nuun Media",
    title: "Nuun Media — From Vision to Reality",
    description: "A next-generation creative and media company.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuun Media — From Vision to Reality",
    description: "A next-generation creative and media company.",
  },
  robots: { index: true, follow: true },
};

async function getSiteTheme(): Promise<string> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.from("settings").select("value").eq("key", "theme_default").single();
    if (data?.value && typeof data.value === "string") return data.value;
    return "dark";
  } catch {
    return "dark";
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const defaultTheme = await getSiteTheme();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased">
        <ThemeProvider defaultTheme={defaultTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
