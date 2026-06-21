import { Card } from "@/components/ui/Card";

/**
 * Loading skeleton for the Leaderboard page.
 */
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-40 rounded-full bg-white/8" />
        <div className="h-9 w-full max-w-2xl rounded-full bg-white/8" />
        <div className="h-4 w-full max-w-xl rounded-full bg-white/8" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <div className="h-11 w-28 rounded-full bg-white/8" />
          <div className="h-11 w-28 rounded-full bg-white/8" />
          <div className="h-11 w-24 rounded-full bg-white/8" />
        </div>
        <div className="h-12 w-full max-w-sm rounded-xl bg-white/8" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-5">
            <div className="space-y-4">
              <div className="h-14 w-14 rounded-full bg-white/8" />
              <div className="h-4 w-36 rounded-full bg-white/8" />
              <div className="h-9 w-24 rounded-full bg-white/8" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-16 rounded-xl bg-white/8" />
          ))}
        </div>
      </Card>
    </div>
  );
}
