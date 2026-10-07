import { toNum, type Num } from "./api/types";

export const ASSET_BASE = "https://assets.clashk.ing";

export function assetUrl(path: string): string {
  return `${ASSET_BASE}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/** "Legend League 2" becomes "legend_league_2", matching the manifest file names. */
export function assetSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function townHallIcon(level: Num | null | undefined): string | null {
  const n = toNum(level);
  return n && n >= 1 && n <= 18 ? assetUrl(`buildings/home-village/town_hall/level_${n}.webp`) : null;
}

export function leagueTierIcon(name: string | null | undefined): string {
  return assetUrl(`leagues/league-tier/${name ? assetSlug(name) : "legend_league"}.png`);
}

export const heroIcon = (name: string) => assetUrl(`heroes/${assetSlug(name)}/icon.webp`);
export const petIcon = (name: string) => assetUrl(`pets/${assetSlug(name)}/icon.webp`);
export const troopIcon = (name: string) => assetUrl(`troops/${assetSlug(name)}/icon.webp`);
export const spellIcon = (name: string) => assetUrl(`spells/${assetSlug(name)}.webp`);
export const equipmentIcon = (name: string) => assetUrl(`equipment/${assetSlug(name)}.webp`);

export const legendLandscape = () => assetUrl("landscape/legend-landscape.png");

/**
 * Every glyph has an emoji fallback in components/ui/asset-icon.tsx, so a wrong
 * path degrades to the emoji instead of a broken image.
 */
export type UiIcon =
  | "star"
  | "star_empty"
  | "gold"
  | "elixir"
  | "dark_elixir"
  | "defense"
  | "attack"
  | "trophy"
  | "clock";

export const UI_ICON_PATH: Record<UiIcon, string> = {
  star: "ui/star.png",
  star_empty: "ui/star_empty.png",
  gold: "resources/gold.webp",
  elixir: "resources/elixir.webp",
  dark_elixir: "resources/dark_elixir.webp",
  defense: "ui/defense.png",
  attack: "ui/attack.png",
  trophy: "ui/trophy.png",
  clock: "ui/clock.png",
};

export const UI_ICON_EMOJI: Record<UiIcon, string> = {
  star: "\u2B50",
  star_empty: "\u2B50",
  gold: "\uD83E\uDE99",
  elixir: "\uD83D\uDCA7",
  dark_elixir: "\uD83D\uDDA4",
  defense: "\uD83D\uDEE1\uFE0F",
  attack: "\u2694\uFE0F",
  trophy: "\uD83C\uDFC6",
  clock: "\u23F1\uFE0F",
};

export const uiIcon = (name: UiIcon) => assetUrl(UI_ICON_PATH[name]);
