import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover, glow }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white/[0.03] border border-white/[0.08] rounded-2xl",
        hover && "transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] hover:-translate-y-1 cursor-pointer",
        glow && "hover:shadow-[0_0_40px_rgba(255,212,0,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6 pb-0", className)}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6 pt-0 border-t border-white/[0.06]", className)}>{children}</div>;
}
