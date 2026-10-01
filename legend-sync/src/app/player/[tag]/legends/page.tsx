import { PhaseStub } from "@/components/ui/phase-stub";

export default async function PlayerLegendsPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return (
    <PhaseStub
      title={`Legends history for #${tag.toUpperCase()}`}
      summary="Daily trophy series, per day attack and defense breakdown, and past season finishes."
      endpoints={[
        "GET /v2/player/{playerTag}/legend/series",
        "GET /v2/player/{playerTag}/legend/{day}/battlelog",
        "GET /v2/player/{tag}/legend-history",
        "GET /v2/player/{playerTag}/leaderboard-history/{leaderboardType}",
      ]}
    />
  );
}
