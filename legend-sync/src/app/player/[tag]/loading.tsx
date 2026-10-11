import { ChartSkeleton, HeroSkeleton, ListSkeleton, LoadingBanner, PanelSkeleton, TableSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="space-y-5">
      <LoadingBanner label="Loading ranked seasons" />
      <div className="grid gap-5 lg:grid-cols-12">
        <HeroSkeleton className="lg:col-span-8" />
        <PanelSkeleton className="lg:col-span-4 lg:row-span-2"><ListSkeleton rows={8} /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-8"><ChartSkeleton className="h-28" /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-5"><ChartSkeleton className="h-44" /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-7"><TableSkeleton rows={7} cols={6} /></PanelSkeleton>
      </div>
    </div>
  );
}
