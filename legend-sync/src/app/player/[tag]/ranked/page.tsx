import { PhaseStub } from "@/components/ui/phase-stub";

export default async function PlayerRankedPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return (
    <PhaseStub
      title={`Ranked seasons for #${tag.toUpperCase()}`}
      summary="Tournament group standings, placement and tier percentiles for every ranked season."
      endpoints={[
        "GET /v2/player/{playerTag}/league/history",
        "GET /v2/player/{playerTag}/ranked/{season}/group",
        "GET /v2/player/{playerTag}/ranked/{seasonId}/battlelog",
        "GET /v2/stats/league/tournaments/{seasonId}/tiers/{leagueTierId}",
      ]}
    />
  );
}
