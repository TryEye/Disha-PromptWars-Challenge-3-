"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Crown, Search, Trophy } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type TabKey = "friends" | "college" | "city";

interface LeaderboardEntry {
  rank: number;
  name: string;
  savedKg: number;
  points: number;
}

interface TabConfig {
  label: string;
  entries: LeaderboardEntry[];
}

const TAB_DATA: Record<TabKey, TabConfig> = {
  friends: {
    label: "Friends",
    entries: [
      { rank: 1, name: "Aarav Mehta", savedKg: 28.4, points: 1280 },
      { rank: 2, name: "Riya Nair", savedKg: 24.1, points: 1234 },
      { rank: 3, name: "Tanishk Sharma", savedKg: 21.6, points: 1198 },
      { rank: 4, name: "Kabir Sethi", savedKg: 19.8, points: 1154 },
      { rank: 5, name: "Ananya Iyer", savedKg: 18.2, points: 1128 },
      { rank: 6, name: "Meera Joshi", savedKg: 16.9, points: 1092 },
      { rank: 7, name: "Ishaan Verma", savedKg: 15.5, points: 1068 },
      { rank: 8, name: "Priya Kulkarni", savedKg: 14.8, points: 1041 },
      { rank: 9, name: "Vihaan Chawla", savedKg: 13.7, points: 1014 },
      { rank: 10, name: "Sana Khan", savedKg: 12.9, points: 992 },
    ],
  },
  college: {
    label: "College",
    entries: [
      { rank: 1, name: "North Block", savedKg: 32.1, points: 1360 },
      { rank: 2, name: "Green House", savedKg: 29.6, points: 1314 },
      { rank: 3, name: "Tanishk Sharma", savedKg: 26.4, points: 1278 },
      { rank: 4, name: "Aarav Mehta", savedKg: 23.3, points: 1210 },
      { rank: 5, name: "Ananya Iyer", savedKg: 21.7, points: 1185 },
      { rank: 6, name: "Riya Nair", savedKg: 20.4, points: 1164 },
      { rank: 7, name: "Kabir Sethi", savedKg: 18.9, points: 1136 },
      { rank: 8, name: "Priya Kulkarni", savedKg: 17.5, points: 1108 },
      { rank: 9, name: "Ishaan Verma", savedKg: 16.8, points: 1077 },
      { rank: 10, name: "Meera Joshi", savedKg: 15.2, points: 1048 },
    ],
  },
  city: {
    label: "City",
    entries: [
      { rank: 1, name: "Pune Metro Circle", savedKg: 39.2, points: 1440 },
      { rank: 2, name: "Mumbai Clean Walkers", savedKg: 35.7, points: 1398 },
      { rank: 3, name: "Tanishk Sharma", savedKg: 30.1, points: 1332 },
      { rank: 4, name: "Aditi Rao", savedKg: 27.4, points: 1288 },
      { rank: 5, name: "Arjun Bhatt", savedKg: 25.8, points: 1251 },
      { rank: 6, name: "Sneha Kapoor", savedKg: 23.9, points: 1220 },
      { rank: 7, name: "Nikhil Desai", savedKg: 22.3, points: 1196 },
      { rank: 8, name: "Pooja Menon", savedKg: 20.5, points: 1161 },
      { rank: 9, name: "Karan Patel", savedKg: 19.1, points: 1138 },
      { rank: 10, name: "Simran Bedi", savedKg: 17.8, points: 1112 },
    ],
  },
} as const;

const TAB_ORDER: TabKey[] = ["friends", "college", "city"];

const pageVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
} as const;

/**
 * Community leaderboard with animated tabs, podium, and ranked list.
 */
export default function LeaderboardPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [activeTab, setActiveTab] = React.useState<TabKey>("friends");
  const [searchTerm, setSearchTerm] = React.useState("");
  const deferredSearchTerm = React.useDeferredValue(searchTerm);

  const entries = TAB_DATA[activeTab].entries;
  const filteredEntries = entries.filter((entry) =>
    entry.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()),
  );
  const podiumEntries = filteredEntries.slice(0, 3);
  const rankedEntries = filteredEntries.slice(3);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={pageVariants}
      className="space-y-6"
    >
      <section className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Community Leaderboard
        </p>
        <h1 className="text-[32px] font-bold leading-tight text-text-primary">
          Compete with friends, college, and city leaders.
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-text-secondary">
          Track weekly carbon savings and see where Disha puts your habits on the board.
        </p>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        <label className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 sm:w-auto">
          <Search size={16} className="text-text-muted" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search names"
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {podiumEntries.map((entry, index) => (
          <motion.article
            key={entry.name}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 20,
              delay: index * 0.08,
            }}
            className={cn(
              index === 0 && "lg:order-2",
              index === 1 && "lg:order-1 lg:translate-y-4",
              index === 2 && "lg:order-3 lg:translate-y-8",
            )}
          >
            <PodiumCard entry={entry} rankLabel={index === 0 ? "1st" : index === 1 ? "2nd" : "3rd"} />
          </motion.article>
        ))}
      </section>

      <Card className="border-accent/20 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
              Your Position
            </p>
            <h2 className="mt-2 text-lg font-semibold text-text-primary">
              Tanishk Sharma
            </h2>
          </div>
          <Badge variant="success">Rank 3</Badge>
        </div>
        <div className="rounded-xl border-l-2 border-l-accent bg-accent/10 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-text-primary">
              21.6 kg saved this week
            </p>
            <p className="text-sm font-semibold text-accent">1,198 pts</p>
          </div>
        </div>
      </Card>

      <section className="space-y-3">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
          Ranked List
        </h2>

        <div className="space-y-3">
          {rankedEntries.map((entry) => (
            <RankRow key={entry.name} entry={entry} />
          ))}
        </div>
      </section>

      {filteredEntries.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-sm font-semibold text-text-primary">No results found</p>
          <p className="mt-2 text-sm text-text-secondary">Try a different name or switch tabs.</p>
        </Card>
      ) : null}
    </motion.div>
  );
}

/**
 * Segmented control with an animated active indicator.
 */
function Tabs({
  activeTab,
  onChange,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
      {TAB_ORDER.map((tab) => {
        const isActive = tab === activeTab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium transition",
              isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="leaderboard-tabs-indicator"
                className="absolute inset-0 rounded-full bg-accent/15"
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              />
            ) : null}
            <span className="relative">{TAB_DATA[tab].label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Featured podium card for the top three positions.
 */
function PodiumCard({
  entry,
  rankLabel,
}: {
  entry: LeaderboardEntry;
  rankLabel: string;
}) {
  const isYou = entry.name === "Tanishk Sharma";

  return (
    <Card glow className={cn("h-full p-5", isYou && "border-l-2 border-l-accent")}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={entry.name} size="lg" />
            <div>
              <p className="text-sm font-semibold text-text-primary">{entry.name}</p>
              <p className="text-xs text-text-secondary">{rankLabel} place</p>
            </div>
          </div>
          {entry.rank === 1 ? <Crown className="text-accent" size={20} /> : null}
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
            Weekly CO2 Saved
          </p>
          <p className="text-[28px] font-bold leading-none text-text-primary">
            {entry.savedKg.toFixed(1)} kg
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={isYou ? "success" : "default"}>{isYou ? "You" : `Rank ${entry.rank}`}</Badge>
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Trophy size={16} className="text-accent" />
            {entry.points} pts
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Ranked row for positions four through ten.
 */
function RankRow({ entry }: { entry: LeaderboardEntry }) {
  const isYou = entry.name === "Tanishk Sharma";

  return (
    <Card hover className={cn("group p-0", isYou && "border-l-2 border-l-accent")}>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-text-primary">
            {entry.rank}
          </div>
          <Avatar name={entry.name} />
          <div>
            <p className="text-sm font-semibold text-text-primary">{entry.name}</p>
            <p className="text-xs text-text-secondary">
              {entry.savedKg.toFixed(1)} kg saved this week
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-text-primary">{entry.points} pts</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-text-muted">Score</p>
          </div>

          <button
            type="button"
            className="translate-x-3 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          >
            Challenge
          </button>
        </div>
      </div>
    </Card>
  );
}

/**
 * Circular avatar with initials derived from the member name.
 */
function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "lg" }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border border-accent/20 bg-[linear-gradient(135deg,rgba(34,197,94,0.2),rgba(17,25,20,0.9))] font-semibold text-text-primary",
        size === "lg" ? "size-14 text-sm" : "size-10 text-xs",
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
