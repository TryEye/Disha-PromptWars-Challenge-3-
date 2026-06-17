"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  color?: "accent" | "success" | "dim" | "neutral";
  className?: string;
}

const COLOR_MAP = {
  accent: "text-accent bg-accent/10 border-accent/20",
  success: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  dim: "text-lime-300 bg-lime-400/10 border-lime-400/20",
  neutral: "text-white/80 bg-white/5 border-white/10",
} as const;

/**
 * Animated metric tile with a viewport-triggered counter.
 */
export function StatCard({
  label,
  value,
  unit,
  icon,
  color = "accent",
  className,
}: StatCardProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [count, setCount] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = React.useRef(false);

  React.useEffect(() => {
    const element = rootRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (!isVisible || hasAnimatedRef.current) {
      return;
    }

    hasAnimatedRef.current = true;

    if (prefersReducedMotion) {
      const frame = window.requestAnimationFrame(() => {
        setCount(value);
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    let frame = 0;
    const start = performance.now();
    const duration = 1200;

    const step = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(value * eased);

      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isVisible, prefersReducedMotion, value]);

  const decimals = Number.isInteger(value) ? 0 : 1;
  const displayedValue = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(count);

  return (
    <motion.div
      ref={rootRef}
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: prefersReducedMotion ? 0 : 0.4,
            ease: "easeOut",
          },
        },
      }}
      className={className}
    >
      <Card className="h-full" glow>
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-lg border",
                COLOR_MAP[color],
              )}
            >
              {icon}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-text-muted">
              {label}
            </span>
          </div>

          <div>
            <p className="text-[28px] font-bold leading-none tracking-normal text-text-primary">
              {displayedValue}
              <span className="ml-1 text-sm font-semibold text-text-secondary">
                {unit}
              </span>
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
