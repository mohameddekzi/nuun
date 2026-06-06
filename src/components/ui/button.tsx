"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  magnetic?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "relative inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 overflow-hidden cursor-pointer select-none";

    const variants = {
      primary:
        "bg-[#FFD400] text-[#0A0A0A] hover:bg-[#E5BC00] hover:shadow-[0_0_30px_rgba(255,212,0,0.4)] active:scale-95",
      secondary:
        "bg-white/10 text-white border border-white/10 hover:bg-white/15 hover:border-white/20 backdrop-blur-sm",
      outline:
        "bg-transparent text-[#FFD400] border border-[#FFD400] hover:bg-[#FFD400] hover:text-[#0A0A0A]",
      ghost:
        "bg-transparent text-white hover:bg-white/8",
      danger:
        "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      sm: "h-8 px-4 text-sm rounded-md gap-1.5",
      md: "h-11 px-6 text-sm rounded-lg gap-2",
      lg: "h-13 px-8 text-base rounded-xl gap-2.5",
      xl: "h-16 px-10 text-lg rounded-2xl gap-3",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], (disabled || loading) && "opacity-50 cursor-not-allowed", className)}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
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
