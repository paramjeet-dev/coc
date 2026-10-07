import { AssetIcon } from "./asset-icon";
import { formatCompact } from "@/lib/format";

const KIND = { gold: "gold", elixir: "elixir", darkElixir: "dark_elixir" } as const;
const NAME = { gold: "gold", elixir: "elixir", darkElixir: "dark elixir" } as const;

export function ResourceAmount({ kind, amount }: { kind: keyof typeof KIND; amount: number }) {
  return (
    <span className="inline-flex items-center gap-1" title={NAME[kind]}>
      <AssetIcon name={KIND[kind]} size={14} label={NAME[kind]} />
      <span>{formatCompact(amount)}</span>
    </span>
  );
}
