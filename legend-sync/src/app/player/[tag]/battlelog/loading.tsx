import { ListSkeleton, LoadingBanner, PanelSkeleton, PillsSkeleton, StatRowSkeleton, TableSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <LoadingBanner label="Loading battle log" />
      <PillsSkeleton count={4} />
      <div className="grid gap-5 lg:grid-cols-12">
        <PanelSkeleton title={false} className="lg:col-span-5"><StatRowSkeleton items={3} /></PanelSkeleton>
        <PanelSkeleton title={false} className="lg:col-span-7"><TableSkeleton rows={3} cols={5} /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-8"><ListSkeleton rows={9} /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-4"><ListSkeleton rows={4} /></PanelSkeleton>
      </div>
    </div>
  );
}
