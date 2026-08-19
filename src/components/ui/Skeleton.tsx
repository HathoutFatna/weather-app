export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-3xl bg-secondary motion-reduce:animate-none ${className}`}
    />
  );
}
