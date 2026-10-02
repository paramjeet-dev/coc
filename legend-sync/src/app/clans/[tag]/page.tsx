import { PhaseStub } from "@/components/ui/phase-stub";

export default async function ClanPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return (
    <PhaseStub
      title={`Clan #${tag.toUpperCase()}`}
      summary="Legend summaries by season, top finishes and roster movement. Coming in phase 5."
    />
  );
}
