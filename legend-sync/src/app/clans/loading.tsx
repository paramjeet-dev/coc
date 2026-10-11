import { HeaderSkeleton, LoadingBanner } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-2xl space-y-6 pt-4">
      <LoadingBanner label="Loading" />
      <HeaderSkeleton />
      <Skeleton className="h-14 w-full max-w-xl rounded-2xl" />
    </div>
  );
}
