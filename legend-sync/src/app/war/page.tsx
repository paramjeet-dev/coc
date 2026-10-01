import type { Metadata } from "next";
import { PhaseStub } from "@/components/ui/phase-stub";

export const metadata: Metadata = { title: "War analytics" };

export default function WarPage() {
  return (
    <PhaseStub
      title="War analytics"
      summary="Hit rates by Town Hall matchup, player war stats and stored clan wars."
      endpoints={[
        "GET /v2/stats/war",
        "GET /v2/stats/wars/hitrates",
        "GET /v2/player/{playerTag}/war/stats",
        "GET /v2/clan/{clanTag}/wars",
      ]}
    />
  );
}
