"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300",
        "border border-current/10 hover:scale-105",
        isDark
          ? "bg-white/[0.07] text-white/60 hover:text-white hover:bg-white/[0.12]"
          : "bg-black/[0.05] text-black/50 hover:text-black hover:bg-black/[0.1]",
        className
      )}
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
