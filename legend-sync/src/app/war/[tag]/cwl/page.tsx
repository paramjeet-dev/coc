import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CwlStandings } from "@/components/cwl/cwl-standings";
import { RoundList } from "@/components/cwl/round-list";
import { PlayerTotals } from "@/components/war/player-totals";
import { WarDetail } from "@/components/war/war-detail";
import { Panel } from "@/components/ui/panel";
import { apiUrl } from "@/lib/api/client";
import { getCwlGroup, getCwlSeasons } from "@/lib/api/endpoints";
import { isValidTag, normalizeTag, tagToSlug } from "@/lib/api/tags";
import { toNum } from "@/lib/api/types";
import { computeStandings, finishedWars, ourRounds } from "@/lib/cwl";
import { formatInt } from "@/lib/format";
import { playerTotals } from "@/lib/war";

export const metadata: Metadata = { title: "Clan War League" };

export default async function CwlPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ season?: string; round?: string }>;
}) {
  const { tag: slug } = await params;
  const q = await searchParams;
  if (!isValidTag(slug)) notFound();
  const tag = normalizeTag(slug);
  const basePath = `/war/${tagToSlug(tag)}/cwl`;

  const seasonsR = await getCwlSeasons(tag).then(
    (r) => ({ ok: true as const, seasons: [...r.items].sort((a, b) => b.season.localeCompare(a.season)) }),
    () => ({ ok: false as const, seasons: [] }),
  );

  const back = <Link href={`/war/${tagToSlug(tag)}`} className="text-sm text-tide-400 hover:underline">Back to regular wars</Link>;

  if (!seasonsR.ok) {
    return (
      <div className="space-y-4">
        {back}
        <Panel className="rounded-2xl p-8">
          <h2 className="text-xl font-semibold tracking-tight">CWL history could not be loaded</h2>
          <p className="mt-2 max-w-prose text-ink-300">The stats service did not answer. Try again in a moment.</p>
        </Panel>
      </div>
    );
  }

  const seasons = seasonsR.seasons;
  if (seasons.length === 0) {
    return (
      <div className="space-y-4">
        {back}
        <Panel className="rounded-2xl p-8">
          <h2 className="text-xl font-semibold tracking-tight">No CWL seasons stored for {tag}</h2>
          <p className="mt-2 max-w-prose text-ink-300">League seasons appear once the tracker has seen this clan in a league group.</p>
        </Panel>
      </div>
    );
  }

  const current = seasons.find((s) => s.season === q.season) ?? seasons[0];
  const group = await getCwlGroup(tag, current.season).catch(() => null);

  const rounds = group ? ourRounds(group, tag) : [];
  const standings = group ? computeStandings(group) : [];
  const finished = finishedWars(rounds);
  const totals = playerTotals(finished);
  const roundNumber = Number(q.round) || (rounds.filter((r) => r.war).at(-1)?.number ?? 1);
  const selected = rounds.find((r) => r.number === roundNumber)?.war ?? null;
  const rank = toNum(current.rank);
  const won = toNum(current.rounds?.won);
  const lost = toNum(current.rounds?.lost);
  const tied = toNum(current.rounds?.tied);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {back}
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Clan War League</h1>
          <p className="font-mono text-sm text-ink-500">{tag}</p>
        </div>
        <a
          href={apiUrl(`/v2/exports/war/cwl-summary?tag=${encodeURIComponent(tag)}`)}
          className="rounded-full bg-ink-800 px-4 py-2 text-sm text-ink-100 outline-none ring-1 ring-ink-700 hover:bg-ink-700 focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          Download CWL summary (.xlsx)
        </a>
      </header>

      <div className="grid gap-5 lg:grid-cols-12">
        <section className="rounded-panel bg-ink-800 p-6 sm:p-8 lg:col-span-8">
          <p className="text-sm text-ink-300">{current.season}{current.warLeague ? `, ${current.warLeague.name}` : ""}</p>
          <p className="mt-1 font-mono text-5xl font-semibold tabular-nums text-gold-300">{rank ? `#${rank}` : "n/a"}</p>
          <p className="text-sm text-ink-300">final placement in the group</p>
          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
            {[
              ["Rounds", won === null ? "n/a" : `${won}W ${lost ?? 0}L ${tied ?? 0}T`],
              ["Total stars", formatInt(toNum(current.stars))],
              ["Destruction", `${formatInt(Math.round(toNum(current.destruction) ?? 0))}%`],
              ["War size", current.warSize ? `${toNum(current.warSize)}v${toNum(current.warSize)}` : "n/a"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-ink-500">{label}</dt>
                <dd className="font-mono text-lg tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Panel title="Seasons" className="rounded-2xl p-5 lg:col-span-4 lg:row-span-2">
          <nav aria-label="CWL seasons">
            <ol className="max-h-[28rem] space-y-1 overflow-y-auto pr-1">
              {seasons.map((s) => {
                const active = s.season === current.season;
                return (
                  <li key={s.season}>
                    <Link
                      href={`${basePath}?season=${encodeURIComponent(s.season)}`}
                      scroll={false}
                      aria-current={active ? "true" : undefined}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                        active ? "bg-ink-800 ring-1 ring-gold-600" : "hover:bg-ink-800/70"
                      }`}
                    >
                      <span>
                        <span className="block font-medium">{s.season}</span>
                        <span className="block text-xs text-ink-500">{s.warLeague?.name ?? "League unknown"}</span>
                      </span>
                      <span className="font-mono text-sm tabular-nums text-gold-300">{toNum(s.rank) ? `#${toNum(s.rank)}` : "n/a"}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>
        </Panel>

        {!group ? (
          <Panel className="rounded-2xl p-6 lg:col-span-8">
            <p className="text-sm text-ink-300">The league group for this season could not be loaded.</p>
          </Panel>
        ) : (
          <>
            <Panel
              title="Group standings"
              description="Worked out from finished wars here: wins, then stars, then destruction."
              className="rounded-3xl p-6 lg:col-span-7"
            >
              <CwlStandings rows={standings} tag={tag} />
            </Panel>
            <Panel title="Your rounds" className="rounded-2xl p-5 lg:col-span-5">
              <RoundList rounds={rounds} basePath={basePath} season={current.season} selected={roundNumber} />
            </Panel>
            {selected && (
              <Panel
                title={`Round ${roundNumber}: ${selected.us.name} vs ${selected.them.name}`}
                className="rounded-3xl p-6 sm:p-8 lg:col-span-12"
              >
                <WarDetail item={selected} />
              </Panel>
            )}
            {totals.length > 0 && (
              <Panel
                title="Player totals"
                description={`Across ${finished.length} finished round${finished.length === 1 ? "" : "s"}, best average stars first.`}
                className="rounded-2xl p-6 lg:col-span-12"
              >
                <PlayerTotals rows={totals} />
              </Panel>
            )}
          </>
        )}
      </div>
    </div>
  );
}
