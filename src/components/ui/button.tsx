"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "relative inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 overflow-hidden select-none cursor-pointer shrink-0";

    const variants: Record<string, string> = {
      primary:
        "bg-[#FFD400] text-[#0A0A0A] hover:bg-[#FFDF33] active:scale-95 shadow-[0_0_0_0_rgba(255,212,0,0)] hover:shadow-[0_0_28px_rgba(255,212,0,0.35)]",
      secondary:
        "bg-white/[0.08] text-white border border-white/[0.12] hover:bg-white/[0.14] hover:border-white/[0.22] backdrop-blur-sm",
      outline:
        "bg-transparent text-[#FFD400] border border-[#FFD400]/50 hover:bg-[#FFD400] hover:text-[#0A0A0A] hover:border-[#FFD400]",
      ghost:
        "bg-transparent text-white/70 hover:text-white hover:bg-white/[0.07]",
      danger:
        "bg-red-600/90 text-white border border-red-500/30 hover:bg-red-600",
    };

    const sizes: Record<string, string> = {
      xs:  "h-7 px-3 text-xs rounded-lg gap-1.5",
      sm:  "h-9 px-4 text-sm rounded-xl gap-1.5",
      md:  "h-11 px-6 text-sm rounded-xl gap-2",
      lg:  "h-12 px-7 text-base rounded-2xl gap-2",
      xl:  "h-14 px-9 text-base rounded-2xl gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          base,
          variants[variant],
          sizes[size],
          (disabled || loading) && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
