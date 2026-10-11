import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

/** Status line under or inside a search box. Floats when `floating` so it never moves the layout. */
export function SearchStatus({
  status,
  noun,
  floating,
}: {
  status: "idle" | "loading" | "empty" | "error";
  noun: "player" | "clan";
  floating: boolean;
}) {
  if (status === "idle") return null;
  const box = floating
    ? "absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-ink-700 bg-ink-900 p-3 shadow-2xl shadow-black/50"
    : "mt-2 px-2";

  if (status === "loading") {
    return (
      <div className={box}>
        <p className="flex items-center gap-3 text-sm text-ink-300">
          <Spinner size="sm" label={`Searching ${noun}s`} />
          Searching {noun}s
        </p>
        {floating && (
          <div className="mt-3 space-y-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  if (status === "empty") {
    return (
      <p className={`${box} flex items-center gap-2 text-sm text-ink-500`}>
        <Search aria-hidden className="size-4 shrink-0" />
        No {noun}s match that name. Try the {noun} tag, for example #2PP.
      </p>
    );
  }
  return (
    <p className={`${box} text-sm text-ember-400`}>
      Search is unavailable right now. Paste a {noun} tag to open it directly.
    </p>
  );
}

export const RESULT_LIST =
  "absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-ink-700 bg-ink-900 shadow-2xl shadow-black/50";
