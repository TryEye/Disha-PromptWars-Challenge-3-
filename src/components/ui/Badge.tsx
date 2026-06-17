"use client";

import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "info" | "default";
  className?: string;
}

const VARIANT_MAP = {
  success: "border-accent/20 bg-accent/10 text-accent",
  warning: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  info: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  default: "border-white/10 bg-white/5 text-text-secondary",
} as const;

/**
 * Rounded status badge for small labels and metrics.
 */
export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none",
        VARIANT_MAP[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

