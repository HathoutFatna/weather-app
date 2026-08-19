import { Skeleton } from "@/components/ui/Skeleton";

/** Mirrors the success layout so content doesn't jump when data lands. */
export function WeatherSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
      <Skeleton className="h-96" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-36" />
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="flex-1 basis-14" />
        ))}
      </div>
    </div>
  );
}
