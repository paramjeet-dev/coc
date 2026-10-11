import { ChartSkeleton, HeroSkeleton, LoadingBanner, PanelSkeleton, PillsSkeleton, StatRowSkeleton } from "@/components/ui/skeletons";

/** Covers the player layout (header and tabs) while it fetches. */
export default function Loading() {
  return (
    <div className="space-y-8">
      <LoadingBanner label="Loading player" />
      <HeroSkeleton />
      <PillsSkeleton count={3} />
      <div className="grid gap-5 lg:grid-cols-12">
        <PanelSkeleton className="lg:col-span-8"><ChartSkeleton className="h-72" /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-4"><StatRowSkeleton items={6} className="grid-cols-1 sm:grid-cols-1" /></PanelSkeleton>
      </div>
    </div>
  );
}
