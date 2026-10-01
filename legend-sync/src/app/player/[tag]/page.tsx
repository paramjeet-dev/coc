import { PhaseStub } from "@/components/ui/phase-stub";

export default async function PlayerOverviewPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return (
    <PhaseStub
      title={`Player #${tag.toUpperCase()}`}
      summary="Profile header and tab navigation arrive in phase 1, together with Legends history."
      endpoints={[
        "GET /v2/player/{playerTag}/legend/series",
        "GET /v2/player/{tag}/legend-history",
        "GET /v2/legends/ranks",
      ]}
    />
  );
}
