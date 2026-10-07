import { AssetIcon } from "@/components/ui/asset-icon";

/** Three star glyphs from the game assets, dimmed for the ones not earned. */
export function StarMarks({ stars, size = 16 }: { stars: number; size?: number }) {
  return (
    <span role="img" aria-label={`${stars} of 3 stars`} className="inline-flex items-center gap-0.5">
      {[1, 2, 3].map((n) => (
        <AssetIcon key={n} name="star" size={size} muted={n > stars} />
      ))}
    </span>
  );
}
