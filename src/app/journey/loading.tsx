import { Card } from "@/components/ui/Card";

/**
 * Loading skeleton for the Journey page.
 */
export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-4 w-24 rounded-full bg-white/8" />
        <div className="h-9 w-64 rounded-full bg-white/8" />
        <div className="h-4 w-full max-w-xl rounded-full bg-white/8" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-10 w-24 shrink-0 rounded-full bg-white/8" />
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 w-40 rounded-full bg-white/8" />
                <div className="h-3 w-28 rounded-full bg-white/8" />
              </div>
              <div className="h-3 w-16 rounded-full bg-white/8" />
            </div>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-4">
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-16 rounded-xl bg-white/8" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
