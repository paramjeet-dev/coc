"use client";

import { useState } from "react";

type Props = { src: string; name: string; size?: number; className?: string };

/** Game art for a troop, spell, hero, pet or equipment. Falls back to a two letter chip if the image is missing. */
export function ArmyIcon({ src, name, size = 28, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        aria-hidden
        className={`grid shrink-0 place-items-center rounded-md bg-ink-800 font-mono text-[0.6rem] font-semibold uppercase text-ink-300 ${className}`}
        style={{ width: size, height: size }}
      >
        {name.replace(/[^A-Za-z]/g, "").slice(0, 2)}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`shrink-0 rounded-md object-contain ${className}`}
    />
  );
}
