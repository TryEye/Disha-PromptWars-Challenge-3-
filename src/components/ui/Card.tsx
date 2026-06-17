"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
}

/**
 * Dark glass card primitive used across dashboard sections.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  function Card({ children, className, hover = false, glow = false, ...props }, ref) {
    const prefersReducedMotion = useReducedMotion() ?? false;
    const whileHover = hover && !prefersReducedMotion ? { scale: 1.02 } : undefined;

    return (
      <motion.div
        ref={ref}
        whileHover={whileHover}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
        }}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border bg-surface p-5 text-text-primary backdrop-blur-xl",
          hover && "transition-colors",
          hover && !prefersReducedMotion && "hover:border-accent/40 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.15),0_18px_60px_rgba(34,197,94,0.08)]",
          glow &&
            "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_58%)] before:content-['']",
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
