import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ClanSearch } from "@/components/search/clan-search";

export const metadata: Metadata = { title: "Clans" };

export default function ClansPage() {
  return (
    <div className="max-w-2xl space-y-6 pt-4">
      <PageHeader
        eyebrow="Clans"
        title="Find a clan"
        description="Search a clan to see how its players finished each Legend season, who carried the roster, and where it ranks."
      />
      <ClanSearch />
    </div>
  );
}
