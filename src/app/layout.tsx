import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
