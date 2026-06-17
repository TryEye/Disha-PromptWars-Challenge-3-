"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CarFront,
  Footprints,
  Gauge,
  Leaf,
  MapPinned,
  Route,
  Sparkles,
  Trophy,
  Trees,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/utils";

const heroLines = [
  "Good evening, Tanishk",
  "Your footprint is trending lower than last week.",
  "Walking and pooled travel are doing the heavy lifting today.",
] as const;

const statCards = [
  {
    label: "Carbon Saved",
    value: 2.4,
    unit: "kg",
    icon: <Leaf size={18} />,
    color: "success" as const,
  },
  {
    label: "Distance Walked",
    value: 3.2,
    unit: "km",
    icon: <Footprints size={18} />,
    color: "accent" as const,
  },
  {
    label: "Streak",
    value: 5,
    unit: "days",
    icon: <Trees size={18} />,
    color: "dim" as const,
  },
  {
    label: "Impact Score",
    value: 847,
    unit: "pts",
    icon: <Trophy size={18} />,
    color: "neutral" as const,
  },
];

const quickActions = [
  {
    icon: Route,
    label: "Log Journey",
    subtitle: "Capture a commute in seconds",
  },
  {
    icon: Gauge,
    label: "AI Coach",
    subtitle: "Get a better route before you leave",
  },
  {
    icon: Sparkles,
    label: "Impact Sim",
    subtitle: "Model campus-wide savings",
  },
  {
    icon: Trophy,
    label: "Leaderboard",
    subtitle: "See where your habits rank",
  },
] as const;

const routeCards = [
  {
    from: "Home",
    to: "College",
    mode: "Walk",
    modeIcon: Footprints,
    distance: "2.3 km",
    delta: "-0.8 kg CO2",
    deltaVariant: "success" as const,
  },
  {
    from: "College",
    to: "Cafe",
    mode: "Shared cab",
    modeIcon: CarFront,
    distance: "4.1 km",
    delta: "+0.2 kg CO2",
    deltaVariant: "warning" as const,
  },
] as const;

const leaderboardRows = [
  { rank: 1, name: "Green House", score: 1240 },
  { rank: 2, name: "North Block", score: 1185 },
  { rank: 3, name: "Your Circle", score: 847 },
] as const;

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
} as const;

/**
 * Production dashboard for the Disha carbon footprint PWA.
 */
export default function Home() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-6">
      <section
        id="dashboard"
        className="relative overflow-hidden rounded-[24px] border border-white/7 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute left-[-6rem] top-[-4rem] size-64 rounded-full bg-accent/20 blur-3xl opacity-20" />
        <div className="relative space-y-3">
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, delay: 0 }}
            className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent"
          >
            {today}
          </motion.p>
          <motion.h1
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: 0.1 }}
            className="max-w-2xl text-[32px] font-bold leading-tight tracking-normal text-text-primary sm:text-[38px]"
          >
            {heroLines[0]}
          </motion.h1>
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: 0.2 }}
            className="max-w-2xl text-sm leading-6 text-text-secondary sm:text-base"
          >
            {heroLines[1]} {heroLines[2]}
          </motion.p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          <Card glow className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                <Leaf size={20} />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
                  Daily Highlight
                </p>
                <h2 className="text-[1.375rem] font-semibold leading-snug text-text-primary">
                  You saved 2.4 kg CO2 today.
                </h2>
                <p className="text-sm leading-6 italic text-text-secondary">
                  Equivalent to 3 smartphones off charge for a year.
                </p>
              </div>
            </div>
            <ProgressBar
              className="mt-5"
              value={62}
              animated
              label="Daily goal"
              showPercent
            />
          </Card>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {statCards.map((card) => (
              <StatCard
                key={card.label}
                label={card.label}
                value={card.value}
                unit={card.unit}
                icon={card.icon}
                color={card.color}
              />
            ))}
          </motion.div>
        </div>

        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
              Quick Actions
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {quickActions.map((action) => {
                const ActionIcon = action.icon;

                return (
                  <Card
                    key={action.label}
                    hover
                    glow
                    variants={itemVariants}
                    className="p-0"
                  >
                    <button
                      type="button"
                      className="group flex h-full w-full flex-col justify-between gap-10 rounded-xl p-5 text-left"
                    >
                      <div className="flex items-start justify-between">
                        <ActionIcon className="text-accent" size={20} />
                        <ArrowRight className="text-text-muted transition-transform duration-300 group-hover:rotate-45 group-hover:text-accent" size={18} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-text-primary">
                          {action.label}
                        </p>
                        <p className="text-xs leading-5 text-text-secondary">
                          {action.subtitle}
                        </p>
                      </div>
                    </button>
                  </Card>
                );
              })}
            </motion.div>
          </section>

          <Card glow id="coach" className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
                  Impact Simulator
                </p>
                <h2 className="max-w-lg text-[1.375rem] font-semibold leading-snug text-text-primary">
                  What if your college copied your habits?
                </h2>
              </div>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                <MapPinned size={20} />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="success">1.2 t CO2</Badge>
              <Badge variant="info">550 trees</Badge>
              <Badge variant="warning">11% AQI</Badge>
            </div>

            <button
              type="button"
              className="group relative mt-5 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-accent px-4 text-sm font-semibold text-background transition-colors hover:bg-accentDim"
            >
              <span className="absolute inset-y-0 left-[-35%] w-1/3 translate-x-[-140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-[420%] group-hover:opacity-100" />
              <span className="relative inline-flex items-center gap-2">
                Run simulation
                <ArrowRight size={16} />
              </span>
            </button>
          </Card>

          <Card id="leaderboard" className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
                  Leaderboard
                </p>
                <h2 className="mt-2 text-lg font-semibold text-text-primary">
                  Campus momentum this week
                </h2>
              </div>
              <Trophy className="text-accent" size={20} />
            </div>

            <div className="mt-5 space-y-3">
              {leaderboardRows.map((row) => (
                <div
                  key={row.rank}
                  className={cn(
                    "flex items-center justify-between rounded-xl border border-white/8 bg-white/4 px-4 py-3",
                    row.rank === 3 && "border-accent/20 bg-accent/8",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-text-primary">
                      {row.rank}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {row.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Weekly carbon score
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">
                      <AnimatedNumber value={row.score} />
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-text-muted">
                      pts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <section id="journey" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
              Today&apos;s Journey Preview
            </p>
            <h2 className="text-[1.375rem] font-semibold leading-snug text-text-primary">
              Route snapshots with estimated carbon impact
            </h2>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4"
        >
          {routeCards.map((route) => {
            const ModeIcon = route.modeIcon;

            return (
              <motion.article
                key={`${route.from}-${route.to}`}
                variants={{
                  hidden: { opacity: 0, x: -24 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: prefersReducedMotion ? 0 : 0.35,
                      ease: "easeOut",
                    },
                  },
                }}
              >
                <Card hover className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                          <ModeIcon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            {route.from} to {route.to}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {route.mode}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default">{route.distance}</Badge>
                        <Badge variant={route.deltaVariant}>{route.delta}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-text-muted">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                        View
                      </span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Card>
              </motion.article>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
