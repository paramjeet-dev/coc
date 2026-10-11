import { cn } from "cn";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";

/** Small "Loading ..." strip shown at the top of route-level skeletons. */
export function LoadingBanner({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-ink-500">
      <Spinner size="sm" label={label} />
      {label}
    </p>
  );
}

export function PanelSkeleton({
  className,
  title = true,
  children,
}: {
  className?: string;
  title?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div aria-hidden className={cn("rounded-2xl bg-ink-900 p-5 ring-1 ring-ink-800 sm:p-6", className)}>
      {title && (
        <div className="mb-5 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-64 max-w-full" />
        </div>
      )}
      {children}
    </div>
  );
}

export function HeroSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("rounded-2xl bg-ink-900 p-6 ring-1 ring-ink-800 sm:p-8", className)}>
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-2xl" />
        <div className="space-y-2.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="ml-auto h-12 w-28" />
      </div>
      <StatRowSkeleton className="mt-8" />
    </div>
  );
}

export function StatRowSkeleton({ items = 4, className }: { items?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4", className)}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex h-56 items-end gap-2", className)}>
      {[40, 62, 48, 75, 58, 88, 70, 95, 80, 66, 84, 100].map((h, i) => (
        <Skeleton key={i} className="flex-1 rounded-t-md rounded-b-none" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 6, className }: { rows?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("space-y-3", className)}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-8 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 8, cols = 5, className }: { rows?: number; cols?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("space-y-3", className)}>
      <div className="flex gap-4 border-b border-ink-800 pb-3">
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton key={i} className={cn("h-3", i === 1 ? "w-32 flex-1" : "w-16")} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex items-center gap-4">
          {Array.from({ length: cols }, (_, c) => (
            <Skeleton key={c} className={cn("h-4", c === 1 ? "w-32 flex-1" : "w-16")} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function PillsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-hidden className="flex flex-wrap gap-1.5">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-8 w-24 rounded-full" />
      ))}
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <div aria-hidden className="space-y-3">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-9 w-72 max-w-full" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
  );
}
