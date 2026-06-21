"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/journey", label: "Journey" },
  { href: "/coach", label: "AI Coach" },
  { href: "/leaderboard", label: "Leaderboard" },
] as const;

/**
 * Fixed navigation bar with active section highlighting and logo.
 */
export function NavBar() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-black/40 backdrop-blur-[20px]">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/disha-logo.svg" alt="Disha logo" width={32} height={32} priority />
          <span className="text-sm font-semibold tracking-[0.12em] text-text-primary uppercase">
            Disha
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary",
                  isActive && "text-text-primary",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && !prefersReducedMotion ? (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                ) : null}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent sm:flex">
            <Leaf size={14} />
            <span>Live</span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full border border-accent/40 bg-surface text-sm font-semibold text-text-primary shadow-[0_0_0_3px_rgba(34,197,94,0.12)]">
            TS
          </div>
        </div>
      </div>
    </header>
  );
}
