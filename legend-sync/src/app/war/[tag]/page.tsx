import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PlayerTotals } from "@/components/war/player-totals";
import { WarDetail } from "@/components/war/war-detail";
import { WarList } from "@/components/war/war-list";
import { Panel } from "@/components/ui/panel";
import { getClanWars } from "@/lib/api/endpoints";
import { isValidTag, normalizeTag, tagToSlug } from "@/lib/api/tags";
import { formatPercent } from "@/lib/format";
import { endedOnly, orient, playerTotals, warRecord } from "@/lib/war";

export const metadata: Metadata = { title: "Clan wars" };

export default async function ClanWarPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ war?: string }>;
}) {
  const { tag: slug } = await params;
  const { war } = await searchParams;
  if (!isValidTag(slug)) notFound();
  const tag = normalizeTag(slug);
  const basePath = `/war/${tagToSlug(tag)}`;

  const result = await getClanWars(tag, 40).then(
    (r) => ({ ok: true as const, wars: endedOnly(r.items).map((w) => orient(w, tag)) }),
    () => ({ ok: false as const, wars: [] }),
  );

  if (!result.ok) {
    return (
      <Panel className="rounded-2xl p-8">
        <h2 className="text-xl font-semibold tracking-tight">Wars could not be loaded</h2>
        <p className="mt-2 max-w-prose text-ink-300">The stats service did not answer. Try again in a moment.</p>
      </Panel>
    );
  }

  const wars = result.wars;
  if (wars.length === 0) {
    return (
      <div className="space-y-4">
        <Link href="/war" className="text-sm text-tide-400 hover:underline">Back to war analytics</Link>
        <Panel className="rounded-2xl p-8">
          <h2 className="text-xl font-semibold tracking-tight">No finished wars stored for {tag}</h2>
          <p className="mt-2 max-w-prose text-ink-300">Wars are stored once the tracker has watched them end. Check the tag, or try again after the clan's next war.</p>
        </Panel>
      </div>
    );
  }

  const current = wars.find((w) => w.slug === war) ?? wars[0];
  const record = warRecord(wars);
  const totals = playerTotals(wars);
  const clanName = wars[0].us.name;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/war" className="text-sm text-tide-400 hover:underline">War analytics</Link>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{clanName}</h1>
          <p className="font-mono text-sm text-ink-500">{tag}, last {wars.length} stored wars</p>
        </div>
        <nav aria-label="Clan links" className="flex gap-5 text-sm">
          <Link href={`/war/${tagToSlug(tag)}/cwl`} className="text-tide-400 hover:underline">Clan War League</Link>
          <Link href={`/clans/${tagToSlug(tag)}`} className="text-tide-400 hover:underline">Open clan page</Link>
        </nav>
      </header>

      <section className="grid gap-5 lg:grid-cols-12">
        <div className="rounded-panel bg-ink-800 p-6 sm:p-8 lg:col-span-5">
          <p className="text-sm text-ink-300">Record over {record.played} wars</p>
          <p className="mt-1 font-mono text-5xl font-semibold tabular-nums text-gold-300">
            {record.wins}-{record.losses}
            {record.ties > 0 ? <span className="text-2xl text-ink-300">-{record.ties}</span> : null}
          </p>
          <p className="text-sm text-ink-300">{formatPercent(record.winRate, 0)} win rate</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            {[
              ["Avg stars per attack", record.averageStars === null ? "n/a" : record.averageStars.toFixed(2)],
              ["Triple rate", formatPercent(record.tripleRate, 0)],
              ["Avg destruction", formatPercent(record.averageDestruction, 0)],
              ["Missed attacks", `${record.missedAttacks} of ${record.attacksAvailable}`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-ink-500">{label}</dt>
                <dd className="font-mono text-lg tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Panel title="Recent wars" className="rounded-2xl p-5 lg:col-span-7">
          <WarList wars={wars} basePath={basePath} selected={current.slug} />
        </Panel>

        <Panel
          title={`${current.us.name} vs ${current.them.name}`}
          className="rounded-3xl p-6 sm:p-8 lg:col-span-12"
        >
          <WarDetail item={current} />
        </Panel>

        <Panel
          title="Player totals"
          description={`Across the ${wars.length} wars above, best average stars first.`}
          className="rounded-2xl p-6 lg:col-span-12"
        >
          <PlayerTotals rows={totals} />
        </Panel>
      </section>
    </div>
  );
}
