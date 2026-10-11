import type { Metadata } from "next";
import { ClanSearch } from "@/components/search/clan-search";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "War" };

export default function WarLandingPage() {
  return (
    <div className="max-w-2xl space-y-6 pt-4">
      <PageHeader
        eyebrow="War"
        title="Find a clan's wars"
        description="Search a clan to see its stored wars, hit rates and Clan War League seasons."
      />
      <ClanSearch basePath="/war" />
    </div>
  );
}
