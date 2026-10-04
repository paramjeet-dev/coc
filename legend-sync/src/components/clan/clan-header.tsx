import Image from "next/image";
import { formatInt } from "@/lib/format";
import { toNum, type ClanProfile } from "@/lib/api/types";

export function ClanHeader({ profile, tag }: { profile: ClanProfile | null; tag: string }) {
  if (!profile) {
    return (
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Clan {tag}</h1>
        <p className="mt-2 text-ink-300">Profile details are not cached for this clan yet. Legend history below is still shown if it was tracked.</p>
      </header>
    );
  }
  return (
    <header className="flex flex-wrap items-center gap-5">
      <Image src={profile.badgeUrls.large} alt="" width={88} height={88} className="size-[88px]" unoptimized />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-3xl font-semibold tracking-tight">{profile.name}</h1>
        <p className="mt-1 font-mono text-sm text-ink-500">
          {profile.tag}
          {profile.location ? <span className="font-sans"> / {profile.location.name}</span> : null}
        </p>
        {profile.description ? <p className="mt-2 line-clamp-2 max-w-prose text-sm text-ink-300">{profile.description}</p> : null}
      </div>
      <dl className="grid grid-cols-3 gap-5 text-sm">
        {[
          ["Level", String(toNum(profile.clanLevel) ?? "n/a")],
          ["Members", `${formatInt(profile.memberCount)}/50`],
          ["War league", profile.warLeague?.name ?? "n/a"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-ink-500">{label}</dt>
            <dd className="font-mono text-base tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
