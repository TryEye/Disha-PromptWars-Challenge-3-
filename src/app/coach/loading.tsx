import { Card } from "@/components/ui/Card";

/**
 * Loading skeleton for the Coach page.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-5">
      <div className="space-y-2">
        <div className="h-4 w-40 rounded-full bg-white/8" />
        <div className="h-9 w-full max-w-2xl rounded-full bg-white/8" />
        <div className="h-4 w-full max-w-xl rounded-full bg-white/8" />
      </div>

      <Card className="p-5">
        <div className="space-y-3">
          <div className="h-4 w-32 rounded-full bg-white/8" />
          <div className="h-4 w-full rounded-full bg-white/8" />
          <div className="h-4 w-5/6 rounded-full bg-white/8" />
        </div>
      </Card>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="ml-auto w-[78%] p-4">
            <div className="h-4 w-full rounded-full bg-white/8" />
          </Card>
        ))}
      </div>

      <div className="sticky bottom-4">
        <Card className="p-4">
          <div className="h-12 rounded-xl bg-white/8" />
        </Card>
      </div>
    </div>
  );
}
