import { ChartSkeleton, HeaderSkeleton, ListSkeleton, LoadingBanner, PanelSkeleton, PillsSkeleton, StatRowSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <LoadingBanner label="Loading meta armies" />
      <HeaderSkeleton />
      <PillsSkeleton count={4} />
      <PanelSkeleton title={false} className="sm:max-w-xl"><StatRowSkeleton items={3} /></PanelSkeleton>
      <div className="grid gap-5 lg:grid-cols-12">
        <PanelSkeleton className="lg:col-span-7"><ListSkeleton rows={7} /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-5"><StatRowSkeleton items={4} className="mb-6" /><ChartSkeleton className="h-44" /></PanelSkeleton>
      </div>
    </div>
  );
}
