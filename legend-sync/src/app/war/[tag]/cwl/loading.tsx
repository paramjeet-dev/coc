import { HeaderSkeleton, HeroSkeleton, ListSkeleton, LoadingBanner, PanelSkeleton, TableSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <LoadingBanner label="Loading Clan War League" />
      <HeaderSkeleton />
      <div className="grid gap-5 lg:grid-cols-12">
        <HeroSkeleton className="lg:col-span-8" />
        <PanelSkeleton className="lg:col-span-4 lg:row-span-2"><ListSkeleton rows={7} /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-7"><TableSkeleton rows={8} cols={5} /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-5"><ListSkeleton rows={7} /></PanelSkeleton>
      </div>
    </div>
  );
}
