import { ChartSkeleton, HeroSkeleton, ListSkeleton, LoadingBanner, PanelSkeleton, TableSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <LoadingBanner label="Loading clan" />
      <div aria-hidden className="flex items-center gap-5">
        <Skeleton className="size-[88px] rounded-2xl" />
        <div className="space-y-3"><Skeleton className="h-8 w-64" /><Skeleton className="h-3 w-40" /></div>
      </div>
      <div className="grid gap-5 lg:grid-cols-12">
        <HeroSkeleton className="lg:col-span-8" />
        <PanelSkeleton className="lg:col-span-4 lg:row-span-2"><ListSkeleton rows={8} /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-8"><ChartSkeleton className="h-44" /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-12"><TableSkeleton rows={8} cols={6} /></PanelSkeleton>
      </div>
    </div>
  );
}
