import { CloudSun } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card/50 p-12 text-center">
      <CloudSun
        aria-hidden="true"
        className="size-12 text-accent [stroke-width:1.5]"
      />
      <div>
        <p className="text-lg font-medium">No city yet</p>
        <p className="mt-1 text-muted-foreground">
          Search for a city to see the current weather and 5-day forecast.
        </p>
      </div>
    </div>
  );
}
