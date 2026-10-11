import { ChartSkeleton, ListSkeleton, LoadingBanner, PanelSkeleton } from "@/components/ui/skeletons";

/** Body skeleton for tab switches. The header and tabs stay on screen. */
export default function Loading() {
  return (
    <div className="space-y-5">
      <LoadingBanner label="Loading" />
      <div className="grid gap-5 lg:grid-cols-12">
        <PanelSkeleton className="lg:col-span-8"><ChartSkeleton className="h-72" /></PanelSkeleton>
        <PanelSkeleton className="lg:col-span-4"><ListSkeleton rows={6} /></PanelSkeleton>
      </div>
    </div>
  );
}
