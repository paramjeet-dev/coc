import { PhaseStub } from "@/components/ui/phase-stub";

export default async function PlayerRankedPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return (
    <PhaseStub
      title={`Ranked seasons for #${tag.toUpperCase()}`}
      summary="Tournament group standings, placement and tier percentiles for every ranked season. Coming in phase 3."
    />
  );
}
