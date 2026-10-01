import { FeatureIndex } from "@/components/dashboard/feature-index";
import { LiveLedger } from "@/components/dashboard/live-ledger";
import { SeasonCalendar } from "@/components/dashboard/season-calendar";
import { TrophyHistogram } from "@/components/dashboard/trophy-histogram";
import { PlayerSearch } from "@/components/search/player-search";
import { Panel } from "@/components/ui/panel";
import { getCurrentDates, getGlobalCounts, getLegendTrophyBuckets } from "@/lib/api/endpoints";

export default async function HomePage() {
  const [counts, dates, buckets] = await Promise.allSettled([
    getGlobalCounts(),
    getCurrentDates(),
    getLegendTrophyBuckets(),
  ]);

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <Panel className="rounded-panel p-6 sm:p-8 lg:col-span-8">
        <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          Where does your Legend day stand?
        </h1>
        <p className="mt-4 max-w-prose text-ink-300">
          Every Legend League player, grouped by trophies. Search a name or tag to see where you
          sit and how your last seasons went.
        </p>
        <div className="mt-6">
          <PlayerSearch size="lg" />
        </div>
        <div className="mt-10">
          <TrophyHistogram buckets={buckets.status === "fulfilled" ? buckets.value.items : []} />
        </div>
      </Panel>

      <Panel
        title="Tracked right now"
        className="rounded-tile p-6 lg:col-span-4 lg:self-start"
      >
        <LiveLedger counts={counts.status === "fulfilled" ? counts.value : null} />
      </Panel>

      <Panel
        title="What you can look up"
        className="rounded-3xl p-6 sm:p-8 lg:col-span-7"
      >
        <FeatureIndex />
      </Panel>

      <Panel
        title="Event calendar"
        description="Dates the tracker is currently using for the live season."
        className="rounded-2xl p-6 lg:col-span-5 lg:self-start"
      >
        <SeasonCalendar dates={dates.status === "fulfilled" ? dates.value : null} />
      </Panel>
    </div>
  );
}
