import type { Metadata } from "next";
import { PhaseStub } from "@/components/ui/phase-stub";

export const metadata: Metadata = { title: "War analytics" };

export default function WarPage() {
  return (
    <PhaseStub
      title="War analytics"
      summary="Hit rates by Town Hall matchup, player war stats and stored clan wars. Coming in phase 6."
    />
  );
}
