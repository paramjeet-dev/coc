import type { Metadata } from "next";
import { PlayerSearch } from "@/components/search/player-search";

export const metadata: Metadata = { title: "Find a player" };

export default function PlayerIndexPage() {
  return (
    <div className="mx-auto max-w-2xl pt-10">
      <h1 className="text-3xl font-semibold tracking-tight">Find a player</h1>
      <p className="mt-3 text-ink-300">
        Search by name or paste a tag. Profiles open on the Legends history tab.
      </p>
      <div className="mt-6">
        <PlayerSearch size="lg" />
      </div>
    </div>
  );
}
