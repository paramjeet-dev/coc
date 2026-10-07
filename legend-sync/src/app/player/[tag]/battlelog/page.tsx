import type { Metadata } from "next";
import { ArmyTable } from "@/components/battlelog/army-table";
import { BattleList } from "@/components/battlelog/battle-list";
import { Filters } from "@/components/battlelog/filters";
import { ModeSummaryBlock } from "@/components/battlelog/mode-summary";
import { Panel } from "@/components/ui/panel";
import { getBattlelogHistory } from "@/lib/api/endpoints";
import { normalizeTag } from "@/lib/api/tags";
import type { ModeFilter } from "@/lib/battlelog";
import {
  armyUsage,
  filterByMode,
  groupByUtcDay,
  newestFirst,
  parseMode,
  parseRange,
  summarizeByMode,
} from "@/lib/battlelog";

export const metadata: Metadata = { title: "Battle log" };

const MS_DAY = 86_400_000;
const LIST_CAP = 150;

export const dynamic = "force-dynamic";

export default async function PlayerBattlelogPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ mode?: string; range?: string }>;
}) {
  const { tag: slug } = await params;
  const query = await searchParams;
  const tag = normalizeTag(slug);
  const mode = parseMode(query.mode);
  const range = parseRange(query.range);
  const basePath = `/player/${slug.toUpperCase().replace(/^#/, "")}/battlelog`;

  const after = new Date(Date.now() - range * MS_DAY).toISOString();
  const result = await getBattlelogHistory(tag, after).then(
    (r) => ({ ok: true as const, items: newestFirst(r.items) }),
    () => ({ ok: false as const, items: [] }),
  );

  if (!result.ok) {
    return (
      <Panel className="rounded-2xl p-8">
        <h2 className="text-xl font-semibold tracking-tight">The battle log could not be loaded</h2>
        <p className="mt-2 max-w-prose text-ink-300">
          The stats service did not answer. Try again in a moment.
        </p>
      </Panel>
    );
  }

  const all = result.items;
  const visible = filterByMode(all, mode);
  const counts = (["all", "legend", "ranked", "farming"] as ModeFilter[]).reduce(
    (acc, m) => ({ ...acc, [m]: filterByMode(all, m).length }),
    {} as Record<ModeFilter, number>,
  );

  if (all.length === 0) {
    return (
      <div className="space-y-5">
        <Filters basePath={basePath} mode={mode} range={range} counts={counts} />
        <Panel className="rounded-2xl p-8">
          <h2 className="text-xl font-semibold tracking-tight">No stored attacks in this window</h2>
          <p className="mt-2 max-w-prose text-ink-300">
            Attacks are stored once the tracker sees them. Widen the window, or check back after the
            player's next attack.
          </p>
        </Panel>
      </div>
    );
  }

  const shown = visible.slice(0, LIST_CAP);
  const groups = groupByUtcDay(shown);
  const armies = armyUsage(visible).slice(0, 8);

  return (
    <div className="space-y-6">
      <Filters basePath={basePath} mode={mode} range={range} counts={counts} />
      <ModeSummaryBlock summaries={summarizeByMode(all)} />

      <div className="grid gap-5 lg:grid-cols-12">
        <Panel
          title="Attacks"
          description={`Newest first, times in UTC.${visible.length > LIST_CAP ? ` Showing the latest ${LIST_CAP} of ${visible.length}.` : ""}`}
          className="rounded-3xl p-6 sm:p-8 lg:col-span-8"
        >
          {groups.length > 0 ? (
            <BattleList groups={groups} />
          ) : (
            <p className="text-sm text-ink-300">No attacks for this mode in the window.</p>
          )}
        </Panel>

        <Panel
          title="Armies used"
          description="Grouped by share code, most used first."
          className="rounded-tile p-6 lg:col-span-4 lg:self-start"
        >
          <ArmyTable armies={armies} />
        </Panel>
      </div>
    </div>
  );
}
