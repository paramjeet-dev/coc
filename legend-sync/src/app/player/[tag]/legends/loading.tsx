import { ChartSkeleton, LoadingBanner, PanelSkeleton, StatRowSkeleton, TableSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="space-y-5">
      <LoadingBanner label="Loading Legend history" />
      <div className="grid gap-5 lg:grid-cols-12">
        <PanelSkeleton className="lg:col-span-8"><ChartSkeleton className="h-72" /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-4"><StatRowSkeleton items={7} className="grid-cols-1 sm:grid-cols-1" /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-7"><ChartSkeleton className="h-40" /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-5"><ChartSkeleton className="h-40" /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-12"><TableSkeleton rows={4} cols={5} /></PanelSkeleton>
      </div>
    </div>
  );
}
