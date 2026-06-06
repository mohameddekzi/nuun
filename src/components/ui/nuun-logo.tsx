"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export const NUUN_LOGO_PATH =
  "M 35 162 C 28 92 22 34 50 36 C 78 38 128 162 158 162 C 188 162 252 38 268 36";

interface NuunLogoMarkProps {
  height?: number;
  color?: string;
  animated?: boolean;
  delay?: number;
  className?: string;
}

export function NuunLogoMark({
  height = 32,
  color = "#FFD400",
  animated = false,
  delay = 0,
  className,
}: NuunLogoMarkProps) {
  const width = Math.round(height * (300 / 190));

  return (
    <svg
      viewBox="0 0 300 190"
      width={width}
      height={height}
      fill="none"
      className={cn("flex-shrink-0", className)}
    >
      {animated ? (
        <motion.path
          d={NUUN_LOGO_PATH}
          stroke={color}
          strokeWidth="32"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 2.2, ease: [0.16, 1, 0.3, 1], delay },
            opacity: { duration: 0.4, delay },
          }}
        />
      ) : (
        <path
          d={NUUN_LOGO_PATH}
          stroke={color}
          strokeWidth="32"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}
