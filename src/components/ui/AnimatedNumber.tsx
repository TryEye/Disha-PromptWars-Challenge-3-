"use client";

import * as React from "react";

export interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
}

/**
 * Smoothly animates a numeric value using requestAnimationFrame.
 */
export function AnimatedNumber({
  value,
  duration = 1200,
  decimals = 0,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let frame = 0;
    const start = performance.now();

    const tick = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(value * eased);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      setDisplayValue(0);
    };
  }, [decimals, duration, value]);

  return (
    <span className={className}>
      {new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(displayValue)}
    </span>
  );
}
