import { notFound } from "next/navigation";
import { PlayerHeader } from "@/components/player/player-header";
import { PlayerTabs } from "@/components/player/player-tabs";
import { getLegendHistory, getPlayerRankings, searchPlayers } from "@/lib/api/endpoints";
import { isValidTag, normalizeTag } from "@/lib/api/tags";
import { compareSeasons } from "@/lib/legend";

/** Player data changes every few minutes, so never serve a cached copy of these pages. */
export const dynamic = "force-dynamic";

export default async function PlayerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tag: string }>;
}) {
  const { tag: slug } = await params;
  if (!isValidTag(slug)) notFound();
  const tag = normalizeTag(slug);

  const [history, rankings, search] = await Promise.allSettled([
    getLegendHistory(tag),
    getPlayerRankings(tag),
    searchPlayers(tag, 5),
  ]);

  const seasons = history.status === "fulfilled" ? history.value.items : [];
  const latest = [...seasons].sort((a, b) => compareSeasons(b.season, a.season))[0] ?? null;
  const profile =
    search.status === "fulfilled"
      ? (search.value.items.find((hit) => hit.tag === tag) ?? null)
      : null;

  return (
    <div className="space-y-8">
      <PlayerHeader
        tag={tag}
        latest={latest}
        profile={profile}
        rankings={rankings.status === "fulfilled" ? rankings.value : null}
      />
      <PlayerTabs slug={slug.toUpperCase().replace(/^#/, "")} />
      {children}
    </div>
  );
}
