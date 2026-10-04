import type { Metadata } from "next";
import { ClanSearch } from "@/components/search/clan-search";

export const metadata: Metadata = { title: "Clans" };

export default function ClansPage() {
  return (
    <div className="max-w-2xl space-y-6 pt-4">
      <h1 className="text-3xl font-semibold tracking-tight">Clans</h1>
      <p className="text-ink-300">
        Search a clan to see how its players finished each Legend season, who carried the roster, and where it ranks.
      </p>
      <ClanSearch />
    </div>
  );
}
