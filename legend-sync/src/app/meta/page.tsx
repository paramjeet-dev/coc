import type { Metadata } from "next";
import { ArmyDetail } from "@/components/meta/army-detail";
import { ArmyList } from "@/components/meta/army-list";
import { MetaControls } from "@/components/meta/meta-controls";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";
import { StatGrid } from "@/components/ui/stat";
import { getArmyFamily, getArmyTimeline, searchArmies } from "@/lib/api/endpoints";
import { formatInt, formatPercent } from "@/lib/format";
import { armyKey } from "@/lib/army";
import { COHORTS, mergeFamilies, mergeTimelines, parseCohort, parseSort, tripleRate, totalAttacks } from "@/lib/meta";
import type { ArmyFamily, ArmyTimeline } from "@/lib/api/types";

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

  const search = await searchArmies({ cohort, sort, minimumAttacks: 20, limit: 40 }).then(
    (r) => ({ ok: true as const, armies: mergeFamilies(r.items, sort, 10) }),
    () => ({ ok: false as const, armies: [] }),
  );

  const selectedCode = q.army ?? search.armies[0]?.shareCode;

  // A selected code can be any variant of a listed army, so match on the canonical key.
  const selectedKey = selectedCode ? armyKey(selectedCode) : null;
  const group = search.armies.find((a) => armyKey(a.shareCode) === selectedKey) ?? null;
  const variantCodes = group?.variantCodes ?? (selectedCode ? [selectedCode] : []);

  const [detail, timelines] = selectedCode
    ? await Promise.all([
        group ? Promise.resolve<ArmyFamily>(group) : getArmyFamily(selectedCode, cohort).catch(() => null),
        Promise.allSettled(variantCodes.slice(0, 6).map((code) => getArmyTimeline(code, cohort))),
      ])
    : [null, []];
  const family = detail ?? null;
  const days = mergeTimelines(
    timelines.flatMap((t) => (t.status === "fulfilled" ? [t.value as ArmyTimeline] : [])),
  );

  const totalSeen = search.armies[0]?.totalLegendAttacks ?? 0;
  const topTriple = search.armies.reduce((best, a) => Math.max(best, tripleRate(a.starCounts) ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Telemetry"
        title="Meta armies"
        description="Army families used in Legend attacks, ranked from what the tracker has stored. Armies with fewer than 20 attacks are left out."
      />

      <MetaControls cohort={cohort} sort={sort} army={q.army} />

      {!search.ok ? (
        <EmptyState tone="error" title="Army stats could not be loaded">
          The stats service did not answer. Try again in a moment.
        </EmptyState>
      ) : (
        <>
          <Panel className="sm:max-w-2xl" title={undefined}>
            <StatGrid
              size="lg"
              className="grid-cols-3 sm:grid-cols-3"
              items={[
                { label: `${cohortLabel} attacks`, value: formatInt(totalSeen), tone: "gold" },
                { label: "Families listed", value: String(search.armies.length) },
                { label: "Best triple rate", value: formatPercent(search.armies.length ? topTriple : null, 0), tone: "tide" },
              ]}
            />
          </Panel>

          <div className="grid gap-5 lg:grid-cols-12">
            <Panel title="Army families" eyebrow="Leaderboard" className="lg:col-span-7">
              <ArmyList armies={search.armies} cohort={cohort} sort={sort} selected={selectedCode} />
            </Panel>
            <Panel className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
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
