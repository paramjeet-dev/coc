import Image from "next/image";
import { formatInt } from "@/lib/format";
import { LeagueBadge } from "@/components/ui/league-badge";
import { legendLandscape, townHallIcon } from "@/lib/assets";
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
  const thIcon = townHallIcon(profile?.townHallLevel);
  const leagueName = profile?.leagueTier?.name ?? latest?.leagueTier?.name;

  const facts: Array<[string, string]> = [];
  if (home?.globalRank != null) facts.push(["Global rank", formatInt(home.globalRank)]);
  if (home?.localRank != null) {
    facts.push([`${rankings?.location?.name ?? "Local"} rank`, formatInt(home.localRank)]);
  }
  if (profile) facts.push(["Town Hall", formatInt(profile.townHallLevel)]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink-900 ring-1 ring-gold-400/20">
      <Image
        src={legendLandscape()}
        alt=""
        fill
        sizes="(min-width: 1280px) 1280px, 100vw"
        className="object-cover object-center opacity-25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/85 to-ink-900/20"
      />

      <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="flex min-w-0 items-center gap-5">
          {thIcon && (
            <Image
              src={thIcon}
              alt={`Town Hall ${formatInt(profile?.townHallLevel)}`}
              width={72}
              height={72}
              className="size-16 shrink-0 sm:size-[72px]"
            />
          )}
          <div className="min-w-0">
            <p className="mb-2 flex flex-wrap items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em]">
              {leagueName && <LeagueBadge name={leagueName} size={36} className="-ml-1" />}
              {profile && (
                <span className="rounded-full bg-ink-800/80 px-2.5 py-1 text-ink-300 ring-1 ring-ink-700">
                  TH{formatInt(profile.townHallLevel)}
                </span>
              )}
            </p>
            <h1 className="truncate text-3xl font-semibold tracking-tight sm:text-4xl">{name}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-300">
              <span className="font-mono tabular-nums text-tide-400">{tag}</span>
              {clanName && (
                <span className="flex items-center gap-1.5">
                  {badge && <Image src={badge} alt="" width={20} height={20} className="size-5" />}
                  {clanName}
                </span>
              )}
            </p>
          </div>
        </div>

        <dl className="flex flex-wrap items-end gap-x-8 gap-y-3">
          {home?.trophies != null && (
            <div>
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-500">Trophies</dt>
              <dd className="flex items-center gap-2 font-mono text-5xl font-semibold tabular-nums text-gold-300">
                {formatInt(home.trophies)}
              </dd>
            </div>
          )}
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-500">{label}</dt>
              <dd className="font-mono text-xl tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
