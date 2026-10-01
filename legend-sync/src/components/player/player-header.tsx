import Image from "next/image";
import { formatInt } from "@/lib/format";
import type { LegendSeasonRecord, PlayerRankings, PlayerSearchHit } from "@/lib/api/types";

type Props = {
  tag: string;
  latest: LegendSeasonRecord | null;
  profile: PlayerSearchHit | null;
  rankings: PlayerRankings | null;
};

export function PlayerHeader({ tag, latest, profile, rankings }: Props) {
  const name = profile?.name ?? latest?.name ?? tag;
  const clanName = profile?.clan?.name ?? latest?.clan?.name;
  const badge = latest?.clan?.badgeUrls?.small;
  const home = rankings?.homeVillage;

  const facts: Array<[string, string]> = [];
  if (home?.globalRank != null) facts.push(["Global rank", formatInt(home.globalRank)]);
  if (home?.localRank != null) {
    facts.push([`${rankings?.location?.name ?? "Local"} rank`, formatInt(home.localRank)]);
  }
  if (profile) facts.push(["Town Hall", formatInt(profile.townHallLevel)]);

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          {badge && <Image src={badge} alt="" width={40} height={40} className="size-10" />}
          <h1 className="truncate text-4xl font-semibold tracking-tight">{name}</h1>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-ink-300">
          <span className="font-mono tabular-nums text-ink-100">{tag}</span>
          {clanName && <span>{clanName}</span>}
        </p>
      </div>

      <dl className="flex flex-wrap items-end gap-x-8 gap-y-3">
        {home?.trophies != null && (
          <div>
            <dt className="text-sm text-ink-300">Trophies</dt>
            <dd className="font-mono text-4xl font-semibold tabular-nums text-gold-300">
              {formatInt(home.trophies)}
            </dd>
          </div>
        )}
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm text-ink-300">{label}</dt>
            <dd className="font-mono text-xl tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
