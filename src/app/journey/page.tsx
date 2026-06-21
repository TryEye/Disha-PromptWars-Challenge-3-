"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bike,
  BusFront,
  CarFront,
  Clock3,
  Footprints,
  Plus,
  TrainFront,
  X,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type TransportMode = "walk" | "cycle" | "bus" | "metro" | "car" | "auto";

interface Trip {
  id: number;
  from: string;
  to: string;
  mode: TransportMode;
  distance: number;
  delta: number;
  time: string;
}

interface TripFormState {
  from: string;
  to: string;
  distance: string;
  mode: TransportMode;
}

interface ModeOption {
  id: TransportMode;
  label: string;
  icon: LucideIcon;
}

const MODE_OPTIONS: ModeOption[] = [
  { id: "walk", label: "Walk", icon: Footprints },
  { id: "cycle", label: "Cycle", icon: Bike },
  { id: "bus", label: "Bus", icon: BusFront },
  { id: "metro", label: "Metro", icon: TrainFront },
  { id: "car", label: "Car", icon: CarFront },
  { id: "auto", label: "Auto", icon: CarFront },
];

const MODE_FACTOR: Record<TransportMode, number> = {
  walk: -0.35,
  cycle: -0.25,
  bus: -0.12,
  metro: -0.2,
  car: 0.22,
  auto: 0.26,
};

const INITIAL_TRIPS: Trip[] = [
  {
    id: 1,
    from: "Home",
    to: "College",
    mode: "walk",
    distance: 2.3,
    delta: -0.8,
    time: "7:20 AM",
  },
  {
    id: 2,
    from: "College",
    to: "Cafe",
    mode: "auto",
    distance: 1.2,
    delta: 0.3,
    time: "1:10 PM",
  },
  {
    id: 3,
    from: "Cafe",
    to: "Library",
    mode: "cycle",
    distance: 0.8,
    delta: -0.2,
    time: "4:05 PM",
  },
];

const tripVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
} as const;

/**
 * Journey logging page with animated trip capture and summary tracking.
 */
export default function JourneyPage() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [trips, setTrips] = React.useState<Trip[]>(INITIAL_TRIPS);
  const [selectedMode, setSelectedMode] = React.useState<TransportMode>("walk");
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [form, setForm] = React.useState<TripFormState>({
    from: "",
    to: "",
    distance: "",
    mode: "walk",
  });

  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const summary = trips.reduce(
    (accumulator, trip) => {
      accumulator.distance += trip.distance;
      if (trip.delta < 0) {
        accumulator.saved += Math.abs(trip.delta);
      }
      return accumulator;
    },
    { saved: 0, distance: 0 },
  );

  const addTrip = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedDistance = Number.parseFloat(form.distance);

    if (!form.from.trim() || !form.to.trim() || Number.isNaN(parsedDistance) || parsedDistance <= 0) {
      return;
    }

    const estimate = Number((parsedDistance * MODE_FACTOR[form.mode]).toFixed(1));
    const time = new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());

    const nextTrip: Trip = {
      id: Date.now(),
      from: form.from.trim(),
      to: form.to.trim(),
      mode: form.mode,
      distance: Number(parsedDistance.toFixed(1)),
      delta: estimate,
      time,
    };

    setTrips((currentTrips) => [nextTrip, ...currentTrips]);
    setIsDrawerOpen(false);
    setForm({
      from: "",
      to: "",
      distance: "",
      mode: form.mode,
    });
  };

  const openDrawer = () => {
    setForm({
      from: "",
      to: "",
      distance: "",
      mode: selectedMode,
    });
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            {today}
          </p>
          <h1 className="text-[32px] font-bold leading-tight text-text-primary">
            Today&apos;s Journey
          </h1>
          <p className="max-w-xl text-sm leading-6 text-text-secondary">
            Log each trip, track what you saved, and keep the day moving with low-carbon choices.
          </p>
        </div>

        <button
          type="button"
          onClick={openDrawer}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-background transition hover:bg-accentDim"
        >
          <Plus size={16} />
          Add Trip
        </button>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
            Transport Mode
          </h2>
          <p className="text-[11px] font-medium text-text-muted">Pick the mode you used today</p>
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Transport mode selector"
        >
          {MODE_OPTIONS.map((mode) => {
            const Icon = mode.icon;
            const isActive = selectedMode === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setSelectedMode(mode.id);
                  setForm((current) => ({ ...current, mode: mode.id }));
                }}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "border-accent bg-accent text-background"
                    : "border-white/10 bg-white/4 text-text-secondary hover:border-accent/30 hover:text-text-primary",
                )}
              >
                <Icon size={15} />
                {mode.label}
              </button>
            );
          })}
        </div>
      </section>

      <motion.ul
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : 0.08,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {trips.map((trip) => (
          <motion.li key={trip.id} variants={tripVariants} layout>
            <TripCard trip={trip} />
          </motion.li>
        ))}
      </motion.ul>

      <div className="sticky bottom-4 z-20">
        <Card className="border-accent/20 bg-[linear-gradient(180deg,rgba(34,197,94,0.12),rgba(17,25,20,0.96))] p-4">
          <div className="grid grid-cols-3 gap-3">
            <SummaryMetric label="Saved Today" value={`${summary.saved.toFixed(1)} kg`} />
            <SummaryMetric label="Distance" value={`${summary.distance.toFixed(1)} km`} />
            <SummaryMetric label="Trips" value={`${trips.length}`} />
          </div>
        </Card>
      </div>

      <AnimatePresence>
        {isDrawerOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-4 py-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
          >
            <motion.div
              initial={prefersReducedMotion ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={prefersReducedMotion ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-lg"
              onClick={(event) => event.stopPropagation()}
            >
              <Card className="p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
                      Add Trip
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-text-primary">
                      Capture a new journey
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-secondary transition hover:text-text-primary"
                    aria-label="Close add trip form"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={addTrip}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="From"
                      value={form.from}
                      placeholder="Home"
                      onChange={(value) => setForm((current) => ({ ...current, from: value }))}
                    />
                    <Field
                      label="To"
                      value={form.to}
                      placeholder="College"
                      onChange={(value) => setForm((current) => ({ ...current, to: value }))}
                    />
                  </div>

                  <Field
                    label="Distance"
                    value={form.distance}
                    placeholder="2.4"
                    type="number"
                    inputMode="decimal"
                    onChange={(value) => setForm((current) => ({ ...current, distance: value }))}
                    suffix="km"
                  />

                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
                      Transport Mode
                    </p>
                    <div
                      className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      aria-label="Trip mode selector"
                    >
                      {MODE_OPTIONS.map((mode) => {
                        const Icon = mode.icon;
                        const isActive = form.mode === mode.id;

                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => {
                              setSelectedMode(mode.id);
                              setForm((current) => ({ ...current, mode: mode.id }));
                            }}
                            aria-pressed={isActive}
                            className={cn(
                              "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                              isActive
                                ? "border-accent bg-accent text-background"
                                : "border-white/10 bg-white/4 text-text-secondary hover:border-accent/30 hover:text-text-primary",
                            )}
                          >
                            <Icon size={15} />
                            {mode.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex h-11 flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-text-primary transition hover:border-white/20"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex h-11 flex-1 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-background transition hover:bg-accentDim"
                    >
                      Save Trip
                    </button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * Displays one journey card with route, mode, distance, and carbon delta.
 */
function TripCard({ trip }: { trip: Trip }) {
  const Icon = MODE_OPTIONS.find((mode) => mode.id === trip.mode)?.icon ?? Footprints;
  const isSaved = trip.delta < 0;

  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl border",
              isSaved ? "border-accent/20 bg-accent/10 text-accent" : "border-amber-400/20 bg-amber-400/10 text-amber-300",
            )}
          >
            <Icon size={18} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
              <span>{trip.from}</span>
              <ArrowRight size={14} className="text-text-muted" />
              <span>{trip.to}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">
                {trip.distance.toFixed(1)} km
              </Badge>
              <Badge variant={isSaved ? "success" : "warning"}>
                {isSaved ? `-${Math.abs(trip.delta).toFixed(1)} kg CO2` : `+${trip.delta.toFixed(1)} kg CO2`}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
          <Clock3 size={14} />
          {trip.time}
        </div>
      </div>
    </Card>
  );
}

/**
 * Small summary metric used in the sticky footer.
 */
function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/30 px-3 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}

/**
 * Labeled input control for the journey drawer.
 */
function Field({
  label,
  value,
  onChange,
  placeholder,
  suffix,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suffix?: string;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">
        {label}
      </span>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-accent/40">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
        />
        {suffix ? <span className="text-xs font-medium text-text-muted">{suffix}</span> : null}
      </div>
    </label>
  );
}
