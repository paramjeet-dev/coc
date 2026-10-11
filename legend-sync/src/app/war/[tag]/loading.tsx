import { HeaderSkeleton, HeroSkeleton, ListSkeleton, LoadingBanner, PanelSkeleton, PillsSkeleton, TableSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <LoadingBanner label="Loading wars" />
      <HeaderSkeleton />
      <PillsSkeleton count={3} />
      <div className="grid gap-5 lg:grid-cols-12">
        <HeroSkeleton className="lg:col-span-5" />
        <PanelSkeleton className="lg:col-span-7"><ListSkeleton rows={6} /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-12"><TableSkeleton rows={8} cols={6} /></PanelSkeleton>
      </div>
    </div>
  );
}
