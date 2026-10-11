import type { Metadata } from "next";
import { PlayerSearch } from "@/components/search/player-search";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Players" };

export default function PlayersPage() {
  return (
    <div className="max-w-2xl space-y-6 pt-4">
      <PageHeader
        eyebrow="Players"
        title="Find a player"
        description="Search by name or paste a player tag to open Legend history, ranked seasons and the battle log."
      />
      <PlayerSearch size="lg" />
    </div>
  );
}
