import type { Metadata } from "next";
import { ArmyDetail } from "@/components/meta/army-detail";
import { ArmyList } from "@/components/meta/army-list";
import { MetaControls } from "@/components/meta/meta-controls";
import { Panel } from "@/components/ui/panel";
import { getArmyFamily, getArmyTimeline, searchArmies } from "@/lib/api/endpoints";
import { formatInt, formatPercent } from "@/lib/format";
import { COHORTS, parseCohort, parseSort, tripleRate, totalAttacks } from "@/lib/meta";

export const metadata: Metadata = { title: "Meta armies" };

export default async function MetaPage({
  searchParams,
}: {
  searchParams: Promise<{ cohort?: string; sort?: string; army?: string }>;
}) {
  const q = await searchParams;
  const cohort = parseCohort(q.cohort);
  const sort = parseSort(q.sort);

  const cohortLabel = COHORTS.find((c) => c.value === cohort)?.label ?? cohort;

  const search = await searchArmies({ cohort, sort, minimumAttacks: 20, limit: 10 }).then(
    (r) => ({ ok: true as const, armies: r.items }),
    () => ({ ok: false as const, armies: [] }),
  );

  const selectedCode = q.army ?? search.armies[0]?.shareCode;

  const [detail, timeline] = selectedCode
    ? await Promise.allSettled([
      getArmyFamily(selectedCode, cohort),
      getArmyTimeline(selectedCode, cohort),
    ])
    : [null, null];
  const family = detail && detail.status === "fulfilled" ? detail.value : null;
  const days = timeline && timeline.status === "fulfilled" ? timeline.value : null;

  const totalSeen = search.armies[0]?.totalLegendAttacks ?? 0;
  const topTriple = search.armies.reduce((best, a) => Math.max(best, tripleRate(a.starCounts) ?? 0), 0);

  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Meta armies</h1>
        <p className="mt-2 text-ink-300">
          Army families used in Legend attacks, ranked from what the tracker has stored. Armies with fewer than 20 attacks are left out.
        </p>
      </header>

      <MetaControls cohort={cohort} sort={sort} army={q.army} />

      {!search.ok ? (
        <Panel className="rounded-2xl p-8">
          <h2 className="text-xl font-semibold tracking-tight">Army stats could not be loaded</h2>
          <p className="mt-2 max-w-prose text-ink-300">The stats service did not answer. Try again in a moment.</p>
        </Panel>
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-4 rounded-2xl bg-ink-800 p-5 text-sm sm:max-w-xl">
            {[
              [`${cohortLabel} attacks`, formatInt(totalSeen)],
              ["Families listed", String(search.armies.length)],
              ["Best triple rate", formatPercent(search.armies.length ? topTriple : null, 0)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-ink-500">{label}</dt>
                <dd className="font-mono text-xl tabular-nums text-gold-300">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-5 lg:grid-cols-12">
            <Panel title="Army families" className="rounded-3xl p-5 sm:p-6 lg:col-span-7">
              <ArmyList armies={search.armies} cohort={cohort} sort={sort} selected={selectedCode} />
            </Panel>
            <Panel className="rounded-3xl p-6 sm:p-8 lg:sticky lg:top-6 lg:col-span-5 lg:self-start">
              {family && totalAttacks(family.starCounts) > 0 ? (
                <ArmyDetail family={family} timeline={days} />
              ) : (
                <p className="text-sm text-ink-300">
                  {selectedCode
                    ? "No stored attacks for this army in the chosen cohort."
                    : "Pick an army to see its star outcomes and trend."}
                </p>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}
