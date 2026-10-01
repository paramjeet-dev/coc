import type { Metadata } from "next";
import { PhaseStub } from "@/components/ui/phase-stub";

export const metadata: Metadata = { title: "Clans" };

export default function ClansPage() {
  return (
    <PhaseStub
      title="Clans"
      summary="Search a clan to open its Legend summary, season finishes and war record."
      endpoints={["GET /v2/clan/search", "GET /v2/clan/{tag}/cached"]}
    />
  );
}
