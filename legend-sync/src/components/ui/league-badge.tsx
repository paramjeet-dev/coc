import Image from "next/image";
import { leagueTierIcon } from "@/lib/assets";

/** League icon. The name stays available as alt text and as a hover tooltip. */
export function LeagueBadge({
  name,
  size = 32,
  className = "",
}: {
  name: string | null | undefined;
  size?: number;
  className?: string;
}) {
  return (
    <span title={name ?? "Legend League"} className={`inline-flex shrink-0 ${className}`}>
      <Image
        src={leagueTierIcon(name)}
        alt={name ?? "Legend League"}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        unoptimized
      />
    </span>
  );
}
