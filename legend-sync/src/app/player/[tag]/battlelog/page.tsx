import { PhaseStub } from "@/components/ui/phase-stub";

export default async function PlayerBattlelogPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return (
    <PhaseStub
      title={`Battle log for #${tag.toUpperCase()}`}
      summary="Stored attacks across farming, ranked and Legend modes with army share codes."
      endpoints={["GET /v2/player/{playerTag}/battlelog/history"]}
    />
  );
}
