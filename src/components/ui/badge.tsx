import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline" | "ghost";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-white/70 border border-white/10",
    accent: "bg-[#FFD400]/15 text-[#FFD400] border border-[#FFD400]/20",
    outline: "bg-transparent text-white/60 border border-white/20",
    ghost: "bg-white/5 text-white/50",
  };
  return (
    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase", variants[variant], className)}>
      {children}
    </span>
  );
}
