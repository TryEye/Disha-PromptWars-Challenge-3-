"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  color?: "accent" | "accentDim" | "muted";
  animated?: boolean;
  label?: string;
  showPercent?: boolean;
  className?: string;
}

const COLOR_MAP = {
  accent: "bg-accent shadow-[0_0_16px_rgba(34,197,94,0.4)]",
  accentDim: "bg-accent-dim shadow-[0_0_16px_rgba(22,163,74,0.35)]",
  muted: "bg-white/35 shadow-[0_0_16px_rgba(255,255,255,0.2)]",
} as const;

/**
 * Accessible animated progress bar with a glowing leading edge.
 */
export function ProgressBar({
  value,
  color = "accent",
  animated = true,
  label,
  showPercent = true,
  className,
}: ProgressBarProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const resolvedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted">
          <span>{label}</span>
          {showPercent ? (
            <span className="text-accent">{resolvedValue.toFixed(0)}%</span>
          ) : null}
        </div>
      ) : null}

      <ProgressPrimitive.Root
        className="relative h-2 overflow-hidden rounded-full bg-white/8"
        value={resolvedValue}
        max={100}
        aria-label={label}
      >
        <motion.div
          className={cn("relative h-full origin-left rounded-full", COLOR_MAP[color])}
          initial={animated && !prefersReducedMotion ? { scaleX: 0 } : false}
          animate={{ scaleX: resolvedValue / 100 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.85,
            ease: "easeOut",
          }}
        >
          <span className="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
        </motion.div>
      </ProgressPrimitive.Root>
    </div>
  );
}

