import type { Metadata } from "next";
import { PhaseStub } from "@/components/ui/phase-stub";

export const metadata: Metadata = { title: "Meta armies" };

export default function MetaPage() {
  return (
    <PhaseStub
      title="Meta armies"
      summary="Army families ranked by usage and triple rate, filterable by cohort, heroes and equipment."
      endpoints={[
        "GET /v2/stats/armies",
        "GET /v2/stats/armies/detail",
        "GET /v2/stats/armies/timeline",
        "GET /v2/stats/legend/days",
      ]}
    />
  );
}
