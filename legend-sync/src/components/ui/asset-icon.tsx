"use client";

import { useState } from "react";
import { UI_ICON_EMOJI, uiIcon, type UiIcon } from "@/lib/assets";

type Props = { name: UiIcon; size?: number; muted?: boolean; label?: string; className?: string };

/** Game asset glyph that falls back to an emoji if the image cannot load. */
export function AssetIcon({ name, size = 16, muted = false, label, className = "" }: Props) {
  const [failed, setFailed] = useState(false);
  const dim = muted ? "opacity-25 grayscale" : "";
  const a11y = label ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true as const };

  if (failed) {
    return (
      <span {...a11y} className={`inline-block shrink-0 leading-none ${dim} ${className}`} style={{ fontSize: size * 0.9 }}>
        {UI_ICON_EMOJI[name]}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={uiIcon(name)}
      alt={label ?? ""}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`inline-block shrink-0 object-contain ${dim} ${className}`}
    />
  );
}
