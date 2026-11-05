export function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-slate-200 motion-reduce:animate-none dark:bg-slate-800 ${className}`}
    />
  );
}

/** Mirrors <Card /> so the layout doesn't jump when data arrives. */
export function CardSkeleton() {
  return (
    <div className="surface p-5">
      <div className="mb-5 flex items-start justify-between">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <Skeleton className="mb-3 h-6 w-2/3" />
      <Skeleton className="mb-2 h-3.5 w-full" />
      <Skeleton className="mb-5 h-3.5 w-4/5" />
      <Skeleton className="mb-4 h-3.5 w-24" />
      <Skeleton className="mb-5 h-2.5 w-full rounded-full" />
      <div className="flex justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="surface p-5">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="mt-3 h-8 w-14" />
      <Skeleton className="mt-3 h-3 w-24" />
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-14 rounded-lg" />
          <Skeleton className="h-9 w-16 rounded-lg" />
        </div>
      </div>
      <div className="mt-5 space-y-2 border-t border-slate-100 pt-5 dark:border-slate-800">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
