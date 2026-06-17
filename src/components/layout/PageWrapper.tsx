"use client";

import * as React from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export interface PageWrapperProps {
  children: React.ReactNode;
}

/**
 * Page transition shell that keeps route changes smooth and accessible.
 */
export function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" }}
          className="mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </MotionConfig>
  );
}

